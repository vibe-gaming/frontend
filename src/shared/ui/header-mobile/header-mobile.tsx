import React from 'react'

import { useSidebarIsOpen } from '@/shared/model'

import { Burger } from '../burger'
import styles from './header-mobile.module.scss'

interface HeaderMobileProps {
    title?: string
    prefixElement?: React.ReactNode
    postfixElement?: React.ReactNode
    footer?: React.ReactNode
}

export const HeaderMobile = ({
    title,
    prefixElement,
    postfixElement,
    footer,
}: HeaderMobileProps) => {
    const { setIsOpen } = useSidebarIsOpen()

    return (
        <header className={styles['header-mobile']}>
            <div style={{ width: 32, gridArea: 'prefix' }}>
                {prefixElement ?? <Burger onClick={() => setIsOpen(true)} />}
            </div>
            {title && <h1 className={styles['header-mobile__title']}>{title}</h1>}
            <div style={{ width: 32, gridArea: 'postfix' }}>{postfixElement}</div>
            {footer && <div className={styles['header-mobile__footer']}>{footer}</div>}
        </header>
    )
}
