import { Injectable } from '@nestjs/common'
import { Prisma, SpaceRole } from '@prisma/client'
import type { Request } from 'express'
import { BusinessStatus } from '@core/config'
import { PrismaService } from '@core/prisma/prisma.service'
import { RedisService } from '@core/redis/redis.service'
import { BusinessException } from '@shared/custom-exception'
import { SpaceService } from '@space/core/space.service'
import { getSpaceTypeEnumByValue, SpaceTypeEnum } from '@space/core/enum'
import { MessageType } from '@tools/message/enum'
import { MessageService } from '@tools/message/message.service'
import { GenerateSpaceInviteDto, JoinSpaceInviteDto, ManageSpaceInviteDto } from './dto'
import { SpaceInviteStatus } from './enum'

@Injectable()
export class SpaceInviteService {
    private readonly defaultExpireMinutes = 15
    private readonly maxExpireMinutes = 30
    private readonly joinUserMinuteLimit = 5
    private readonly joinUserMinuteWindowSeconds = 60
    private readonly joinUserHourLimit = 20
    private readonly joinUserHourWindowSeconds = 60 * 60
    private readonly joinIpMinuteLimit = 20
    private readonly joinIpMinuteWindowSeconds = 60
    private readonly joinFailureThreshold = 5
    private readonly joinFailureWindowSeconds = 10 * 60
    private readonly joinFailureBlockSeconds = 10 * 60
    private readonly invalidCodeMessage = '邀请码无效或已过期'

    constructor(
        private readonly prisma: PrismaService,
        private readonly spaceService: SpaceService,
        private readonly redisService: RedisService,
        private readonly messageService: MessageService
    ) {}

    async generate(generateSpaceInviteDto: GenerateSpaceInviteDto, req: Request) {
        const user = this.getLoginUser(req)
        const { spaceId } = generateSpaceInviteDto
        const expireMinutes = this.normalizeExpireMinutes(generateSpaceInviteDto.expireMinutes)
        const expireTime = new Date(Date.now() + expireMinutes * 60 * 1000)

        await this.getTeamSpaceOrThrow(spaceId)
        await this.markExpiredInviteCodes({ spaceId })

        const code = await this.generateUniqueCode()
        const now = new Date()
        const inviteCode = await this.prisma.$transaction(async tx => {
            await tx.space_invite_code.updateMany({
                where: {
                    spaceId,
                    status: SpaceInviteStatus.ACTIVE,
                    expireTime: {
                        gt: now
                    }
                },
                data: {
                    status: SpaceInviteStatus.DISABLED,
                    updateTime: now
                }
            })

            return await tx.space_invite_code.create({
                data: {
                    spaceId,
                    code,
                    status: SpaceInviteStatus.ACTIVE,
                    creatorUserId: user.id,
                    expireTime
                }
            })
        })

        return this.toInviteCodeVo(inviteCode)
    }

    async getCurrent(manageSpaceInviteDto: ManageSpaceInviteDto) {
        const { spaceId } = manageSpaceInviteDto
        await this.getTeamSpaceOrThrow(spaceId)
        await this.markExpiredInviteCodes({ spaceId })

        const inviteCode = await this.prisma.space_invite_code.findFirst({
            where: {
                spaceId,
                status: SpaceInviteStatus.ACTIVE,
                expireTime: {
                    gt: new Date()
                }
            },
            orderBy: {
                createTime: 'desc'
            }
        })

        return inviteCode ? this.toInviteCodeVo(inviteCode) : null
    }

    async disable(manageSpaceInviteDto: ManageSpaceInviteDto) {
        const { spaceId } = manageSpaceInviteDto
        await this.getTeamSpaceOrThrow(spaceId)
        await this.markExpiredInviteCodes({ spaceId })

        await this.prisma.space_invite_code.updateMany({
            where: {
                spaceId,
                status: SpaceInviteStatus.ACTIVE,
                expireTime: {
                    gt: new Date()
                }
            },
            data: {
                status: SpaceInviteStatus.DISABLED,
                updateTime: new Date()
            }
        })

        return true
    }

    async join(joinSpaceInviteDto: JoinSpaceInviteDto, req: Request) {
        const user = this.getLoginUser(req)
        const code = joinSpaceInviteDto.code.trim()

        await this.assertJoinBlocked(req, user.id)
        await this.assertJoinRateLimit(req, user.id)
        await this.markExpiredInviteCodes({ code })

        const inviteCode = await this.prisma.space_invite_code.findFirst({
            where: {
                code,
                status: SpaceInviteStatus.ACTIVE,
                expireTime: {
                    gt: new Date()
                }
            },
            orderBy: {
                createTime: 'desc'
            }
        })

        if (!inviteCode) {
            await this.recordJoinFailure(req, user.id)
            throw new BusinessException(this.invalidCodeMessage, BusinessStatus.PARAMS_ERROR.code)
        }

        const joinResult = await this.prisma.$transaction(async tx => {
            const currentInviteCode = await tx.space_invite_code.findFirst({
                where: {
                    id: inviteCode.id,
                    status: SpaceInviteStatus.ACTIVE,
                    expireTime: {
                        gt: new Date()
                    }
                }
            })
            if (!currentInviteCode) {
                throw new BusinessException(this.invalidCodeMessage, BusinessStatus.PARAMS_ERROR.code)
            }

            const space = await tx.space.findUnique({
                where: {
                    id: currentInviteCode.spaceId
                }
            })
            if (!space) {
                throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            const spaceType = getSpaceTypeEnumByValue(space.spaceType)
            if (spaceType?.value !== SpaceTypeEnum.TEAM) {
                throw new BusinessException('仅团队空间支持邀请码加入', BusinessStatus.PARAMS_ERROR.code)
            }

            const existedSpaceUser = await tx.space_user.findFirst({
                where: {
                    spaceId: space.id,
                    userId: user.id
                }
            })
            if (existedSpaceUser) {
                throw new BusinessException('你已经是该空间成员', BusinessStatus.PARAMS_ERROR.code)
            }

            const spaceUsers = await tx.space_user.findMany({
                where: {
                    spaceId: space.id
                },
                select: {
                    userId: true
                }
            })

            await tx.space_user.create({
                data: {
                    spaceId: space.id,
                    userId: user.id,
                    spaceRole: SpaceRole.viewer
                }
            })

            await tx.space_invite_code.update({
                where: {
                    id: currentInviteCode.id
                },
                data: {
                    status: SpaceInviteStatus.USED,
                    usedByUserId: user.id,
                    usedTime: new Date(),
                    updateTime: new Date()
                }
            })

            return {
                spaceId: space.id,
                spaceName: space.spaceName || '未命名空间',
                notifyUserIds: spaceUsers.map(item => item.userId)
            }
        })

        await this.clearJoinFailureState(req, user.id)

        await this.messageService.pushMessage({
            userId: user.id,
            title: '加入空间成功',
            content: `你已加入团队空间「${joinResult.spaceName}」`,
            messageType: MessageType.SPACE_JOIN_SUCCESS,
            bizId: joinResult.spaceId,
            spaceId: joinResult.spaceId,
            actionUrl: `/space/${joinResult.spaceId}`,
            extra: {
                spaceId: joinResult.spaceId,
                spaceName: joinResult.spaceName
            }
        })

        const joinedUserName = user.userName || user.userAccount || '新成员'
        const notifyInputs = joinResult.notifyUserIds
            .filter(userId => userId !== user.id)
            .map(userId => ({
                userId,
                title: '空间新增成员',
                content: `${joinedUserName} 加入了团队空间「${joinResult.spaceName}」`,
                messageType: MessageType.SPACE_NEW_MEMBER,
                bizId: user.id,
                spaceId: joinResult.spaceId,
                actionUrl: `/space/${joinResult.spaceId}`,
                extra: {
                    joinedUserId: user.id,
                    joinedUserName,
                    spaceId: joinResult.spaceId,
                    spaceName: joinResult.spaceName
                }
            }))

        if (notifyInputs.length > 0) {
            await this.messageService.pushMessages(notifyInputs)
        }

        return {
            spaceId: joinResult.spaceId
        }
    }

    private async getTeamSpaceOrThrow(spaceId: string) {
        const space = await this.spaceService.getById(spaceId)
        const spaceType = getSpaceTypeEnumByValue(space.spaceType)
        if (spaceType?.value !== SpaceTypeEnum.TEAM) {
            throw new BusinessException('仅团队空间支持邀请码功能', BusinessStatus.PARAMS_ERROR.code)
        }
        return space
    }

    private normalizeExpireMinutes(expireMinutes?: number) {
        if (expireMinutes === undefined || expireMinutes === null) {
            return this.defaultExpireMinutes
        }
        if (expireMinutes > this.maxExpireMinutes) {
            throw new BusinessException(
                `邀请码有效期不能超过 ${this.maxExpireMinutes} 分钟`,
                BusinessStatus.PARAMS_ERROR.code
            )
        }
        return expireMinutes
    }

    private async generateUniqueCode() {
        const maxAttempts = 20
        for (let i = 0; i < maxAttempts; i++) {
            const code = Math.floor(100000 + Math.random() * 900000).toString()
            const existed = await this.prisma.space_invite_code.findFirst({
                where: {
                    code,
                    status: SpaceInviteStatus.ACTIVE,
                    expireTime: {
                        gt: new Date()
                    }
                },
                select: {
                    id: true
                }
            })
            if (!existed) {
                return code
            }
        }
        throw new BusinessException('邀请码生成失败，请稍后重试', BusinessStatus.SYSTEM_ERROR.code)
    }

    private async markExpiredInviteCodes(filters: { spaceId?: string; code?: string }) {
        const where: Prisma.space_invite_codeWhereInput = {
            status: SpaceInviteStatus.ACTIVE,
            expireTime: {
                lte: new Date()
            }
        }
        if (filters.spaceId) {
            where.spaceId = filters.spaceId
        }
        if (filters.code) {
            where.code = filters.code
        }

        await this.prisma.space_invite_code.updateMany({
            where,
            data: {
                status: SpaceInviteStatus.EXPIRED,
                updateTime: new Date()
            }
        })
    }

    private toInviteCodeVo(inviteCode: any) {
        return {
            id: inviteCode.id,
            spaceId: inviteCode.spaceId,
            code: inviteCode.code,
            status: inviteCode.status,
            creatorUserId: inviteCode.creatorUserId,
            expireTime: inviteCode.expireTime,
            remainingSeconds: Math.max(0, Math.ceil((inviteCode.expireTime.getTime() - Date.now()) / 1000)),
            createTime: inviteCode.createTime,
            updateTime: inviteCode.updateTime
        }
    }

    private getLoginUser(req: Request) {
        const user = req.session?.user
        if (!user?.id) {
            throw new BusinessException(BusinessStatus.NOT_LOGIN_ERROR.message, BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        return user
    }

    private getRequestIp(req: Request) {
        const forwardedFor = req.headers['x-forwarded-for']
        const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
        return forwardedIp?.split(',')[0]?.trim() || req.ip || 'unknown'
    }

    private normalizeRateLimitValue(value: string) {
        return encodeURIComponent(value.trim().toLowerCase())
    }

    private getJoinRateLimitKey(scope: 'userMinute' | 'userHour' | 'ipMinute', value: string) {
        return `space:invite:join:rate:${scope}:${value}`
    }

    private getJoinFailureCountKey(scope: 'user' | 'ip', value: string) {
        return `space:invite:join:fail:count:${scope}:${value}`
    }

    private getJoinFailureBlockKey(scope: 'user' | 'ip', value: string) {
        return `space:invite:join:fail:block:${scope}:${value}`
    }

    private async assertJoinRateLimit(req: Request, userId: string) {
        const normalizedUserId = this.normalizeRateLimitValue(userId)
        const normalizedIp = this.normalizeRateLimitValue(this.getRequestIp(req))

        await Promise.all([
            this.consumeRateLimit(
                this.getJoinRateLimitKey('userMinute', normalizedUserId),
                this.joinUserMinuteLimit,
                this.joinUserMinuteWindowSeconds,
                '加入请求过于频繁'
            ),
            this.consumeRateLimit(
                this.getJoinRateLimitKey('userHour', normalizedUserId),
                this.joinUserHourLimit,
                this.joinUserHourWindowSeconds,
                '加入请求过于频繁'
            ),
            this.consumeRateLimit(
                this.getJoinRateLimitKey('ipMinute', normalizedIp),
                this.joinIpMinuteLimit,
                this.joinIpMinuteWindowSeconds,
                '加入请求过于频繁'
            )
        ])
    }

    private async assertJoinBlocked(req: Request, userId: string) {
        const targets = [
            {
                scope: 'user' as const,
                value: this.normalizeRateLimitValue(userId)
            },
            {
                scope: 'ip' as const,
                value: this.normalizeRateLimitValue(this.getRequestIp(req))
            }
        ]

        for (const target of targets) {
            const blockKey = this.getJoinFailureBlockKey(target.scope, target.value)
            const blocked = await this.redisService.get(blockKey)
            if (blocked) {
                const ttl = await this.redisService.ttl(blockKey)
                const waitSeconds = ttl > 0 ? ttl : this.joinFailureBlockSeconds
                throw new BusinessException(
                    `邀请码输入错误次数过多，请在 ${waitSeconds} 秒后重试`,
                    BusinessStatus.TOO_MANY_REQUESTS_ERROR.code
                )
            }
        }
    }

    private async recordJoinFailure(req: Request, userId: string) {
        const targets = [
            {
                scope: 'user' as const,
                value: this.normalizeRateLimitValue(userId)
            },
            {
                scope: 'ip' as const,
                value: this.normalizeRateLimitValue(this.getRequestIp(req))
            }
        ]

        for (const target of targets) {
            const failureKey = this.getJoinFailureCountKey(target.scope, target.value)
            const count = await this.incrementCounter(failureKey, this.joinFailureWindowSeconds)
            if (count >= this.joinFailureThreshold) {
                await this.redisService.set(
                    this.getJoinFailureBlockKey(target.scope, target.value),
                    true,
                    this.joinFailureBlockSeconds
                )
            }
        }
    }

    private async clearJoinFailureState(req: Request, userId: string) {
        const targets = [
            {
                scope: 'user' as const,
                value: this.normalizeRateLimitValue(userId)
            },
            {
                scope: 'ip' as const,
                value: this.normalizeRateLimitValue(this.getRequestIp(req))
            }
        ]

        await Promise.all(
            targets.flatMap(target => [
                this.redisService.del(this.getJoinFailureCountKey(target.scope, target.value)),
                this.redisService.del(this.getJoinFailureBlockKey(target.scope, target.value))
            ])
        )
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
}
