import React from 'react'
import clsx from 'clsx'

import styles from './burger.module.scss'

export interface BurgerProps {
    onClick?: () => void
    isOpen?: boolean
}

export const Burger: React.FC<BurgerProps> = ({ isOpen, onClick }) => {
    return (
        <div
            role='button'
            className={clsx(styles['burger'], {
                [styles['burger-open']]: isOpen,
            })}
            onClick={onClick}
        >
            <div className={styles['burger__icon']}>
                <span />
                <span />
                <span />
            </div>
        </div>
    )
}

Burger.displayName = 'Burger'
