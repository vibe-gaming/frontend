import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

// import { type DomainUserRoleString, type UserModel } from '@/shared/api/private'
// import { Devtools } from '@/shared/ui/devtools/devtools'
// import { NotFound } from '@/shared/ui/not-found'

export interface MyRouterContext {
    queryClient: QueryClient
    // auth: {
    //     profile?: UserModel
    // }
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
    // notFoundComponent: NotFound,
})

function Root() {
    return (
        <>
            <Outlet />
            {/* {!location.hostname.includes('') && <Devtools />} */}
        </>
    )
}
