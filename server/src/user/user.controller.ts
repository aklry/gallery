import { CreateUserDto } from './dto/create-user.dto'
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    UseGuards,
    Query,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common'
import { UserService } from './user.service'
import { ValidationPipe } from '../pipe/validation.pipe'
import { version } from '../config'
import { ResponseService } from '../response/response.service'
import {
    UserLoginVo,
    UserRegisterVo,
    UserLogoutVo,
    UserVo,
    UserVoModel,
    UserDeleteVo,
    UserCreateVo,
    UserUpdateVo
} from './vo'
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthGuard, RoleGuard } from '../auth/auth.guard'
import { User } from './entities/user.entity'
import { UserRegisterDto } from './dto/user-register.dto'
import { UserLoginDto } from './dto/user-login.dto'
import { Roles } from '../role/role.decorator'
import { UserRole } from './enum/user'
import { FindUserDto } from './dto/find-user.dto'
import { DeleteRequest } from '../common/delete.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { EditUserDto } from './dto/edit-user.dto'
import { UploadAvatarDto } from './dto/upload-avatar.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadAvatarVo } from './vo/upload-avatar.vo'
@Controller({
    path: 'user',
    version
})
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly responseService: ResponseService
    ) {}

    @Post('/register')
    @ApiResponse({ type: UserRegisterVo })
    async userRegister(@Body(new ValidationPipe()) userRegisterDto: UserRegisterDto) {
        const data = await this.userService.userRegister(userRegisterDto)
        return this.responseService.success(data)
    }

    @Get('/get/login')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: UserLoginVo })
    async getLoginUser(@Req() req: Request) {
        const user = await this.userService.getLoginUser(req)
        return this.responseService.success(user)
    }

    @Post('/login')
    @ApiResponse({ type: UserLoginVo })
    async userLogin(@Req() req: Request, @Body(new ValidationPipe()) userLoginDto: UserLoginDto) {
        const data = await this.userService.userLogin(userLoginDto)
        if ('code' in data) {
            return this.responseService.error(null, data.message, data.code)
        }
        req.session.user = data
        return this.responseService.success(data)
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: UserLogoutVo })
    async userLogout(@Req() req: Request) {
        const flag = await this.userService.userLogout(req)
        return this.responseService.success(flag)
    }

    @Post('/list/page/vo')
    @Roles([UserRole.ADMIN])
    @UseGuards(RoleGuard)
    @ApiResponse({ type: UserVo })
    async getUserByPage(@Body(new ValidationPipe()) findUserDto: FindUserDto) {
        const { result, total } = await this.userService.getUserByPage(findUserDto)
        return this.responseService.success({ list: result, total })
    }

    @Post('/add')
    @Roles([UserRole.ADMIN])
    @UseGuards(RoleGuard)
    @ApiResponse({ type: UserCreateVo })
    async addUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        const id = await this.userService.addUser(createUserDto)
        return this.responseService.success(id)
    }

    @Get('/:id')
    @Roles([UserRole.ADMIN])
    @UseGuards(AuthGuard, RoleGuard)
    @ApiResponse({ type: User })
    async getUserById(@Param('id') id: string) {
        const user = await this.userService.getUserById(id)
        return this.responseService.success(user)
    }

    @Get('/get/vo')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: UserVoModel })
    async getUserVoById(@Query('id') id: string) {
        const user = await this.userService.getUserVoById(id)
        return this.responseService.success(user)
    }

    @Post('/delete')
    @Roles([UserRole.ADMIN])
    @UseGuards(AuthGuard, RoleGuard)
    @ApiResponse({ type: UserDeleteVo })
    async deleteUser(@Body(new ValidationPipe()) deleteRequest: DeleteRequest) {
        const id = await this.userService.deleteUser(deleteRequest)
        return this.responseService.success(id)
    }

    @Post('/update')
    @Roles([UserRole.ADMIN])
    @UseGuards(AuthGuard, RoleGuard)
    @ApiResponse({ type: UserUpdateVo })
    async updateUser(@Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
        const flag = await this.userService.updateUser(updateUserDto)
        return this.responseService.success(flag)
    }

    @Post('/edit')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: UserUpdateVo })
    async editUser(@Body(new ValidationPipe()) editUserDto: EditUserDto) {
        const flag = await this.userService.editUser(editUserDto)
        return this.responseService.success(flag)
    }

    @Post('/update/avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: '上传头像',
        schema: {
            type: 'object',
            properties: {
                file: { type: 'file', format: 'binary' },
                prefix: { type: 'string' }
            }
        }
    })
    @ApiResponse({ type: UploadAvatarVo })
    async uploadUserAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Body(new ValidationPipe()) uploadAvatarDto: UploadAvatarDto
    ) {
        const picture = await this.userService.uploadUserAvatar(file, uploadAvatarDto)
        return this.responseService.success({
            url: picture.url
        })
    }
}
