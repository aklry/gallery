export const isValidUrl = (url: string) => {
    try {
        const parsedURL = new URL(url)
        return parsedURL.protocol === 'http:' || parsedURL.protocol === 'https:'
    } catch (error) {
        return false
    }
}
