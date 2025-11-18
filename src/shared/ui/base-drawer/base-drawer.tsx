import { forwardRef, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Box, Button, Drawer, HStack } from '@chakra-ui/react'
import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion'
import { useDrag } from '@use-gesture/react'

import { LuX } from 'react-icons/lu'

export interface BaseDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: ReactNode
    footer: ReactNode
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
        const backdropOpacityString = useTransform(backdropOpacity, (value) => String(value))
        
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
                setIsClosing(false)
            } else {
                y.set(0)
                backdropOpacity.set(1)
                setIsClosing(false)
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
                    const drawerHeight = contentRef.current?.offsetHeight || window.innerHeight * 0.9
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
                open={isOpen && !isClosing}
                onOpenChange={(e) => {
                    if (!e.open && !isClosing) {
                        handleClose()
                    } else if (e.open) {
                        y.set(0)
                        setIsClosing(false)
                    }
                }}
                placement="bottom"
                closeOnInteractOutside={false}
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
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleClose()
                        }}
                        onPointerDown={(e) => {
                            // Для touch устройств используем onPointerDown
                            if (e.target === e.currentTarget) {
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
                        mt={4}
                        borderTopRadius="2xl"
                        maxH={DRAWER_HEIGHT}
                        style={{
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <motion.div
                            ref={contentRef}
                            style={{
                                y: springY,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
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
                                    w="40px"
                                    h="4px"
                                    bg="gray.300"
                                    borderRadius="full"
                                    mx="auto"
                                    mt={3}
                                    mb={2}
                                />
                                <Drawer.Header
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    pb={4}
                                    pt={2}
                                    style={{ flexShrink: 0 }}
                                >
                                <Box flex={1} />
                                <Drawer.Title flex={1} textAlign="center" fontSize={'2xl'}>
                                    {title}
                                </Drawer.Title>
                                <Box flex={1} display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="ghost"
                                        size="2xl"
                                        onClick={handleClose}
                                        p={4}
                                        border={'none'}
                                        minW="auto"
                                        h="auto"
                                    >
                                        <LuX size={20} />
                                    </Button>
                                </Box>
                            </Drawer.Header>
                            </Box>
                            <Drawer.Body 
                                px={6} 
                                py={0} 
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
                            <Drawer.Footer 
                                px={4} 
                                pt={2} 
                                pb={4}
                                style={{ flexShrink: 0 }}
                            >
                                {footer}
                            </Drawer.Footer>
                        </motion.div>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        )
    }
)

BaseDrawer.displayName = 'BaseDrawer'

