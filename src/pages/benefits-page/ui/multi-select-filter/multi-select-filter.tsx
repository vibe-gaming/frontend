import { Box, Button, Flex, Text } from '@chakra-ui/react'

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
        </Box>
    )
}

