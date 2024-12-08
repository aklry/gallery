import 'express-session'

declare module 'express-session' {
    interface Session {
        user?: {
            id: string
            userName: string
            userPassword: string
        }
    }
}
