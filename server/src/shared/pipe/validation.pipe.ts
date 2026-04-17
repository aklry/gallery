import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { BusinessStatus } from '@core/config'
import { BusinessException } from '@shared/custom-exception'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }
        const object = plainToClass(metatype, value)
        const errors = await validate(object)
        if (errors.length > 0) {
            const formattedErrors = this.formatErrors(errors)
            throw new BusinessException(formattedErrors, BusinessStatus.PARAMS_VALIDATION_ERROR.code)
        }
        return value
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }

    private formatErrors(errors: any[]): string {
        // 通常只需要向用户展示第一个验证失败的字段的第一条错误原因即可
        const firstError = errors[0]
        if (firstError.constraints) {
            return Object.values(firstError.constraints)[0] as string
        }
        return '参数校验失败'
    }
}
