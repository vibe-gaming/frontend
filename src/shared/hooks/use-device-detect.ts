import { useMemo } from 'react'

import { useWindowSize } from './use-window-size'

export const BREAKPOINTS = {
    MOBILE: 768,
    DESKTOP: 1440,
}

export const useDeviceDetect = () => {
    const { width } = useWindowSize()

    const breakpoint = useMemo(() => {
        if (width <= BREAKPOINTS.MOBILE) {
            return 0
        }

        return BREAKPOINTS.DESKTOP
    }, [width])

    return {
        breakpoint,
        isMobile: width <= BREAKPOINTS.MOBILE,
        isDesktop: width > BREAKPOINTS.MOBILE,
    }
}
