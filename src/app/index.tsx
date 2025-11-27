import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

import { WithProviders } from './providers'

dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.locale('ru')
dayjs.extend(relativeTime)

export const App = () => {
    // if (
    //     !globalThis.location.hostname.includes('localhost') &&
    //     !globalThis.location.hostname.includes('netlify')
    // ) {
    //     return (
    //         <div
    //             style={{
    //                 minHeight: '100dvh',
    //                 minWidth: '100dvw',
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //             }}
    //         >
    //             <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
    //                 Ведутся технические работы
    //             </div>
    //         </div>
    //     )
    // }

    return <WithProviders />
}
