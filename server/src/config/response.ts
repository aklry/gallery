//业务配置
export const BusinessStatus = {
    SUCCESS: { code: 1, message: '操作成功' },
    PARAMS_ERROR: { code: 40000, message: '请求参数错误' },
    PARAMS_VALIDATION_ERROR: { code: 40001, message: '请求参数验证失败' },
    NOT_LOGIN_ERROR: { code: 40100, message: '未登录' },
    NOT_AUTH_ERROR: { code: 40101, message: '无权限' },
    NOT_FOUND_ERROR: { code: 40400, message: '请求数据不存在' },
    FORBIDDEN_ERROR: { code: 40300, message: '禁止访问' },
    SYSTEM_ERROR: { code: 50000, message: '系统错误' },
    OPERATION_ERROR: { code: 50001, message: '操作失败' },
    IMAGE_TYPE_ERROR: { code: 50002, message: '图片格式错误' }
}
