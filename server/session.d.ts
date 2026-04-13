import 'express-session'
import { LoginVoModel } from './user'

declare module 'express-session' {
    interface Session {
        loginCaptcha?: string
        loginCaptchaExpiresAt?: number
        user?: LoginVoModel
    }
}
