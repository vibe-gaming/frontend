import React from 'react'

import styles from './auth-header-mobile.module.scss'

interface AuthHeaderMobileProps {
    title?: string
    postfixElement?: React.ReactNode
}

export const AuthHeaderMobile: React.FC<AuthHeaderMobileProps> = ({ title, postfixElement }) => {
    return (
        <header className={styles['auth-header-mobile']}>
            {title && <h1 className={styles['auth-header-mobile__title']}>{title}</h1>}
            <div style={{ width: 32, gridArea: 'postfix' }}>{postfixElement}</div>
        </header>
    )
}
