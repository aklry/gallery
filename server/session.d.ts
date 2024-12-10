import 'express-session'
import { LoginVoModel } from './user'

declare module 'express-session' {
    interface Session {
        user?: LoginVoModel
    }
}
