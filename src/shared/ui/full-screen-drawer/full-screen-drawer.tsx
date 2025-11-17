import { Button, Drawer } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { LuX } from 'react-icons/lu'

export interface FullScreenDrawerProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    headerContent?: ReactNode
}

export const FullScreenDrawer = ({ isOpen, onClose, children, headerContent }: FullScreenDrawerProps) => {
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

