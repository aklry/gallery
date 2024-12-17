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
