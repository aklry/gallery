import { Injectable } from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { ResponseService } from '../response/response.service'
import { BusinessStatus } from '../config'
import { UserRole } from './enum/user'
import * as bcrypt from 'bcrypt'
import { LoginVoModel } from './vo'
import { Request } from 'express'
import { UserRegisterDto } from './dto/user-register.dto'
import { UserLoginDto } from './dto/user-login.dto'
import { FindUserDto } from './dto/find-user.dto'
import { UserVoModel } from './vo/user.vo'
import { CreateUserDto } from './dto/create-user.dto'
import { DeleteRequest } from '../common/delete.dto'
import { EditUserDto } from './dto/edit-user.dto'
import { OssService } from '../oss/oss.service'
import { UploadAvatarDto } from './dto/upload-avatar.dto'
@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly responseService: ResponseService,
        private readonly ossService: OssService
    ) {}
    async userRegister(userRegisterDto: UserRegisterDto) {
        const { userAccount, userPassword, checkedPassword } = userRegisterDto
        if (userPassword !== checkedPassword) {
            return this.responseService.error(null, '两次密码不一致', BusinessStatus.PARAMS_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                userAccount
            }
        })
        if (user) {
            return this.responseService.error(null, '用户已存在', BusinessStatus.PARAMS_ERROR.code)
        }
        // 加密
        const hashedPassword = await this.encryptPassword(userPassword)
        const newUser = await this.prismaService.user.create({
            data: {
                userAccount,
                userPassword: hashedPassword,
                userRole: UserRole.USER
            }
        })
        return newUser.id
    }
    async getLoginUser(req: Request) {
        const user = req.session.user
        if (!user) {
            return this.responseService.error(null, '用户未登录', BusinessStatus.PARAMS_ERROR.code)
        }
        const userInfo = await this.prismaService.user.findUnique({
            where: {
                id: user.id
            }
        })
        if (!userInfo) {
            return this.responseService.error(null, '用户不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        return {
            id: userInfo.id,
            userAccount: userInfo.userAccount,
            userName: userInfo.userName,
            userAvatar: userInfo.userAvatar,
            userProfile: userInfo.userProfile,
            userRole: userInfo.userRole
        } as LoginVoModel
    }

    userLogout(req: Request) {
        req.session.user = null
        return true
    }

    async userLogin(userLoginDto: UserLoginDto) {
        const { userAccount, userPassword } = userLoginDto
        const user = await this.prismaService.user.findUnique({
            where: {
                userAccount
            }
        })
        if (!user) {
            return this.responseService.error(null, '用户不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        const isMatch = await bcrypt.compare(userPassword, user.userPassword)
        if (!isMatch) {
            return this.responseService.error(null, '密码错误', BusinessStatus.PARAMS_ERROR.code)
        }
        return {
            id: user.id,
            userAccount: user.userAccount,
            userName: user.userName,
            userAvatar: user.userAvatar,
            userProfile: user.userProfile,
            userRole: user.userRole
        } as LoginVoModel
    }

    async getUserByPage(findUserDto: FindUserDto) {
        const { current, pageSize, id, userName, userAccount, userRole, sortField, sortOrder, userProfile } =
            findUserDto

        // Build where clause dynamically with fuzzy search
        const where = {
            ...(id && { id }),
            ...(userName && {
                userName: {
                    contains: userName
                }
            }),
            ...(userAccount && {
                userAccount: {
                    contains: userAccount
                }
            }),
            ...(userProfile && {
                userProfile: {
                    contains: userProfile
                }
            }),
            ...(userRole && { userRole })
        }

        // Build orderBy clause
        const orderBy = sortField
            ? {
                  [sortField]: sortOrder || 'desc'
              }
            : undefined

        // Get paginated results and total count
        const [data, total] = await Promise.all([
            this.prismaService.user.findMany({
                where,
                orderBy,
                skip: (Number(current) - 1) * Number(pageSize),
                take: Number(pageSize)
            }),
            this.prismaService.user.count({ where })
        ])
        const result: UserVoModel[] = data.map(item => {
            return {
                id: item.id,
                userAccount: item.userAccount,
                userName: item.userName,
                userAvatar: item.userAvatar,
                userProfile: item.userProfile,
                userRole: item.userRole,
                createTime: item.createTime.toISOString()
            } as UserVoModel
        })
        return {
            result,
            total
        }
    }

    async addUser(createUserDto: CreateUserDto) {
        const { userName, userAvatar, userAccount, userProfile, userRole } = createUserDto
        const hashedPassword = await this.encryptPassword('123456')
        const user = await this.prismaService.user.create({
            data: {
                userName,
                userAvatar,
                userAccount,
                userProfile,
                userRole,
                userPassword: hashedPassword
            }
        })
        return user.id
    }

    async getUserById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })
        return user
    }

    async getUserVoById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })
        return {
            id: user.id,
            userAccount: user.userAccount,
            userName: user.userName,
            userAvatar: user.userAvatar,
            userProfile: user.userProfile,
            userRole: user.userRole
        } as UserVoModel
    }

    async deleteUser(deleteRequest: DeleteRequest) {
        const { id } = deleteRequest
        const user = await this.prismaService.user.delete({
            where: {
                id
            }
        })
        return user.id
    }

    async updateUser(updateUserDto: UpdateUserDto) {
        const { id, userName, userAvatar, userProfile, userRole } = updateUserDto
        await this.prismaService.user.update({
            where: {
                id
            },
            data: {
                userName,
                userAvatar,
                userProfile,
                userRole
            }
        })
        return true
    }

    async encryptPassword(password: string) {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    }

    async editUser(editUserDto: EditUserDto) {
        const { id, userName, userAvatar, userProfile, userPassword } = editUserDto
        const data: any = {}
        if (userName) {
            data.userName = userName
        }
        if (userAvatar) {
            data.userAvatar = userAvatar
        }
        if (userProfile) {
            data.userProfile = userProfile
        }
        if (userPassword) {
            const hashedPassword = await this.encryptPassword(userPassword)
            data.userPassword = hashedPassword
        }
        await this.prismaService.user.update({
            where: { id },
            data
        })
        return true
    }
    async uploadUserAvatar(file: Express.Multer.File, uploadAvatarDto: UploadAvatarDto) {
        const { prefix } = uploadAvatarDto
        const fileBuffer = await this.ossService.uploadFile(file.originalname, file.buffer, prefix)
        return fileBuffer
    }
}
