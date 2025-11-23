import { Center, Text } from '@chakra-ui/react'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

export interface MyRouterContext {
    queryClient: QueryClient
    isAuthenticated?: boolean
    isUserRegistered?: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
})

function Root() {
    if (!globalThis.location.hostname.includes('localhost')) {
        return (
            <Center minH='100dvh' minW='100dvw'>
                <Text>Ведутся технические работы</Text>
            </Center>
        )
    }

    return (
        <>
            <Outlet />
        </>
    )
}
