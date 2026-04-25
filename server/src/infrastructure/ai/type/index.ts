export interface AiEditPictureResponse {
    request_id?: string
    code?: string
    message?: string
    output?: {
        choices?: Array<{
            message?: {
                content?: Array<{
                    image?: string
                    text?: string
                }>
            }
        }>
    }
}

export interface AiEditPictureResult {
    images: string[]
}
