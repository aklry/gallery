import AccessEnum from './accessEnum'

const checkAccess = (loginUser: API.LoginVoModel, needAccess: AccessEnum = AccessEnum.NOT_LOGIN) => {
    const loginUserAccess = loginUser?.userRole ?? AccessEnum.NOT_LOGIN
    if (needAccess === AccessEnum.NOT_LOGIN) {
        return true
    }
    // 用户登录才能访问
    if (needAccess === AccessEnum.USER) {
        return loginUserAccess !== AccessEnum.NOT_LOGIN
    }

    // 管理员才能访问
    if (needAccess === AccessEnum.ADMIN) {
        return loginUserAccess === AccessEnum.ADMIN
    }
    return true
}
export default checkAccess
