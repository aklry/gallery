import ryRequest from '../services'

export const test = () => {
    return ryRequest.get('/test', {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
