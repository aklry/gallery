export enum ReviewStatus {
    REVIEWING = 0,
    PASS = 1,
    REJECT = 2
}

export const ReviewMessage = {
    [ReviewStatus.REVIEWING]: '审核中',
    [ReviewStatus.PASS]: '审核通过',
    [ReviewStatus.REJECT]: '审核不通过'
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export enum MessageStatus {
    UNREAD = 'UNREAD',
    READ = 'READ'
}

export enum SpaceLevelEnum {
    FREE = 0,
    BASIC = 1,
    PREMIUM = 2
}

export const SpaceLevelMap = {
    [SpaceLevelEnum.FREE]: {
        text: '免费版',
        color: 'blue'
    },
    [SpaceLevelEnum.BASIC]: {
        text: '基础版',
        color: 'green'
    },
    [SpaceLevelEnum.PREMIUM]: {
        text: '高级版',
        color: 'red'
    }
}

export const SpaceLevelOptions = Object.values(SpaceLevelEnum)
    .splice(3)
    .map(level => ({
        label: SpaceLevelMap[level as keyof typeof SpaceLevelMap].text,
        value: level
    }))
