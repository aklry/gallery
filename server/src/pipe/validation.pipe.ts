import { ArgumentMetadata, Injectable, PipeTransform, BadGatewayException, BadRequestException } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { BusinessStatus } from '../config'

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
            throw new BadRequestException({
                statusCode: BusinessStatus.PARAMS_VALIDATION_ERROR.code,
                message: BusinessStatus.PARAMS_VALIDATION_ERROR.message,
                errors: formattedErrors
            })
        }
        return value
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }

    private formatErrors(errors: any[]): any[] {
        return errors.map(error => ({
            field: error.property,
            constraints: Object.values(error.constraints || {})
        }))
    }
}