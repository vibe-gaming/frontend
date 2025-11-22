import { useEffect } from 'react'
import { HStack, IconButton, Input, Spinner, useMediaQuery } from '@chakra-ui/react'
import isEqual from 'lodash.isequal'
import { Controller, useForm } from 'react-hook-form'
import { LuMic } from 'react-icons/lu'
import { useDebouncedCallback } from 'use-debounce'

import type { BenefitsSearchParams } from '@/entities/benefits'
import { usePostSpeechRecognize } from '@/shared/api/generated'
import { useVoiceRecorder } from '@/shared/hooks/use-voice-recorder'

export interface BenefitsSearchFormValues extends Pick<BenefitsSearchParams, 'search'> {}

interface BenefitsSearchFormProps {
    onSubmit: (values: BenefitsSearchFormValues) => void
    searchValues: BenefitsSearchFormValues
}

export const BenefitsSearchForm: React.FC<BenefitsSearchFormProps> = ({
    onSubmit,
    searchValues,
}) => {
    const [isDesktop] = useMediaQuery(['(min-width: 768px)'])

    const { control, handleSubmit, getValues, setValue, reset, watch } =
        useForm<BenefitsSearchFormValues>({
            defaultValues: searchValues,
        })

    const debouncedSubmit = useDebouncedCallback(
        (values: BenefitsSearchFormValues) => onSubmit(values),
        600
    )

    useEffect(() => {
        if (!isDesktop) {
            return
        }

        // eslint-disable-next-line react-hooks/incompatible-library
        const subscription = watch((values) => {
            if (isEqual(values, searchValues)) {
                return
            }

            debouncedSubmit(values as BenefitsSearchFormValues)
        })

        return () => subscription.unsubscribe()
    }, [watch, isDesktop, debouncedSubmit, searchValues])

    useEffect(() => {
        const values = getValues()

        if (values.search !== searchValues.search) {
            if (searchValues.search) {
                setValue('search', searchValues.search)
            } else {
                console.log('empty')
                reset(
                    {
                        search: '',
                    },
                    { keepValues: false }
                )
            }
        }
    }, [searchValues.search, setValue, getValues, reset])

    // Голосовой поиск
    const { isRecording, startRecording, stopRecording } = useVoiceRecorder()

    const { mutate: recognizeSpeech, isPending: isRecognizing } = usePostSpeechRecognize({
        mutation: {
            onSuccess: (data) => {
                console.log('✅ Распознавание речи успешно:', data)
                if (data.text) {
                    console.log('🔍 Установка поискового запроса:', data.text)
                    onSubmit({ search: data.text })
                }
            },
            onError: (error) => {
                console.error('❌ Ошибка распознавания речи:', error)
            },
        },
        // Увеличенный таймаут для распознавания речи (120 секунд)
        client: {
            timeout: 120_000,
        },
    })

    const handleMicClick = async () => {
        if (isRecording) {
            const audioBlob = await stopRecording()
            if (audioBlob) {
                // Определяем расширение файла на основе MIME типа
                let extension = 'webm'
                if (audioBlob.type.includes('mp4')) {
                    extension = 'mp4'
                } else if (audioBlob.type.includes('mpeg') || audioBlob.type.includes('mp3')) {
                    extension = 'mp3'
                } else if (audioBlob.type.includes('wav')) {
                    extension = 'wav'
                }

                // Создаем File объект с правильным именем
                const audioFile = new File([audioBlob], `recording.${extension}`, {
                    type: audioBlob.type,
                })

                console.log(
                    'Отправка аудио файла:',
                    audioFile.name,
                    audioFile.type,
                    audioFile.size,
                    'байт'
                )
                recognizeSpeech({ data: { audio: audioFile } })
            }
        } else {
            await startRecording()
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <HStack gap={4}>
                <Controller
                    control={control}
                    name='search'
                    render={({ field }) => (
                        <Input
                            {...field}
                            bg='bg.muted'
                            enterKeyHint='search'
                            inputMode='search'
                            placeholder='Поиск по льготам'
                            rounded={'2xl'}
                            size='2xl'
                            type='search'
                            variant='subtle'
                            w='100%'
                        />
                    )}
                />
                <IconButton
                    aria-label='Voice Search'
                    bg='blue.solid'
                    colorPalette={isRecording ? 'red' : 'blue'}
                    disabled={isRecognizing}
                    rounded='xl'
                    size='2xl'
                    variant={isRecording ? 'solid' : 'subtle'}
                    onClick={handleMicClick}
                >
                    {isRecognizing ? <Spinner size='sm' /> : <LuMic color='#fff' size={24} />}
                </IconButton>
            </HStack>
        </form>
    )
}
