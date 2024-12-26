declare namespace API {
    type AddSpaceVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 空间ID */
        data: string
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type CreateSpaceDto = {
        /** 空间名称 */
        spaceName: string
        /** 空间等级 */
        spaceLevel: 0 | 1 | 2
    }

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

    type DeletePictureDto = {
        /** 图片id */
        id: string
    }

    type DeletePictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 删除结果 */
        data: Record<string, any>
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type DeleteRequest = {
        /** 需要删除的对象的id */
        id: string
    }

    type DeleteSpaceDto = {
        /** 空间ID */
        id: string
    }

    type DeleteSpaceVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 删除空间结果 */
        data: Record<string, any>
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type EditSpaceDto = {
        /** 空间id */
        id: string
        /** 空间名称 */
        spaceName: string
    }

    type EditSpaceVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 编辑空间结果 */
        data: Record<string, any>
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type EditUserDto = {
        /** 用户id */
        id: string
        /** 用户昵称 */
        userName: string
        /** 用户头像 */
        userAvatar: string
        /** 用户简介 */
        userProfile: string
        /** 用户密码 */
        userPassword: string
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
        id?: string
        /** 用户昵称 */
        userName?: string
        /** 用户账号 */
        userAccount?: string
        /** 用户角色 */
        userRole?: string
        /** 用户简介 */
        userProfile?: string
    }

    type GetPictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 图片信息 */
        data: GetPictureVoModel
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type GetPictureVoModel = {
        /** 图片ID */
        id: string
        /** 图片URL */
        url: string
        /** 图片名称 */
        name: string
        /** 图片简介 */
        introduction: string
        /** 图片分类 */
        category: string
        /** 图片标签 */
        tags: string[]
        /** 图片尺寸 */
        picSize: number
        /** 图片宽度 */
        picWidth: number
        /** 图片高度 */
        picHeight: number
        /** 图片缩放比例 */
        picScale: number
        /** 图片格式 */
        picFormat: string
        /** 创建时间 */
        createTime: string
        /** 用户信息 */
        user: LoginVoModel
        /** 空间ID */
        spaceId: string
        /** 编辑时间 */
        editTime: string
        /** 缩略图URL */
        thumbnailUrl: string
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

    type MessageVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 消息信息 */
        data: MessageVoType
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type MessageVoModel = {
        /** 消息id */
        id: string
        /** 消息标题 */
        title: string
        /** 消息内容 */
        content: string
        /** 消息状态 */
        hasRead: string
        /** 所属用户 */
        userId: string
    }

    type MessageVoType = {
        /** 消息信息 */
        list: MessageVoModel[]
        /** 总数 */
        total: number
    }

    type PictureControllerGetByIdV1Params = {
        id: string
    }

    type PictureControllerGetByIdVoV1Params = {
        id: string
    }

    type PictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 图片信息 */
        data: PictureVoType
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type PictureVoModel = {
        /** 图片id */
        id: string
        /** 图片url */
        url: string
        /** 图片名称 */
        name: string
        /** 图片简介 */
        introduction: string
        /** 图片分类 */
        category: string
        /** 图片标签 */
        tags: string[]
        /** 图片尺寸 */
        picSize: number
        /** 图片宽度 */
        picWidth: number
        /** 图片高度 */
        picHeight: number
        /** 图片比例 */
        picScale: number
        /** 图片格式 */
        picFormat: string
        /** 创建时间 */
        createTime: string
        /** 用户id */
        userId: string
        /** 空间id */
        spaceId: string
        /** 审核状态 */
        reviewStatus: number
        /** 审核时间 */
        reviewTime: string
        /** 审核信息 */
        reviewMessage: string
    }

    type PictureVoType = {
        /** 图片信息 */
        list: PictureVoModel[]
        /** 总数 */
        total: number
    }

    type QueryPictureDto = {
        /** 当前页 */
        current: string
        /** 每页条数 */
        pageSize: string
        /** 排序字段 */
        sortField?: string
        /** 排序方式 */
        sortOrder?: string
        /** 图片id */
        id?: string
        /** 图片名称 */
        name?: string
        /** 图片介绍 */
        introduction?: string
        /** 图片分类 */
        category?: string
        /** 图片标签 */
        tags?: string[]
        /** 文件体积 */
        picSize?: number
        /** 图片宽度 */
        picWidth?: number
        /** 图片高度 */
        picHeight?: number
        /** 图片比例 */
        picScale?: number
        /** 图片格式 */
        picFormat?: string
        /** 搜索词 */
        searchText?: string
        /** 用户id */
        userId?: string
        /** 空间ID */
        spaceId?: string
        /** 审核状态 */
        reviewStatus?: number
        /** 审核人id */
        reviewerId?: string
        /** 审核消息 */
        reviewMessage?: string
        /** 是否为公共图库 */
        nullSpaceId?: boolean
        /** 开始编辑时间 */
        startEditTime?: string
        /** 结束编辑时间 */
        endEditTime?: string
    }

    type QuerySpaceDto = {
        /** 当前页 */
        current: string
        /** 每页条数 */
        pageSize: string
        /** 排序字段 */
        sortField?: string
        /** 排序方式 */
        sortOrder?: string
        /** 空间id */
        id?: string
        /** 用户id */
        userId?: string
        /** 空间名称 */
        spaceName?: string
        /** 空间等级 */
        spaceLevel?: 0 | 1 | 2
    }

    type ReadAllMessageVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 是否成功 */
        data: Record<string, any>
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type ReadMessageDto = {
        /** 消息id */
        id: string
    }

    type ReadMessageVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 更新结果 */
        data: Record<string, any>
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type ReviewPictureDto = {
        /** 图片id */
        id: string
        /** 审核状态 */
        reviewStatus: number
        /** 审核消息 */
        reviewMessage?: string
    }

    type ShowPictureModelVo = {
        /** 图片id */
        id: string
        /** 图片url */
        url: string
        /** 图片简介 */
        introduction: string
        /** 图片分类 */
        category: string
        /** 图片标签 */
        tags: string[]
        /** 图片格式 */
        format: string
        /** 图片大小 */
        fileSize: number
        /** 图片宽度 */
        width: number
        /** 图片高度 */
        height: number
        /** 图片名称 */
        filename: string
        /** 图片宽高比 */
        picScale: number
        /** 缩略图url */
        thumbnailUrl: string
    }

    type ShowPictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 图片信息 */
        data: ShowPictureVoType
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type ShowPictureVoType = {
        /** 图片信息 */
        list: ShowPictureModelVo[]
        /** 总数 */
        total: number
    }

    type SpaceLevelVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 空间等级 */
        data: SpaceLevelVoModel[]
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceLevelVoModel = {
        /** 空间等级 */
        value: number
        /** 空间等级名称 */
        text: string
        /** 空间最大容量 */
        maxSize: number
        /** 空间最大数量 */
        maxCount: number
    }

    type SpaceModelVo = {
        /** 空间ID */
        id: string
        /** 空间名称 */
        spaceName: string
        /** 空间等级 */
        spaceLevel: 0 | 1 | 2
        /** 最大容量 */
        maxSize: number
        /** 最大数量 */
        maxCount: number
        /** 总容量 */
        totalSize: number
        /** 总数量 */
        totalCount: number
        /** 用户ID */
        userId: string
        /** 创建时间 */
        createTime: string
        /** 编辑时间 */
        editTime: string
        /** 更新时间 */
        updateTime: string
        /** 用户信息 */
        user: UserVoModel
    }

    type SpaceVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 空间列表 */
        data: SpaceVoType
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceVoType = {
        /** 空间列表 */
        list: SpaceModelVo[]
        /** 总数 */
        total: number
    }

    type TagCategoryList = {
        /** 标签列表 */
        tagList: string[]
        /** 分类列表 */
        categoryList: string[]
    }

    type TagCategoryListVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 标签分类列表 */
        data: TagCategoryList
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UpdatePictureDto = {
        /** 图片id */
        id: string
        /** 空间id */
        spaceId?: string
        /** 图片名称 */
        name: string
        /** 图片介绍 */
        introduction: string
        /** 图片分类 */
        category: string
        /** 图片标签 */
        tags: string[]
    }

    type UpdatePictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 更新结果 */
        data: Record<string, any>
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UpdateSpaceDto = {
        /** 空间id */
        id: string
        /** 空间名称 */
        spaceName?: string
        /** 空间等级 */
        spaceLevel?: 0 | 1 | 2
        /** 空间图片最大容量 */
        maxSize?: number
        /** 空间图片最大数量 */
        maxCount?: number
    }

    type UpdateSpaceVo = {
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

    type UploadAvatarVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 头像信息 */
        data: UploadAvatarVoModel
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UploadAvatarVoModel = {
        /** 头像url */
        url: string
    }

    type UploadBatchPictureDto = {
        /** 关键词 */
        keywords: string
        /** 添加数量 */
        count: number
        /** 空间id */
        spaceId?: string
    }

    type UploadBatchPictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 上传数量 */
        data: number
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UploadPictureUrlDto = {
        /** 图片链接 */
        url: string
        /** 图片id */
        id?: string
        /** 空间id */
        spaceId?: string
    }

    type UploadPictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 图片信息 */
        data: UploadPictureVoModel
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type UploadPictureVoModel = {
        /** 图片id */
        id: string
        /** 图片url */
        url: string
        /** 图片比例 */
        picScale: number
        /** 图片格式 */
        format: string
        /** 图片大小 */
        fileSize: number
        /** 图片宽度 */
        width: number
        /** 图片高度 */
        height: number
        /** 图片名称 */
        filename: string
        /** 图片缩略图url */
        thumbnailUrl: string
        /** 空间id */
        spaceId?: string
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
        /** 创建时间 */
        createTime: string
        /** 用户账户 */
        userAccount: string
    }

    type UserVoType = {
        /** 用户信息 */
        list: UserVoModel[]
        /** 总数 */
        total: number
    }
}
