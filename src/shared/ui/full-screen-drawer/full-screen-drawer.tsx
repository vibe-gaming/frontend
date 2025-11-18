import { Button, Dialog, Drawer, Text, useMediaQuery } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { LuX } from 'react-icons/lu'

export interface FullScreenDrawerProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    headerContent?: ReactNode
}

export const FullScreenDrawer = ({ isOpen, onClose, children, headerContent }: FullScreenDrawerProps) => {
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
                                        variant="outline"
                                        size="xl"
                                        color={"gray.fg"}
                                        aria-label="Закрыть"
                                        rounded="xl"
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
                            {children}
                        </Dialog.Body>
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
                                variant="ghost"
                                size="2xl"
                                onClick={onClose}
                                p={4}
                                border={'none'}
                                minW="auto"
                                h="auto"
                                aria-label="Закрыть"
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
                        {children}
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Positioner>
        </Drawer.Root>
    )
}

