import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEY } from './permission.decorator'
import { SpaceUserAuthManager } from './SpaceUserAuthManager'
import { BusinessException } from '@shared/custom-exception'
import { BusinessStatus } from '@core/config'
import { PrismaService } from '@core/prisma/prisma.service'
import { SpaceRoleMap } from '@space/user/enum/space-role'
import { SpaceUserAuthContext } from './SpaceUserAuthContext'
import { LoginVoModel } from '@identity/user/vo'
import { SpaceUserPermissionConstant } from './SpaceUserPermissionConstant'
import { SpaceTypeEnum, SpaceTypeMap } from '@space/core/enum'
import { RedisService } from '@core/redis/redis.service'

@Injectable()
export class PermissionKit {
    private static spaceUserAuthManager: SpaceUserAuthManager
    @Inject(RedisService)
    private redisService: RedisService
    static {
        PermissionKit.spaceUserAuthManager = new SpaceUserAuthManager(new PrismaService())
    }

    login(id: string) {
        this.redisService.set('id', id)
    }

    setSession(key: string, value: any) {
        this.redisService.set(key, value)
    }

    getSession(key: string): any {
        return this.redisService.get(key)
    }

    static getSpaceUserAuthManager() {
        return PermissionKit.spaceUserAuthManager
    }
}

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly permissionKit: PermissionKit,
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requiredPermissions) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const loginId = request.session?.user?.id ?? ''
        const permissions = await this.getPermissionList(loginId, PERMISSION_KEY, request)
        return requiredPermissions.every(permission => permissions.includes(permission))
    }

    async getPermissionList(loginId: string, loginType: string, request: any) {
        if (loginType !== PERMISSION_KEY) {
            return []
        }
        const ADMIN_PERMISSIONS = PermissionKit.getSpaceUserAuthManager().getPermissionsByRole(SpaceRoleMap.admin.value)
        const authContext = SpaceUserAuthContext.getAuthContextByRequest(request)
        if (this.isAllFieldsNull(authContext)) {
            return ADMIN_PERMISSIONS
        }
        const user = await this.getLoginUser(loginId, request)
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        const userId = user.id

        let spaceUser = authContext.getSpaceUser()
        if (spaceUser) {
            return PermissionKit.getSpaceUserAuthManager().getPermissionsByRole(spaceUser.spaceRole)
        }

        const spaceUserId = authContext.getSpaceUserId()
        if (spaceUserId) {
            spaceUser = await this.prisma.space_user.findUnique({
                where: {
                    id: spaceUserId
                }
            })
            if (!spaceUser) {
                throw new BusinessException('空间用户不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            const loginSpaceUser = await this.prisma.space_user.findFirst({
                where: {
                    userId,
                    spaceId: spaceUser.spaceId
                }
            })
            if (!loginSpaceUser) {
                return []
            }
            return PermissionKit.getSpaceUserAuthManager().getPermissionsByRole(loginSpaceUser.spaceRole)
        }

        let spaceId = authContext.getSpaceId()
        if (!spaceId) {
            const pictureId = authContext.getPictureId()
            if (!pictureId) {
                return ADMIN_PERMISSIONS
            }
            const picture = await this.prisma.picture.findUnique({
                where: {
                    id: pictureId
                },
                select: {
                    id: true,
                    spaceId: true,
                    userId: true
                }
            })
            if (!picture) {
                throw new BusinessException('未找到图片信息', BusinessStatus.PARAMS_ERROR.code)
            }
            spaceId = picture.spaceId
            if (!spaceId) {
                if (picture.userId === userId || user.userRole === SpaceRoleMap.admin.value) {
                    return ADMIN_PERMISSIONS
                }
                return [SpaceUserPermissionConstant.PICTURE_VIEW]
            }
        }

        const space = await this.prisma.space.findUnique({
            where: {
                id: spaceId
            }
        })
        if (!space) {
            throw new BusinessException('未找到空间信息', BusinessStatus.PARAMS_ERROR.code)
        }
        if (space.spaceType === SpaceTypeMap[SpaceTypeEnum.PRIVATE].value) {
            if (space.userId === userId || user.userRole === SpaceRoleMap.admin.value) {
                return ADMIN_PERMISSIONS
            }
            return []
        }

        spaceUser = await this.prisma.space_user.findFirst({
            where: {
                spaceId,
                userId
            }
        })
        if (!spaceUser) {
            return []
        }
        return PermissionKit.getSpaceUserAuthManager().getPermissionsByRole(spaceUser.spaceRole)
    }

    isAllFieldsNull(obj: SpaceUserAuthContext) {
        return Object.values(obj).every(field => field === null || field === '' || field === undefined)
    }

    async hasPermission(loginId: string, loginType: string, request: any, needPermission: string[]) {
        const permissions = await this.getPermissionList(loginId, loginType, request)
        return needPermission.every(permission => permissions.includes(permission))
    }

    private async getLoginUser(loginId: string, request: any) {
        const sessionUser = request.session?.user as LoginVoModel | undefined
        if (sessionUser) {
            return sessionUser
        }
        if (!loginId) {
            return null
        }
        return (await this.permissionKit.getSession(loginId)) as LoginVoModel
    }
}
