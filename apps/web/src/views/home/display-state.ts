export type HomeDisplayState = 'loading' | 'content' | 'empty'

export const resolveHomeDisplayState = ({
    loading,
    hasData
}: {
    loading: boolean
    hasData: boolean
}): HomeDisplayState => {
    if (loading && !hasData) {
        return 'loading'
    }

    if (hasData) {
        return 'content'
    }

    return 'empty'
}
