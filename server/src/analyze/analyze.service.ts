import { Injectable } from '@nestjs/common'
import {
    SpaceAnalyzeDto,
    SpaceCategoryAnalyzeDto,
    SpaceUsageAnalyzeDto,
    SpaceTagAnalyzeDto,
    SpaceSizeAnalyzeDto,
    SpaceUserAnalyzeDto,
    SpaceRankAnalyzeDto
} from './dto'
import { UserRole } from '../user/enum/user'
import { BusinessException } from '../custom-exception'
import { BusinessStatus } from '../config'
import { SpaceService } from '../space/space.service'
import { Prisma } from '@prisma/client'
import { LoginVoModel } from '../user/vo'
import { PrismaService } from '../prisma/prisma.service'
import {
    SpaceUsageAnalyzeModelVo,
    SpaceCategoryAnalyzeModelVo,
    SpaceTagAnalyzeModelVo,
    SpaceSizeModelVo,
    SpaceUserAnalyzeModelVo,
    SpaceRankAnalyzeModelVo
} from './vo'

@Injectable()
export class AnalyzeService {
    constructor(
        private readonly spaceService: SpaceService,
        private readonly prismaService: PrismaService
    ) {}

    async checkSpaceAnalyzeAuth(spaceAnalyzeDto: SpaceAnalyzeDto, user: LoginVoModel) {
        const { queryPublic, queryAll } = spaceAnalyzeDto
        if (queryPublic || queryAll) {
            if (user.userRole !== UserRole.ADMIN) {
                throw new BusinessException('无权访问公共图库', BusinessStatus.NOT_AUTH_ERROR.code)
            }
        } else {
            const spaceId = spaceAnalyzeDto.spaceId
            if (!spaceId) {
                throw new BusinessException('spaceId不能为空', BusinessStatus.PARAMS_ERROR.code)
            }
            const space = await this.spaceService.getById(spaceId)
            if (!space) {
                throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            this.spaceService.checkSpaceAuth(space, user)
        }
    }

    fillAnalyzeCondition(spaceAnalyzeDto: SpaceAnalyzeDto, where: Prisma.pictureWhereInput) {
        const { spaceId, queryPublic, queryAll } = spaceAnalyzeDto
        if (queryAll) {
            return
        }
        if (queryPublic) {
            where.spaceId = {
                equals: null
            }
            return
        }
        if (spaceId) {
            where.spaceId = {
                equals: spaceId
            }
            return
        }
        throw new BusinessException('未指定查询范围', BusinessStatus.PARAMS_ERROR.code)
    }

    fillAnalyzeConditionByQuery(spaceAnalyzeDto: SpaceAnalyzeDto) {
        const { spaceId, queryPublic, queryAll } = spaceAnalyzeDto
        if (queryAll) {
            return ''
        }
        if (queryPublic) {
            return ' and spaceId is null'
        }
        if (spaceId) {
            return ` and spaceId = '${spaceId}'`
        }
        throw new BusinessException('未指定查询范围', BusinessStatus.PARAMS_ERROR.code)
    }

    async getSpaceUsageAnalyze(spaceUsageAnalyzeDto: SpaceUsageAnalyzeDto, user: LoginVoModel) {
        const { spaceId, queryPublic, queryAll } = spaceUsageAnalyzeDto
        if (queryPublic || queryAll) {
            // 查询全部或公共图库逻辑
            // 仅管理员可以访问
            if (user.userRole !== UserRole.ADMIN) {
                throw new BusinessException('无权访问空间', BusinessStatus.NOT_AUTH_ERROR.code)
            }
            const where: Prisma.pictureWhereInput = {}
            if (!queryAll) {
                where.spaceId = {
                    equals: null
                }
            }
            const result = await this.prismaService.picture.findMany({
                where,
                select: {
                    picSize: true
                }
            })
            const usedCount = BigInt(result.length)
            const usedSize = result.reduce((a, b) => a + b.picSize, BigInt(0))
            return {
                usedCount,
                usedSize,
                maxCount: null,
                maxSize: null,
                sizeUsageRatio: null,
                countUsageRatio: null
            } as SpaceUsageAnalyzeModelVo
        } else {
            // 查询指定空间逻辑
            const space = await this.spaceService.getById(spaceId)
            if (!space) {
                throw new BusinessException('空间不存在', BusinessStatus.PARAMS_ERROR.code)
            }
            this.spaceService.checkSpaceAuth(space, user)
            const totalSize = space.totalSize
            const totalCount = space.totalCount
            const sizeUsageRatio = parseFloat(((Number(totalSize) / Number(space.maxSize)) * 100).toFixed(2))
            const countUsageRatio = parseFloat(((Number(totalCount) / Number(space.maxCount)) * 100).toFixed(2))
            return {
                usedCount: totalCount,
                usedSize: totalSize,
                maxCount: space.maxCount,
                maxSize: space.maxSize,
                sizeUsageRatio,
                countUsageRatio
            } as SpaceUsageAnalyzeModelVo
        }
    }

    async getSpaceCategoryAnalyze(spaceCategoryAnalyzeDto: SpaceCategoryAnalyzeDto, user: LoginVoModel) {
        await this.checkSpaceAnalyzeAuth(spaceCategoryAnalyzeDto, user)
        const where: Prisma.pictureWhereInput = {}
        this.fillAnalyzeCondition(spaceCategoryAnalyzeDto, where)
        const result = await this.prismaService.picture.groupBy({
            by: ['category'],
            _count: {
                _all: true
            },
            _sum: {
                picSize: true
            },
            where
        })
        return result.map(item => {
            const category = item.category !== null ? item.category : '未分类'
            const count = item._count._all
            const size = item._sum.picSize
            return {
                category,
                count,
                totalSize: size
            } as SpaceCategoryAnalyzeModelVo
        }) as SpaceCategoryAnalyzeModelVo[]
    }

    async getSpaceTagAnalyze(spaceTagAnalyzeDto: SpaceTagAnalyzeDto, user: LoginVoModel) {
        await this.checkSpaceAnalyzeAuth(spaceTagAnalyzeDto, user)
        const where: Prisma.pictureWhereInput = {}
        this.fillAnalyzeCondition(spaceTagAnalyzeDto, where)
        const tagsList = await this.prismaService.picture.findMany({
            where,
            select: {
                tags: true
            }
        })
        const result = tagsList
            .map(item => item.tags)
            .filter(tag => tag !== null && tag !== '')
            .map(item => JSON.parse(item))
            .flat()
            .reduce((pre: { [key: string]: number }, cur: string) => {
                if (cur in pre) {
                    pre[cur]++
                } else {
                    pre[cur] = 1
                }
                return pre
            }, {})
        const resultArr: [string, number][] = Object.entries(result)
        return resultArr
            .map(item => {
                const [tag, count] = item
                return {
                    tag,
                    count
                } as SpaceTagAnalyzeModelVo
            })
            .sort((a, b) => b.count - a.count) as SpaceTagAnalyzeModelVo[]
    }

    async getSpaceSizeAnalyze(spaceSizeAnalyzeDto: SpaceSizeAnalyzeDto, user: LoginVoModel) {
        await this.checkSpaceAnalyzeAuth(spaceSizeAnalyzeDto, user)
        const where: Prisma.pictureWhereInput = {}
        this.fillAnalyzeCondition(spaceSizeAnalyzeDto, where)
        const picSizeList = await this.prismaService.picture.findMany({
            select: {
                picSize: true
            },
            where
        })
        const result = picSizeList.map(item => item.picSize)
        const map = new Map<string, number>()
        map.set('<100KB', result.filter(item => item < 100 * 1024).length)
        map.set('100kb-500KB', result.filter(item => item >= 100 * 1024 && item < 500 * 1024).length)
        map.set('500kb-1MB', result.filter(item => item >= 500 * 1024 && item < 1024 * 1024).length)
        map.set('>1MB', result.filter(item => item >= 1024 * 1024).length)
        return Array.from(map).map(item => {
            const [key, value] = item
            return {
                sizeRange: key,
                count: value
            } as SpaceSizeModelVo
        })
    }

    async getSpaceUserAnalyze(spaceUserAnalyzeDto: SpaceUserAnalyzeDto, user: LoginVoModel) {
        const { userId, timeDimension } = spaceUserAnalyzeDto
        await this.checkSpaceAnalyzeAuth(spaceUserAnalyzeDto, user)
        let query = ''
        const queryCondition = this.fillAnalyzeConditionByQuery(spaceUserAnalyzeDto)
        switch (timeDimension) {
            case 'day':
                query = `
                    SELECT DATE_FORMAT(createTime, '%Y-%m-%d') AS period, COUNT(*) AS count
                    FROM picture
                    WHERE userId = '${userId}' ${queryCondition}
                    GROUP BY period
                    ORDER BY period ASC
                `
                break
            case 'month':
                query = `
                    SELECT DATE_FORMAT(createTime, '%Y-%m') AS period, COUNT(*) AS count
                    FROM picture
                    WHERE userId = '${userId}' ${queryCondition}
                    group by period
                    ORDER BY period ASC
                `
                break
            case 'week':
                query = `
                    select YEARWEEK(createTime) AS period, COUNT(*) AS count
                    from picture
                    where userId = '${userId}' ${queryCondition}
                    group by period
                    order by period asc
                `
                break
            default:
                throw new BusinessException('不支持的时间维度', BusinessStatus.PARAMS_ERROR.code)
        }
        const result = (await this.prismaService.$queryRawUnsafe(query)) as Array<{ period: string; count: bigint }>
        return result.map(item => ({
            period: item.period,
            count: Number(item.count)
        })) as SpaceUserAnalyzeModelVo[]
    }

    async getSpaceRankAnalyze(spaceRankAnalyzeDto: SpaceRankAnalyzeDto, user: LoginVoModel) {
        const { topN } = spaceRankAnalyzeDto
        if (user.userRole !== UserRole.ADMIN) {
            throw new BusinessException('无权查看空间排行', BusinessStatus.NOT_AUTH_ERROR.code)
        }
        try {
            const result = await this.prismaService.space.findMany({
                take: topN,
                orderBy: {
                    totalSize: 'desc'
                }
            })
            return result as SpaceRankAnalyzeModelVo[]
        } catch (error) {
            console.log(error)
            throw new BusinessException('获取空间排行失败', BusinessStatus.SYSTEM_ERROR.code)
        }
    }
}
