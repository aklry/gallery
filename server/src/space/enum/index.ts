export type SpaceLevel = {
    text: string
    value: number
    maxCount: bigint
    maxSize: bigint
}

export enum SpaceLevelEnum {
    FREE = 0,
    BASIC = 1,
    PREMIUM = 2
}

export const SpaceLevelMap: Record<SpaceLevelEnum, SpaceLevel> = {
    [SpaceLevelEnum.FREE]: {
        text: '免费',
        value: SpaceLevelEnum.FREE,
        maxCount: 100n,
        maxSize: 100n * 1024n * 1024n
    },
    [SpaceLevelEnum.BASIC]: {
        text: '基础',
        value: SpaceLevelEnum.BASIC,
        maxCount: 1000n,
        maxSize: 1000n * 1024n * 1024n
    },
    [SpaceLevelEnum.PREMIUM]: {
        text: '高级',
        value: SpaceLevelEnum.PREMIUM,
        maxCount: 10000n,
        maxSize: 10000n * 1024n * 1024n
    }
}
// 根据 value 获取枚举
export function getEnumByValue(value: number | null | undefined): SpaceLevel | null {
    if (value === null || value === undefined) {
        return null
    }
    return SpaceLevelMap[value as SpaceLevelEnum] || null
}
