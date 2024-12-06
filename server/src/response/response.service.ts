import { Injectable } from '@nestjs/common'
import { BusinessStatus } from '../config'

@Injectable()
export class ResponseService {
    success(data: any, message?: string) {
        return {
            code: BusinessStatus.SUCCESS.code,
            message: message ?? BusinessStatus.SUCCESS.message,
            data
        }
    }

    error(data = null, message: string, code: number = BusinessStatus.ERROR.code) {
        return {
            data,
            code,
            message: message || BusinessStatus.ERROR.message
        }
    }
}
