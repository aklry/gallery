export class UploadFailedException extends Error {
    constructor(
        public message: string,
        public errorCode: number
    ) {
        super(message)
        this.name = 'UploadFailedException'
    }

    getStatus(): number {
        return this.errorCode
    }
}
