//业务配置
export const BusinessStatus = {
    SUCCESS: { code: 1, message: '操作成功' },
    ERROR: { code: 0, message: '操作失败' },
    FORBIDDEN: { code: 2, message: '禁止访问' },
    MISSING_PARAMETER: { code: 3, message: '缺少参数' },
    UNAUTHORIZED: { code: 4, message: '未授权' },
    NOT_FOUND: { code: 5, message: '未找到' },
    ACCOUNT_OR_PASSWORD_ERROR: { code: 6, message: '账号或密码错误' }
}
