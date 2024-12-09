export class NotLoginException extends Error {
    constructor(
        public message: string,
        public errorCode: number
    ) {
        super(message)
        this.name = 'NotLoginException'
    }

    getStatus(): number {
        return this.errorCode
    }
}
