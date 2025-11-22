import { forwardRef, type ReactNode, useEffect, useRef, useState } from 'react'
import { Box, Button, Drawer } from '@chakra-ui/react'
import { useDrag } from '@use-gesture/react'
import { animate, motion, useMotionValue, useSpring } from 'framer-motion'
import { LuX } from 'react-icons/lu'

export interface BaseDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: ReactNode
    footer?: ReactNode
}

const DRAWER_HEIGHT = '90vh'
const CLOSE_THRESHOLD_PERCENT = 0.25 // 25% от высоты drawer для закрытия
const VELOCITY_THRESHOLD = 0.3 // минимальная скорость для закрытия

export const BaseDrawer = forwardRef<HTMLDivElement, BaseDrawerProps>(
    ({ isOpen, onOpenChange, title, children, footer }, ref) => {
        const contentRef = useRef<HTMLDivElement>(null)
        const backdropRef = useRef<HTMLDivElement>(null)
        const [isClosing, setIsClosing] = useState(false)
        const y = useMotionValue(0)
        const backdropOpacity = useMotionValue(1)
        const springY = useSpring(y, {
            damping: 30,
            stiffness: 300,
        })

        // Синхронизируем backdrop opacity с позицией drawer
        useEffect(() => {
            const unsubscribe = y.on('change', (latest) => {
                const maxHeight = contentRef.current?.offsetHeight || window.innerHeight * 0.9
                const opacity = Math.max(0, Math.min(1, 1 - latest / (maxHeight * 0.5)))
                backdropOpacity.set(opacity)
            })

            return unsubscribe
        }, [y, backdropOpacity])

        useEffect(() => {
            if (isOpen) {
                y.set(0)
                backdropOpacity.set(1)
                setTimeout(() => {
                    setIsClosing(false)
                }, 0)
            } else {
                y.set(0)
                backdropOpacity.set(1)
                setTimeout(() => {
                    setIsClosing(false)
                }, 0)
            }
        }, [isOpen, y, backdropOpacity])

        const handleClose = () => {
            if (isClosing) return
            setIsClosing(true)

            // Получаем высоту drawer для анимации
            const drawerHeight = contentRef.current?.offsetHeight || window.innerHeight * 0.9

            // Анимируем закрытие синхронно - backdrop opacity будет обновляться через y.on('change')
            animate(y, drawerHeight, {
                type: 'spring',
                damping: 25,
                stiffness: 400,
                onComplete: () => {
                    // Завершаем закрытие после завершения анимации
                    onOpenChange(false)
                    y.set(0)
                    backdropOpacity.set(1)
                    setIsClosing(false)
                },
            })
        }

        const bind = useDrag(
            ({ movement: [, my], direction: [, dy], velocity: [, vy], active, last }) => {
                // Разрешаем свайп только вниз
                if (dy > 0 && active) {
                    y.set(Math.max(0, my))
                }

                // Когда отпустили
                if (last) {
                    // Вычисляем динамический порог закрытия на основе высоты drawer
                    const drawerHeight =
                        contentRef.current?.offsetHeight || window.innerHeight * 0.9
                    const closeThreshold = drawerHeight * CLOSE_THRESHOLD_PERCENT

                    const shouldClose = my > closeThreshold || (dy > 0 && vy > VELOCITY_THRESHOLD)

                    if (shouldClose) {
                        handleClose()
                    } else {
                        // Возвращаем обратно с пружиной
                        animate(y, 0, {
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                        })
                    }
                }
            },
            {
                from: () => [0, y.get()],
                bounds: { top: 0 },
                rubberband: 0.1,
                axis: 'y',
                filterTaps: true,
            }
        )

        return (
            <Drawer.Root
                closeOnInteractOutside={false}
                open={isOpen && !isClosing}
                placement='bottom'
                onOpenChange={(event) => {
                    if (!event.open && !isClosing) {
                        handleClose()
                    } else if (event.open) {
                        y.set(0)
                        setIsClosing(false)
                    }
                }}
            >
                <Drawer.Backdrop asChild>
                    <motion.div
                        ref={backdropRef}
                        style={{
                            opacity: backdropOpacity,
                            cursor: 'pointer',
                            width: '100%',
                            height: '100%',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1000,
                            pointerEvents: 'auto',
                        }}
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            handleClose()
                        }}
                        onPointerDown={(event) => {
                            // Для touch устройств используем onPointerDown
                            if (event.target === event.currentTarget) {
                                handleClose()
                            }
                        }}
                    />
                </Drawer.Backdrop>
                <Drawer.Positioner
                    style={{
                        zIndex: 1001,
                    }}
                >
                    <Drawer.Content
                        ref={ref}
                        borderTopRadius='2xl'
                        maxH={DRAWER_HEIGHT}
                        mt={4}
                        style={{
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <motion.div
                            ref={contentRef}
                            animate={{ y: 0 }}
                            initial={{ y: '100%' }}
                            style={{
                                y: springY,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                            transition={{
                                type: 'spring',
                                damping: 30,
                                stiffness: 300,
                            }}
                        >
                            {/* Индикатор свайпа и Header - здесь можно свайпать вниз */}
                            <Box
                                style={{
                                    cursor: 'grab',
                                    touchAction: 'pan-y',
                                    userSelect: 'none',
                                }}
                                {...(bind() as any)}
                            >
                                <Box
                                    bg='gray.300'
                                    borderRadius='full'
                                    h='4px'
                                    mb={2}
                                    mt={3}
                                    mx='auto'
                                    w='40px'
                                />
                                <Drawer.Header
                                    alignItems='center'
                                    display='flex'
                                    justifyContent='space-between'
                                    style={{ flexShrink: 0 }}
                                >
                                    <Box flex={1} />
                                    <Drawer.Title flex={1} fontSize={'2xl'} textAlign='center'>
                                        {title}
                                    </Drawer.Title>
                                    <Box display='flex' flex={1} justifyContent='flex-end'>
                                        <Button
                                            border={'none'}
                                            h='auto'
                                            minW='auto'
                                            p={4}
                                            size='2xl'
                                            variant='ghost'
                                            onClick={handleClose}
                                        >
                                            <LuX size={20} />
                                        </Button>
                                    </Box>
                                </Drawer.Header>
                            </Box>
                            <Drawer.Body
                                pb={6}
                                pt={4}
                                px={4}
                                style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    WebkitOverflowScrolling: 'touch',
                                    minHeight: 0,
                                }}
                            >
                                {children}
                            </Drawer.Body>
                            {footer && (
                                <Drawer.Footer p={4} style={{ flexShrink: 0 }}>
                                    {footer}
                                </Drawer.Footer>
                            )}
                        </motion.div>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        )
    }
)

BaseDrawer.displayName = 'BaseDrawer'
