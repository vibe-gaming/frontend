import { Box, Button, Checkbox, Flex, Text, useMediaQuery, VStack } from '@chakra-ui/react'

interface Option {
    value: string
    label: string
}

interface MultiSelectFilterProps {
    title: string
    options: readonly Option[]
    selectedValues: string[]
    onChange: (values: string[]) => void
}

export const MultiSelectFilter = ({
    title,
    options,
    selectedValues,
    onChange,
}: MultiSelectFilterProps) => {
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"])

    const handleToggle = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((v) => v !== value))
        } else {
            onChange([...selectedValues, value])
        }
    }

    return (
        <Box>
            <Text fontSize='xl' fontWeight='bold' mb={4}>
                {title}
            </Text>
            {isDesktop ? (
                <VStack align='stretch' gap={3}>
                    {options.map((option) => {
                        const isSelected = selectedValues.includes(option.value)
                        return (
                            <Checkbox.Root
                                key={option.value}
                                checked={isSelected}
                                onCheckedChange={() => handleToggle(option.value)}
                                colorPalette="blue"
                                size="lg"
                                variant="outline"
                                rounded="4xl"
                                fontSize="lg"
                                fontWeight="normal"
                                lineHeight="28px"
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>{option.label}</Checkbox.Label>
                            </Checkbox.Root>
                        )
                    })}
                </VStack>
            ) : (
                <Flex gap={4} wrap='wrap'>
                    {options.map((option) => {
                        const isSelected = selectedValues.includes(option.value)
                        return (
                            <Button
                                key={option.value}
                                size="lg"
                                colorPalette="blue"
                                variant={isSelected ? 'subtle' : 'outline'}
                                bg={isSelected ? 'blue.muted' : 'transparent'}
                                color={'blue.fg'}
                                rounded={'xl'}
                                onClick={() => handleToggle(option.value)}
                            >
                                {option.label}
                            </Button>
                        )
                    })}
                </Flex>
            )}
        </Box>
    )
}

