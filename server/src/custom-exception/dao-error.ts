export class DaoErrorException extends Error {
    constructor(
        public message: string,
        public errorCode: number
    ) {
        super(message)
        this.name = 'DaoErrorException'
    }

    getStatus(): number {
        return this.errorCode
    }
}
