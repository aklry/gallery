import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEY } from './permission.decorator'
import { SpaceUserAuthManager } from './SpaceUserAuthManager'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { PrismaService } from '../prisma/prisma.service'
import { SpaceRoleMap } from '../space-user/enum/space-role'
import { SpaceUserAuthContext } from './SpaceUserAuthContext'
import { LoginVoModel } from '../user/vo'
import { SpaceUserPermissionConstant } from './SpaceUserPermissionConstant'
import { SpaceTypeEnum, SpaceTypeMap } from '../space/enum'

@Injectable()
export class PermissionKit {
    private static spaceUserAuthManager: SpaceUserAuthManager
    private static session: { [key: string]: any } = {}
    private static id: string

    static {
        PermissionKit.spaceUserAuthManager = new SpaceUserAuthManager(new PrismaService())
    }

    static login(id: string) {
        PermissionKit.id = id
    }

    static setSession(key: string, value: any) {
        PermissionKit.session[key] = value
    }

    static getSession(key: string): any {
        return PermissionKit.session[key]
    }

    static getSpaceUserAuthManager() {
        return PermissionKit.spaceUserAuthManager
    }
}

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requiredPermissions) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const user = request.session.user
        return this.getPermissionList(user.id, PERMISSION_KEY, request).then(permissions => {
            if (permissions.length === 0) {
                return true
            }
            return requiredPermissions.every(permission => permissions.includes(permission))
        })
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
        const user = PermissionKit.getSession(loginId) as LoginVoModel
        if (!user) {
            throw new BusinessException('用户未登录', BusinessStatus.NOT_LOGIN_ERROR.code)
        }
        const userId = user.id
        // 优先从上下文获取空间用户信息
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
            const loginSpaceUser = await this.prisma.space_user.findUnique({
                where: {
                    id: spaceUser.id,
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
            // 公共图库，仅本人或管理员可操作
            if (!spaceId) {
                if (picture.userId === userId || user.userRole === SpaceRoleMap.admin.value) {
                    return ADMIN_PERMISSIONS
                } else {
                    return [SpaceUserPermissionConstant.PICTURE_VIEW]
                }
            }
        }
        // 获取Space对象
        const space = await this.prisma.space.findUnique({
            where: {
                id: spaceId
            }
        })
        if (!space) {
            throw new BusinessException('未找到空间信息', BusinessStatus.PARAMS_ERROR.code)
        }
        // 根据空间类型判断权限
        if (space.spaceType === SpaceTypeMap[SpaceTypeEnum.PRIVATE].value) {
            // 私有空间，仅本人或管理员有权限
            if (space.userId === userId || user.userRole === SpaceRoleMap.admin.value) {
                return ADMIN_PERMISSIONS
            }
            return []
        } else {
            // 团队空间，查询SpaceUser并获取角色和权限
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
    }

    isAllFieldsNull(obj: SpaceUserAuthContext) {
        return Object.values(obj).every(field => field === null || field === '' || field === undefined)
    }

    static async hasPermission(loginId: string, loginType: string, request: any, needPermission: string[]) {
        const permissionGuard = new PermissionGuard(new Reflector(), new PrismaService())
        // 获取当前用户的权限列表
        const permissions = await permissionGuard.getPermissionList(loginId, loginType, request)
        return needPermission.every(permission => permissions.includes(permission))
    }
}
