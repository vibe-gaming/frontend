import { useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const persistentStorage = createJSONStorage<boolean | undefined>(() => localStorage)

export const sidebarIsOpenAtom = atomWithStorage<boolean | undefined>(
    '@taxoparkee/sidebar-is-open',
    undefined,
    persistentStorage,
    {
        getOnInit: true,
    }
)

sidebarIsOpenAtom.onMount = (setAtom) => {
    if (globalThis.window === undefined) {
        return
    }

    setAtom((value) => {
        if (value === undefined) {
            return window.innerWidth > 1024
        }

        return value
    })
}

export const useSidebarIsOpen = () => {
    const [isOpen, setIsOpen] = useAtom(sidebarIsOpenAtom)

    return { isOpen, setIsOpen }
}
