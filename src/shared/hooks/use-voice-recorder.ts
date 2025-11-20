import { useState, useRef, useCallback } from 'react'

export interface UseVoiceRecorderReturn {
    isRecording: boolean
    startRecording: () => Promise<void>
    stopRecording: () => Promise<Blob | null>
}

export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const chunksRef = useRef<Blob[]>([])

    const startRecording = useCallback(async () => {
        try {
            // Запрашиваем доступ к микрофону
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            })
            streamRef.current = stream

            // Определяем подходящий MIME тип
            // Пробуем форматы в порядке предпочтения
            let mimeType = 'audio/webm;codecs=opus'
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/webm'
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'audio/mp4'
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        mimeType = '' // Используем дефолтный формат браузера
                    }
                }
            }

            console.log('Используемый MIME тип для записи:', mimeType || 'default')

            // Создаем MediaRecorder
            const options = mimeType ? { mimeType } : {}
            const mediaRecorder = new MediaRecorder(stream, options)
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            // Обработчик получения данных
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data)
                }
            }

            // Начинаем запись
            // Собираем данные каждые 100ms для более плавной записи
            mediaRecorder.start(100)
            setIsRecording(true)

            console.log('Запись началась')
        } catch (error) {
            console.error('Не удалось начать запись:', error)
            setIsRecording(false)
            throw error
        }
    }, [])

    const stopRecording = useCallback(async () => {
        return new Promise<Blob | null>((resolve) => {
            if (!isRecording || !mediaRecorderRef.current) {
                resolve(null)
                return
            }

            const mediaRecorder = mediaRecorderRef.current

            // Обработчик завершения записи
            mediaRecorder.onstop = () => {
                console.log('Запись остановлена, собрано чанков:', chunksRef.current.length)

                // Создаем финальный blob из всех чанков
                const mimeType = mediaRecorder.mimeType || 'audio/webm'
                const blob = new Blob(chunksRef.current, { type: mimeType })

                console.log('Создан blob:', blob.size, 'байт, тип:', blob.type)

                // Очищаем ресурсы
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop())
                }

                // Сброс состояния
                mediaRecorderRef.current = null
                streamRef.current = null
                chunksRef.current = []
                setIsRecording(false)

                resolve(blob)
            }

            // Останавливаем запись
            mediaRecorder.stop()
        })
    }, [isRecording])

    return {
        isRecording,
        startRecording,
        stopRecording,
    }
}
