import { Outlet } from '@tanstack/react-router'
import { PopularBenefits } from '@/widgets/popular-benefits'

import styles from './home-page.module.scss'

export const HomePage = () => {
    return (
        <div className={styles['home-page']}>
            <h1>HomePage</h1>
            <PopularBenefits />
            <Outlet />
        </div>
    )
}
