import { Toaster } from 'sonner'

export const WithToast = () => {
    return (
        <Toaster
            closeButton
            richColors
            className={'toaster'}
            gap={8}
            position='top-center'
            swipeDirections={['top']}
            visibleToasts={6}
            toastOptions={{
                style: {
                    borderRadius: '16px',
                },
            }}
        />
    )
}
