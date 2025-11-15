import ReactDOM from 'react-dom/client'

import { App } from '@/app/index'

// Render the app
const rootElement = document.querySelector('#app')
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(<App />)
}
