export enum SpaceTypeEnum {
    PRIVATE = 0,
    TEAM = 1
}

export interface SpaceTypeInfo {
    text: string
    value: SpaceTypeEnum
}

export const SpaceTypeMap: Record<SpaceTypeEnum, SpaceTypeInfo> = {
    [SpaceTypeEnum.PRIVATE]: {
        text: '私有空间',
        value: SpaceTypeEnum.PRIVATE
    },
    [SpaceTypeEnum.TEAM]: {
        text: '团队空间',
        value: SpaceTypeEnum.TEAM
    }
}

export function getSpaceTypeEnumByValue(value: number | null | undefined): SpaceTypeInfo | null {
    if (value === null || value === undefined) {
        return null
    }

    return SpaceTypeMap[value as SpaceTypeEnum] || null
}
