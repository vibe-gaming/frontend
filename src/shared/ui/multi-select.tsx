import { Button, Checkbox, CheckboxGroup, useMediaQuery } from '@chakra-ui/react'
import type { ComponentProps } from 'react'

interface MultiSelectOption {
    value: string
    label: string
}

interface MultiSelectProps extends ComponentProps<typeof CheckboxGroup> {
    options: MultiSelectOption[]
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, ...props }) => {
    const [isMobile] = useMediaQuery(['(max-width: 767px)'])

    return (
        <CheckboxGroup
            align='flex-start'
            gap={4}
            pb='1.5'
            pt='1.5'
            {...props}
            {...(isMobile && {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                w: '100%',
            })}
        >
            {options.map((option) => {
                const isSelected = props.value?.includes(option.value)

                return (
                    <Checkbox.Root
                        key={option.value}
                        colorPalette='blue'
                        size='lg'
                        value={option.value}
                        variant='solid'
                    >
                        {isMobile ? (
                            <>
                                <Button
                                    bg={isSelected ? 'blue.muted' : 'transparent'}
                                    color={'blue.fg'}
                                    colorPalette='blue'
                                    rounded={'xl'}
                                    size='lg'
                                    variant={isSelected ? 'subtle' : 'outline'}
                                    onClick={() => {
                                        if (isSelected) {
                                            props.onValueChange?.(
                                                (props.value || []).filter(
                                                    (value) => value !== option.value
                                                )
                                            )
                                        } else {
                                            props.onValueChange?.([
                                                ...(props.value || []),
                                                option.value,
                                            ])
                                        }
                                    }}
                                >
                                    {option.label}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>{option.label}</Checkbox.Label>
                            </>
                        )}
                    </Checkbox.Root>
                )
            })}
        </CheckboxGroup>
    )
}
