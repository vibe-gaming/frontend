import { Outlet } from '@tanstack/react-router'

import styles from './home-page.module.scss'

export const HomePage = () => {
    return (
        <div className={styles['home-page']}>
            <h1>HomePage</h1>
            <Outlet />
        </div>
    )
}
