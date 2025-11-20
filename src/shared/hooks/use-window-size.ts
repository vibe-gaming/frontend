import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'

export interface WindowSizeOptions {
    initialWidth?: number
    initialHeight?: number
}

// Локальная реализация useDebouncedCallback
function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout>()

    const debouncedCallback = useCallback(
        ((...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args)
            }, delay)
        }) as T,
        [callback, delay]
    )

    return debouncedCallback
}

export const useWindowSize = ({
    initialWidth = document.documentElement?.clientWidth,
    initialHeight = document.documentElement?.clientHeight,
}: WindowSizeOptions = {}) => {
    const [width, setWidth] = useState(initialWidth)
    const [height, setHeight] = useState(initialHeight)

    const handleResizeWindow = useDebouncedCallback(() => {
        if (document.documentElement === undefined) {
            return
        }

        const { clientWidth, clientHeight } = document.documentElement

        if (width === clientWidth && height === clientHeight) {
            return
        }
        setWidth(clientWidth)
        setHeight(clientHeight)
    }, 200)

    /**
     * После монтирования компонента вызываем handleResizeWindow для того, чтобы
     * обновить размеры окна, если они были изменены до монтирования компонента.
     */
    useLayoutEffect(() => {
        handleResizeWindow()
    }, [handleResizeWindow])

    React.useEffect(() => {
        window.addEventListener('resize', handleResizeWindow)

        return () => window.removeEventListener('resize', handleResizeWindow)
    }, [handleResizeWindow])

    return { width, height }
}
