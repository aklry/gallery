import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { BusinessStatus } from '../config'
import { UserRole } from './enum/user'
import * as bcrypt from 'bcrypt'
import { LoginVoModel, UserVoModel } from './vo'
import { Request } from 'express'
import { DeleteRequest } from '../common/delete.dto'
import {
    CreateUserDto,
    EditUserDto,
    FindUserDto,
    UpdateUserDto,
    UploadAvatarDto,
    UserLoginDto,
    UserRegisterByEmailDto,
    UserRegisterDto,
    UserLoginByEmailDto
} from './dto'
import { OssService } from '../oss/oss.service'
import { EmailService } from '../email/email.service'
import { RedisService } from '../redis/redis.service'
import { BusinessException } from '../custom-exception'
import { LOGIN_REDIS_KEY, USER_RANDOM_PREFIX } from './constant'

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly ossService: OssService,
        private readonly emailService: EmailService,
        private readonly redisService: RedisService
    ) {}

    async userRegister(userRegisterDto: UserRegisterDto) {
        const { userAccount, userPassword, checkedPassword } = userRegisterDto
        if (userPassword !== checkedPassword) {
            throw new BusinessException('两次密码不一致', BusinessStatus.PARAMS_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                userAccount,
                isDelete: {
                    in: [0, 1]
                }
            }
        })
        if (user) {
            throw new BusinessException('用户已存在', BusinessStatus.PARAMS_ERROR.code)
        }
        // 加密
        const hashedPassword = await this.encryptPassword(userPassword)
        const newUser = await this.prismaService.user.create({
            data: {
                userAccount,
                userName: this.generateUsername(),
                userPassword: hashedPassword,
                userRole: UserRole.USER
            }
        })
        return newUser.id
    }

    async getLoginUser(req: Request) {
        const user = req.session.user
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.PARAMS_ERROR.code)
        }
        const userInfo = await this.prismaService.user.findUnique({
            where: {
                id: user.id
            }
        })
        if (!userInfo) {
            throw new BusinessException('用户不存在', BusinessStatus.PARAMS_ERROR.code)
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
        const { userAccount, userPassword, code } = userLoginDto
        const storedCode = await this.redisService.get(LOGIN_REDIS_KEY)
        if (code !== storedCode && code.toLowerCase() !== storedCode.toLowerCase()) {
            throw new BusinessException('验证码错误', BusinessStatus.PARAMS_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                userAccount
            }
        })
        if (!user) {
            throw new BusinessException('用户不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        const isMatch = await bcrypt.compare(userPassword, user.userPassword)
        if (!isMatch) {
            throw new BusinessException('密码错误', BusinessStatus.PARAMS_ERROR.code)
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
        return await this.prismaService.user.findUnique({
            where: {
                id
            }
        })
    }

    async getUserByIds(ids: string[]) {
        const users = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
        return users.map(
            user =>
                ({
                    id: user.id,
                    userAccount: user.userAccount,
                    userAvatar: user.userAvatar,
                    userName: user.userName,
                    userProfile: user.userProfile,
                    userRole: user.userRole
                }) as UserVoModel
        )
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

    async sendEmailValidateCode(email: string) {
        let code = await this.redisService.get(email)
        if (code) {
            throw new BusinessException('验证码已发送，请5分钟后再试', BusinessStatus.PARAMS_ERROR.code)
        }
        code = this.generateCode()
        //发送验证码
        await this.emailService.sendEmail(
            email,
            '您的注册验证码',
            `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>验证码</h2>
            <p>您好，您的验证码为：</p>
         
           <h1 style="color: #4CAF50;">${code}</h1>
            <p>该验证码在5分钟内有效。如非本人操作，请忽略此邮件。</p>
          </div>
        `
        )
        // 存储验证码到redis，设置5分钟过期
        await this.redisService.set(email, code, 60 * 5)
        return true
    }
    // 邮箱注册
    async userRegisterByEmail(userRegisterByEmailDto: UserRegisterByEmailDto) {
        const { userEmail, code, userPassword, checkedPassword } = userRegisterByEmailDto
        const storedCode = (await this.redisService.get(userEmail)) as string
        if (storedCode !== code) {
            throw new BusinessException('验证码错误', BusinessStatus.PARAMS_ERROR.code)
        }
        if (userPassword !== checkedPassword) {
            throw new BusinessException('两次密码不一致', BusinessStatus.PARAMS_ERROR.code)
        }
        const user = await this.prismaService.user.create({
            data: {
                userEmail,
                userPassword: await this.encryptPassword(userPassword),
                userAccount: this.generateUsername(),
                userName: this.generateUsername()
            }
        })
        return user.id
    }

    // 邮箱登录
    async userLoginByEmail(userLoginByEmailDto: UserLoginByEmailDto) {
        const { userEmail, userPassword, code } = userLoginByEmailDto
        const storedCode = (await this.redisService.get(LOGIN_REDIS_KEY)) as string
        if (code !== storedCode && code.toLowerCase() !== storedCode.toLowerCase()) {
            throw new BusinessException('验证码错误', BusinessStatus.PARAMS_ERROR.code)
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                userEmail
            }
        })
        if (!user) {
            throw new BusinessException('用户不存在', BusinessStatus.PARAMS_ERROR.code)
        }
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword)
        if (!isPasswordValid) {
            throw new BusinessException('密码错误', BusinessStatus.PARAMS_ERROR.code)
        }
        return {
            id: user.id,
            userAccount: user.userAccount,
            userEmail: user.userEmail,
            userName: user.userName,
            userAvatar: user.userAvatar,
            userProfile: user.userProfile,
            userRole: user.userRole
        } as LoginVoModel
    }

    //生成登录页面的验证码
    async generateLoginCaptcha() {
        const code = this.generateStringCode()
        this.redisService.set(LOGIN_REDIS_KEY, code, 60 * 5)
        return code
    }

    // 生成 6位随机数字验证码
    private generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    // 生成4位随机字符串验证码
    private generateStringCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result
    }
    // 生成随机用户名
    private generateUsername(): string {
        const prefix = USER_RANDOM_PREFIX
        const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
        return prefix + '_' + randomSuffix
    }

    private async encryptPassword(password: string) {
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
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
            data.userPassword = await this.encryptPassword(userPassword)
        }
        await this.prismaService.user.update({
            where: { id },
            data
        })
        return true
    }

    async uploadUserAvatar(file: Express.Multer.File, uploadAvatarDto: UploadAvatarDto) {
        const { prefix } = uploadAvatarDto
        return await this.ossService.uploadFile(file.originalname, file.buffer, prefix)
    }
}
