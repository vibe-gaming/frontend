import React from 'react'
import { createFileRoute, Navigate } from '@tanstack/react-router'

// import { useAuthIsAuthenticated } from '@/entities/auth'

export const Route = createFileRoute('/')({
    component: App,
})

function App() {
    // const { isAuthenticated } = useAuthIsAuthenticated()

    // if (isAuthenticated) {
    //     return <Navigate search={{ page: 1 }} to='/requests' />
    // }

    return <Navigate to='/login' />
}
