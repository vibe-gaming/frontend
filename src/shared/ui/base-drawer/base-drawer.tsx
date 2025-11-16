import { forwardRef, ReactNode } from 'react'
import { Box, Button, Drawer, HStack } from '@chakra-ui/react'

import { LuX } from 'react-icons/lu'

export interface BaseDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: ReactNode
    footer: ReactNode
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
}

export const BaseDrawer = forwardRef<HTMLDivElement, BaseDrawerProps>(
    ({ isOpen, onOpenChange, title, children, footer, onTouchStart, onTouchMove }, ref) => {
        return (
            <Drawer.Root
                open={isOpen}
                onOpenChange={(e) => onOpenChange(e.open)}
                placement="bottom"
                closeOnInteractOutside
            >
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content
                        ref={ref}
                        mt={4}
                        borderTopRadius="2xl"
                        maxH="90vh"
                        style={{
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                        }}
                        onTouchStart={onTouchStart}
                        onTouchMove={(e) => onTouchMove(e)}
                    >
                        {/* Индикатор свайпа */}
                        <Box
                            w="40px"
                            h="4px"
                            bg="gray.300"
                            borderRadius="full"
                            mx="auto"
                            mt={3}
                            mb={2}
                            onTouchStart={onTouchStart}
                            onTouchMove={(e) => onTouchMove(e)}
                            style={{ cursor: 'grab', touchAction: 'pan-y' }}
                        />
                        <Drawer.Header
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            pb={4}
                            pt={2}
                        >
                            <Box flex={1} />
                            <Drawer.Title flex={1} textAlign="center" fontSize={'2xl'}>
                                {title}
                            </Drawer.Title>
                            <Box flex={1} display="flex" justifyContent="flex-end">
                                <Button
                                    variant="ghost"
                                    size="2xl"
                                    onClick={() => onOpenChange(false)}
                                    p={4}
                                    border={'none'}
                                    minW="auto"
                                    h="auto"
                                >
                                    <LuX size={20} />
                                </Button>
                            </Box>
                        </Drawer.Header>
                        <Drawer.Body px={6} py={0}>
                            {children}
                        </Drawer.Body>
                        <Drawer.Footer px={4} pt={2} pb={4}>
                            {footer}
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        )
    }
)

BaseDrawer.displayName = 'BaseDrawer'

