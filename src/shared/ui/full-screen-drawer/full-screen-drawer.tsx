import { Button, Dialog, Drawer, Text, useMediaQuery, Box, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { LuX } from 'react-icons/lu'

export interface FullScreenDrawerProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    headerContent?: ReactNode
    title?: string
    footer?: ReactNode
}

export const FullScreenDrawer = ({ isOpen, onClose, children, headerContent, title, footer }: FullScreenDrawerProps) => {
    const [isDesktop] = useMediaQuery(["(min-width: 768px)"])

    // На десктопе используем Dialog (модальное окно по центру)
    if (isDesktop) {
        return (
            <Dialog.Root
                open={isOpen}
                onOpenChange={(e) => {
                    if (!e.open) {
                        onClose()
                    }
                }}
                scrollBehavior="outside"
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="512px"
                        w="90vw"
                        borderRadius="2xl"
                        mt={"60px"}
                        mb={"60px"}
                    >
                        <Dialog.Header
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            pb={"88px"}
                        >
                            {headerContent || (
                                <Dialog.CloseTrigger asChild top={"24px"} right={"24px"} >
                                    <Button
                                        _active={{ bg: 'gray.50' }}
                                        aria-label="Закрыть"
                                        colorPalette='gray'
                                        rounded="xl"
                                        size="xl"
                                        transition='all 0.2s'
                                        variant="outline"
                                    >
                                        <LuX size={20} /> <Text fontSize="lg" color={"gray.fg"} lineHeight="28px" fontWeight="normal">Закрыть</Text>
                                    </Button>
                                </Dialog.CloseTrigger>  
                            )}
                        </Dialog.Header>

                        <Dialog.Body
                            px={6}
                            py={0}
                        >
                            {title && (
                                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                                    {title}
                                </Text>
                            )}
                            {children}
                        </Dialog.Body>
                        {footer && (
                            <Dialog.Footer px={6} pt={4} pb={6}>
                                {footer}
                            </Dialog.Footer>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        )
    }

    // На мобильных используем Drawer (полноэкранный снизу)
    return (
        <Drawer.Root
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) {
                    onClose()
                }
            }}
            placement="bottom"
            closeOnInteractOutside={false}
        >
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <Drawer.Content
                    h="100vh"
                    mt={0}
                    borderTopRadius="0"
                    style={{
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                    }}
                >
                    <Drawer.Header
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        {headerContent || (
                            <Button
                                aria-label="Закрыть"
                                border={'none'}
                                colorPalette='gray'
                                h="auto"
                                minW="auto"
                                p={4}
                                size="2xl"
                                variant="ghost"
                                onClick={onClose}
                            >
                                <LuX size={20} />
                            </Button>
                        )}
                    </Drawer.Header>

                    <Drawer.Body
                        px={4}
                        py={0}
                        style={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        {title && (
                            <Text fontSize="2xl" fontWeight="bold" mb={4}>
                                {title}
                            </Text>
                        )}
                        {children}
                    </Drawer.Body>
                    {footer && (
                        <Box px={4} pt={4} pb={6} borderTop="1px solid" borderColor="border">
                            {footer}
                        </Box>
                    )}
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    )
}

