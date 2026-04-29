export type AppMessageType = 'success' | 'error' | 'info' | 'warning'

const ROOT_ID = '__cloud_gallery_app_message_root__'
const TOAST_DURATION = 2200

const paletteMap: Record<AppMessageType, { border: string; glow: string; text: string }> = {
    success: {
        border: 'rgba(34, 197, 94, 0.22)',
        glow: 'rgba(34, 197, 94, 0.14)',
        text: '#166534'
    },
    error: {
        border: 'rgba(239, 68, 68, 0.24)',
        glow: 'rgba(248, 113, 113, 0.16)',
        text: '#b91c1c'
    },
    info: {
        border: 'rgba(59, 130, 246, 0.22)',
        glow: 'rgba(59, 130, 246, 0.14)',
        text: '#1d4ed8'
    },
    warning: {
        border: 'rgba(245, 158, 11, 0.24)',
        glow: 'rgba(251, 191, 36, 0.16)',
        text: '#b45309'
    }
}

const ensureRoot = () => {
    let root = document.getElementById(ROOT_ID)
    if (root) {
        return root
    }

    root = document.createElement('div')
    root.id = ROOT_ID
    Object.assign(root.style, {
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        zIndex: '100000',
        pointerEvents: 'none'
    } satisfies Partial<CSSStyleDeclaration>)
    document.body.appendChild(root)

    return root
}

export const showAppMessage = (type: AppMessageType, content: string) => {
    if (typeof document === 'undefined' || !content) {
        return
    }

    const root = ensureRoot()
    const palette = paletteMap[type]
    const toast = document.createElement('div')
    toast.textContent = content
    Object.assign(toast.style, {
        minWidth: '168px',
        maxWidth: 'min(88vw, 420px)',
        padding: '11px 16px',
        borderRadius: '999px',
        border: `1px solid ${palette.border}`,
        background: 'rgba(255, 255, 255, 0.92)',
        color: palette.text,
        fontSize: '14px',
        lineHeight: '20px',
        boxShadow: `0 14px 30px ${palette.glow}`,
        backdropFilter: 'blur(14px)',
        opacity: '0',
        transform: 'translateY(-8px) scale(0.98)',
        transition: 'opacity 180ms ease, transform 180ms ease',
        pointerEvents: 'none',
        textAlign: 'center',
        whiteSpace: 'pre-wrap'
    } satisfies Partial<CSSStyleDeclaration>)

    root.appendChild(toast)

    requestAnimationFrame(() => {
        toast.style.opacity = '1'
        toast.style.transform = 'translateY(0) scale(1)'
    })

    window.setTimeout(() => {
        toast.style.opacity = '0'
        toast.style.transform = 'translateY(-8px) scale(0.98)'
        window.setTimeout(() => {
            toast.remove()
            if (!root.childElementCount) {
                root.remove()
            }
        }, 180)
    }, TOAST_DURATION)
}
