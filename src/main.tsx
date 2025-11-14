import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/shared/styles/global.scss'

import { App } from './app'

createRoot(document.querySelector('#root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
