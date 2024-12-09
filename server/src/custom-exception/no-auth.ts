export class NoAuthException extends Error {
    constructor(
        public message: string,
        public errorCode: number
    ) {
        super(message)
        this.name = 'NoAuthException'
    }

    getStatus(): number {
        return this.errorCode
    }
}
