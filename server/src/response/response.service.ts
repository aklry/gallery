import { Injectable } from '@nestjs/common'
import { BusinessStatus } from '../config'

@Injectable()
export class ResponseService {
    success<T = any>(data: T, message?: string) {
        return {
            code: BusinessStatus.SUCCESS.code,
            message: message ?? BusinessStatus.SUCCESS.message,
            data
        }
    }

    error(data = null, message: string, code: number) {
        return {
            data,
            code,
            message
        }
    }
}
