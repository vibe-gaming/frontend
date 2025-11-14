import { createRouter, RouterProvider } from '@tanstack/react-router'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import ReactDOM from 'react-dom/client'

import '@/shared/styles/global.scss'

import * as TanstackQuery from './app/providers/tanstack-query/root-provider.tsx'
// Import the generated route tree
import { routeTree } from './app/route-tree.generated'
import type { MyRouterContext } from './app/routes/__root'

dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.locale('ru')
dayjs.extend(relativeTime)

// Create a new router instance s
const router = createRouter({
    routeTree,
    context: {
        ...TanstackQuery.getContext(),
        // auth: {
        //     profile: undefined!,
        // },
    } as MyRouterContext,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    notFoundMode: 'root',
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
const rootElement = document.querySelector('#app')
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(<Main />)
}

function Main() {
    return (
        <TanstackQuery.Provider>
            <SetupRouter />
            {/* <NetworkStatus />
            <TechnicalPauseAlert />
            <SetupToast /> */}
        </TanstackQuery.Provider>
    )
}

// TODO: Move to another file
function SetupRouter() {
    return (
        <RouterProvider
            router={router}
            // context={{
            //     auth: {
            //         profile,
            //     },
            // }}
        />
    )
}
