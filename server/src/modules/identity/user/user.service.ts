import { Injectable } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { BusinessStatus } from '@core/config'
import { UserRole } from './enum/user'
import * as bcrypt from 'bcrypt'
import { LoginVoModel, UserVoModel } from './vo'
import { Request } from 'express'
import { DeleteRequest } from '@shared/common/delete.dto'
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
import { OssService } from '@infra/oss/oss.service'
import { EmailService } from '@infra/email/email.service'
import { RedisService } from '@core/redis/redis.service'
import { BusinessException } from '@shared/custom-exception'
import { LOGIN_REDIS_KEY, REGISTER_EMAIL_CODE_REDIS_KEY, USER_RANDOM_PREFIX } from './constant'
import * as svgCaptcha from 'svg-captcha'
import * as sharpModule from 'sharp'

const sharp = sharpModule as unknown as (
    input?: sharpModule.SharpInput | Array<sharpModule.SharpInput>,
    options?: sharpModule.SharpOptions
) => sharpModule.Sharp

@Injectable()
export class UserService {
    private readonly loginCaptchaExpireSeconds = 5 * 60
    private readonly captchaIpLimit = 20
    private readonly captchaIpWindowSeconds = 10 * 60
    private readonly captchaSessionLimit = 10
    private readonly captchaSessionWindowSeconds = 5 * 60
    private readonly emailRegisterCodeIpLimit = 10
    private readonly emailRegisterCodeIpWindowSeconds = 10 * 60
    private readonly emailRegisterCodeSessionLimit = 5
    private readonly emailRegisterCodeSessionWindowSeconds = 10 * 60
    private readonly emailRegisterCodeTargetLimit = 3
    private readonly emailRegisterCodeTargetWindowSeconds = 30 * 60
    private readonly loginIpLimit = 15
    private readonly loginIpWindowSeconds = 10 * 60
    private readonly loginSessionLimit = 8
    private readonly loginSessionWindowSeconds = 10 * 60
    private readonly loginIdentityLimit = 10
    private readonly loginIdentityWindowSeconds = 10 * 60
    private readonly loginFailureWindowSeconds = 15 * 60
    private readonly loginFailureBlockThreshold = 5
    private readonly loginFailureBlockSeconds = 15 * 60

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

    async userLogin(req: Request, userLoginDto: UserLoginDto) {
        const { userAccount, userPassword, code } = userLoginDto
        const identity = this.normalizeRateLimitValue(userAccount)

        return await this.executeLoginAttempt(req, identity, async () => {
            await this.validateLoginCaptcha(req, code)
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
        })
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

    async sendEmailValidateCode(req: Request, email: string) {
        await this.assertRegisterEmailCodeRateLimit(req, email)

        let code = await this.redisService.get(this.getRegisterEmailCodeKey(email))
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
        await this.redisService.set(this.getRegisterEmailCodeKey(email), code, 60 * 5)
        return true
    }
    // 邮箱注册
    async userRegisterByEmail(userRegisterByEmailDto: UserRegisterByEmailDto) {
        const { userEmail, code, userPassword, checkedPassword } = userRegisterByEmailDto
        const storedCode = (await this.redisService.get(this.getRegisterEmailCodeKey(userEmail))) as string
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
    async userLoginByEmail(req: Request, userLoginByEmailDto: UserLoginByEmailDto) {
        const { userEmail, userPassword, code } = userLoginByEmailDto
        const identity = this.normalizeRateLimitValue(userEmail)

        return await this.executeLoginAttempt(req, identity, async () => {
            await this.validateLoginCaptcha(req, code)
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
        })
    }

    //生成登录页面的验证码
    async generateLoginCaptcha(req: Request) {
        await this.assertCaptchaRateLimit(req)

        const captcha = svgCaptcha.create({
            size: 4,
            width: 132,
            height: 48,
            fontSize: 40,
            noise: 4,
            color: true,
            background: '#f8fafc',
            ignoreChars: '0o1ilI',
            charPreset: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
        })

        req.session.loginCaptcha = captcha.text
        req.session.loginCaptchaExpiresAt = Date.now() + this.loginCaptchaExpireSeconds * 1000

        const imageBuffer = await sharp(Buffer.from(captcha.data)).png().toBuffer()
        return `data:image/png;base64,${imageBuffer.toString('base64')}`
    }

    // 生成 6位随机数字验证码
    private generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    // 生成随机用户名
    private generateUsername(): string {
        const prefix = USER_RANDOM_PREFIX
        const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
        return prefix + '_' + randomSuffix
    }

    private getRegisterEmailCodeKey(email: string) {
        return `${REGISTER_EMAIL_CODE_REDIS_KEY}:${this.normalizeRateLimitValue(email)}`
    }

    private getCaptchaRateLimitKey(req: Request, scope: 'ip' | 'session') {
        if (scope === 'ip') {
            return `${LOGIN_REDIS_KEY}:rate:get:ip:${this.normalizeRateLimitValue(this.getRequestIp(req))}`
        }
        return `${LOGIN_REDIS_KEY}:rate:get:session:${this.normalizeRateLimitValue(req.sessionID)}`
    }

    private getRegisterEmailCodeRateLimitKey(scope: 'ip' | 'session' | 'email', value: string) {
        return `${REGISTER_EMAIL_CODE_REDIS_KEY}:rate:${scope}:${value}`
    }

    private getLoginAttemptRateLimitKey(scope: 'ip' | 'session' | 'identity', value: string) {
        return `${LOGIN_REDIS_KEY}:rate:login:${scope}:${value}`
    }

    private getLoginFailureCountKey(scope: 'ip' | 'session' | 'identity', value: string) {
        return `${LOGIN_REDIS_KEY}:fail:login:${scope}:${value}`
    }

    private getLoginFailureBlockKey(scope: 'ip' | 'session' | 'identity', value: string) {
        return `${LOGIN_REDIS_KEY}:block:login:${scope}:${value}`
    }

    private getRequestIp(req: Request) {
        const forwardedFor = req.headers['x-forwarded-for']
        const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
        return forwardedIp?.split(',')[0]?.trim() || req.ip || 'unknown'
    }

    private normalizeRateLimitValue(value: string) {
        return encodeURIComponent(value.trim().toLowerCase())
    }

    private getLoginRateTargets(req: Request, identity: string) {
        return [
            { scope: 'ip' as const, value: this.normalizeRateLimitValue(this.getRequestIp(req)) },
            { scope: 'session' as const, value: this.normalizeRateLimitValue(req.sessionID) },
            { scope: 'identity' as const, value: identity }
        ]
    }

    private async executeLoginAttempt<T>(req: Request, identity: string, action: () => Promise<T>) {
        await this.assertLoginFailureBlock(req, identity)
        await this.assertLoginRateLimit(req, identity)

        try {
            const result = await action()
            await this.clearLoginFailureState(req, identity)
            return result
        } catch (error) {
            if (this.shouldRecordLoginFailure(error)) {
                await this.recordLoginFailure(req, identity)
            }
            throw error
        }
    }

    private async assertCaptchaRateLimit(req: Request) {
        await Promise.all([
            this.consumeRateLimit(
                this.getCaptchaRateLimitKey(req, 'ip'),
                this.captchaIpLimit,
                this.captchaIpWindowSeconds,
                '验证码获取过于频繁，请稍后再试'
            ),
            this.consumeRateLimit(
                this.getCaptchaRateLimitKey(req, 'session'),
                this.captchaSessionLimit,
                this.captchaSessionWindowSeconds,
                '验证码获取过于频繁，请稍后再试'
            )
        ])
    }

    private async assertRegisterEmailCodeRateLimit(req: Request, email: string) {
        const normalizedEmail = this.normalizeRateLimitValue(email)
        await Promise.all([
            this.consumeRateLimit(
                this.getRegisterEmailCodeRateLimitKey('ip', this.normalizeRateLimitValue(this.getRequestIp(req))),
                this.emailRegisterCodeIpLimit,
                this.emailRegisterCodeIpWindowSeconds,
                '注册验证码发送过于频繁，请稍后再试'
            ),
            this.consumeRateLimit(
                this.getRegisterEmailCodeRateLimitKey('session', this.normalizeRateLimitValue(req.sessionID)),
                this.emailRegisterCodeSessionLimit,
                this.emailRegisterCodeSessionWindowSeconds,
                '注册验证码发送过于频繁，请稍后再试'
            ),
            this.consumeRateLimit(
                this.getRegisterEmailCodeRateLimitKey('email', normalizedEmail),
                this.emailRegisterCodeTargetLimit,
                this.emailRegisterCodeTargetWindowSeconds,
                '该邮箱验证码发送过于频繁，请稍后再试'
            )
        ])
    }

    private async assertLoginRateLimit(req: Request, identity: string) {
        const targets = this.getLoginRateTargets(req, identity)
        await Promise.all([
            this.consumeRateLimit(
                this.getLoginAttemptRateLimitKey(targets[0].scope, targets[0].value),
                this.loginIpLimit,
                this.loginIpWindowSeconds,
                '登录请求过于频繁，请稍后再试'
            ),
            this.consumeRateLimit(
                this.getLoginAttemptRateLimitKey(targets[1].scope, targets[1].value),
                this.loginSessionLimit,
                this.loginSessionWindowSeconds,
                '登录请求过于频繁，请稍后再试'
            ),
            this.consumeRateLimit(
                this.getLoginAttemptRateLimitKey(targets[2].scope, targets[2].value),
                this.loginIdentityLimit,
                this.loginIdentityWindowSeconds,
                '登录请求过于频繁，请稍后再试'
            )
        ])
    }

    private async assertLoginFailureBlock(req: Request, identity: string) {
        const targets = this.getLoginRateTargets(req, identity)
        for (const target of targets) {
            const blockKey = this.getLoginFailureBlockKey(target.scope, target.value)
            const blocked = await this.redisService.get(blockKey)
            if (blocked) {
                const ttl = await this.redisService.ttl(blockKey)
                const waitSeconds = ttl > 0 ? ttl : this.loginFailureBlockSeconds
                throw new BusinessException(
                    `登录失败次数过多，请在 ${waitSeconds} 秒后重试`,
                    BusinessStatus.TOO_MANY_REQUESTS_ERROR.code
                )
            }
        }
    }

    private async recordLoginFailure(req: Request, identity: string) {
        const targets = this.getLoginRateTargets(req, identity)
        for (const target of targets) {
            const failureKey = this.getLoginFailureCountKey(target.scope, target.value)
            const count = await this.incrementCounter(failureKey, this.loginFailureWindowSeconds)
            if (count >= this.loginFailureBlockThreshold) {
                await this.redisService.set(
                    this.getLoginFailureBlockKey(target.scope, target.value),
                    true,
                    this.loginFailureBlockSeconds
                )
            }
        }
    }

    private async clearLoginFailureState(req: Request, identity: string) {
        const targets = this.getLoginRateTargets(req, identity)
        await Promise.all(
            targets.flatMap(target => [
                this.redisService.del(this.getLoginFailureCountKey(target.scope, target.value)),
                this.redisService.del(this.getLoginFailureBlockKey(target.scope, target.value))
            ])
        )
    }

    private shouldRecordLoginFailure(error: unknown) {
        if (!(error instanceof BusinessException)) {
            return false
        }
        return ['验证码错误', '用户不存在', '密码错误'].includes(error.message)
    }

    private async consumeRateLimit(key: string, limit: number, windowSeconds: number, message: string) {
        const count = await this.incrementCounter(key, windowSeconds)
        if (count <= limit) {
            return
        }

        const ttl = await this.redisService.ttl(key)
        const waitSeconds = ttl > 0 ? ttl : windowSeconds
        throw new BusinessException(
            `${message}，请在 ${waitSeconds} 秒后重试`,
            BusinessStatus.TOO_MANY_REQUESTS_ERROR.code
        )
    }

    private async incrementCounter(key: string, windowSeconds: number) {
        const count = await this.redisService.incr(key)
        const ttl = await this.redisService.ttl(key)
        if (count === 1 || ttl < 0) {
            await this.redisService.expire(key, windowSeconds)
        }
        return count
    }

    private async validateLoginCaptcha(req: Request, code: string) {
        const storedCode = req.session.loginCaptcha
        const expiresAt = req.session.loginCaptchaExpiresAt ?? 0
        if (!storedCode || Date.now() > expiresAt) {
            delete req.session.loginCaptcha
            delete req.session.loginCaptchaExpiresAt
            throw new BusinessException('验证码已过期，请刷新后重试', BusinessStatus.PARAMS_ERROR.code)
        }

        delete req.session.loginCaptcha
        delete req.session.loginCaptchaExpiresAt

        if (code.trim().toLowerCase() !== storedCode.trim().toLowerCase()) {
            throw new BusinessException('验证码错误', BusinessStatus.PARAMS_ERROR.code)
        }
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
