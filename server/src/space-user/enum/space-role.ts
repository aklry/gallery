export enum SpaceRole {
    VIEWER = 'viewer',
    EDITOR = 'editor',
    ADMIN = 'admin'
}

export interface SpaceRoleInfo {
    text: string
    value: SpaceRole
}

export const SpaceRoleMap: Record<SpaceRole, SpaceRoleInfo> = {
    [SpaceRole.VIEWER]: {
        text: '浏览者',
        value: SpaceRole.VIEWER
    },
    [SpaceRole.EDITOR]: {
        text: '编辑者',
        value: SpaceRole.EDITOR
    },
    [SpaceRole.ADMIN]: {
        text: '管理员',
        value: SpaceRole.ADMIN
    }
}

export const SpaceRoleHelper = {
    getEnumByValue(value: string): SpaceRole | null {
        if (!value) return null
        return Object.values(SpaceRole).find(enumValue => enumValue === value) || null
    },

    getAllTexts(): string[] {
        return Object.values(SpaceRoleMap).map(info => info.text)
    },

    getAllValues(): SpaceRole[] {
        return Object.values(SpaceRole)
    }
}
