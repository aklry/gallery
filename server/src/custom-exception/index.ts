export class BusinessException extends Error {
    constructor(
        public message: string,
        public errorCode: number
    ) {
        super(message)
        this.name = 'BusinessException'
    }

    getStatus(): number {
        return this.errorCode
    }
}
