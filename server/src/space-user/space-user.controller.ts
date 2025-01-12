import { Controller } from '@nestjs/common'
import { SpaceUserService } from './space-user.service'

@Controller('space-user')
export class SpaceUserController {
    constructor(private readonly spaceUserService: SpaceUserService) {}
}
