import { SetMetadata } from '@nestjs/common'

export const PERMISSION_KEY = 'permission'
export const Permission = (...args: string[]) => SetMetadata(PERMISSION_KEY, args)
