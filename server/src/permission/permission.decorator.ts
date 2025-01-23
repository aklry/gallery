import { SetMetadata } from '@nestjs/common'

export const PERMISSION_KEY = 'space'
export const Permission = (...args: string[]) => SetMetadata(PERMISSION_KEY, args)
