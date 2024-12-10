declare namespace API {
    type CreateUserDto = {
        /** 用户昵称 */
        userName: string
        /** 用户头像 */
        userAvatar: string
        /** 用户账号 */
        userAccount: string
        /** 用户简介 */
        userProfile: string
        /** 用户角色 */
        userRole: string
    }

    type DeleteRequest = {
        /** 需要删除的对象的id */
        id: string
    }

    type FindUserDto = {
        /** 当前页 */
        current: string
        /** 每页条数 */
        pageSize: string
        /** 排序字段 */
        sortField?: string
        /** 排序方式 */
        sortOrder?: string
        /** 用户id */
        id: string
        /** 用户昵称 */
        userName: string
        /** 用户账号 */
        userAccount: string
        /** 用户角色 */
        userRole: string
        /** 用户简介 */
        userProfile: string
    }

    type LoginVoModel = {
        /** 用户ID */
        id: string
        /** 用户账号 */
        userAccount: string
        /** 用户名 */
        userName: string
        /** 用户头像 */
        userAvatar: string
        /** 用户简介 */
        userProfile: string
        /** 用户角色 */
        userRole: string
    }

    type UpdateUserDto = {
        /** 用户id */
        id: string
        /** 用户昵称 */
        userName: string
        /** 用户头像 */
        userAvatar: string
        /** 用户简介 */
        userProfile: string
        /** 用户角色 */
        userRole: string
    }

    type User = {
        /** 用户ID */
        id: string
        /** 用户账号 */
        userAccount: string
        /** 用户密码 */
        userPassword: string
        /** 用户名 */
        userName: string
        /** 用户头像 */
        userAvatar: string
        /** 用户简介 */
        userProfile: string
        /** 用户角色 */
        userRole: string
        /** 编辑时间 */
        editTime: string
        /** 创建时间 */
        createTime: string
        /** 更新时间 */
        updateTime: string
        /** 是否删除 */
        isDelete: number
    }

    type UserControllerGetUserByIdV1Params = {
        id: string
    }

    type UserControllerGetUserVoByIdV1Params = {
        id: string
    }

    type UserCreateVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 用户ID */
        data: string
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UserDeleteVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 用户ID */
        data: string
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UserLoginDto = {
        /** 用户账号 */
        userAccount: string
        /** 用户密码 */
        userPassword: string
    }

    type UserLoginVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 用户信息 */
        data: LoginVoModel
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UserLogoutVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 是否登出成功 */
        data: boolean
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UserRegisterDto = {
        /** 用户账号 */
        userAccount: string
        /** 用户密码 */
        userPassword: string
        /** 确认密码 */
        checkedPassword: string
    }

    type UserRegisterVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 用户ID */
        data: string
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UserUpdateVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 更新结果 */
        data: boolean
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UserVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 用户信息 */
        data: UserVoType
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UserVoModel = {
        /** 用户id */
        id: string
        /** 用户昵称 */
        userName: string
        /** 用户头像 */
        userAvatar: string
        /** 用户简介 */
        userProfile: string
        /** 用户角色 */
        userRole: string
    }

    type UserVoType = {
        /** 用户信息 */
        list: UserVoModel[]
        /** 总数 */
        total: number
    }
}
