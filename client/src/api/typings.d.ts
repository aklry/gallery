declare namespace API {
    type AddSpaceUserDto = {
        /** 空间id */
        spaceId: string
        /** 用户id */
        userId: string
        /** 空间角色 */
        spaceRole: 'viewer' | 'editor' | 'admin'
    }

    type AddSpaceUserVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 添加的空间成员id */
        data: Record<string, any>
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

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

    type AiExpandCreatePictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 数据 */
        data: AiExpandPictureCreatePictureVo
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type AiExpandPictureCreatePictureVo = {
        output: Output
        request_id: string
        code: string
        message: string
    }

    type AiExpandPictureCreateTaskDto = {
        /** 图片url */
        url: string
        /** 扩图比例 */
        xScale: number
        /** 扩图比例 */
        yScale: number
    }

    type AiExpandPictureDto = {
        /** 图片ID */
        pictureId: string
        /** 扩图任务创建参数 */
        aiExpandPictureCreateDto: AiExpandPictureCreateTaskDto
    }

    type AiExpandPictureQueryPictureVo = {
        request_id: string
        output: QueryOutput
        usage?: Usage
    }

    type AiExpandQueryPictureVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 数据 */
        data: AiExpandPictureQueryPictureVo
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type AiGenerateImageCreateTaskVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 数据 */
        data: AiGeneratePictureVo
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type AiGenerateImageSuccessVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 数据 */
        data: AiGeneratePictureSuccessVo
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type AiGeneratePictureSuccessVo = {
        request_id: string
        output: SuccessOutput
        usage: Usage
    }

    type AiGeneratePictureVo = {
        request_id: string
        output: Output
    }

    type CreateSpaceDto = {
        /** 空间名称 */
        spaceName: string
        /** 空间等级 */
        spaceLevel: 0 | 1 | 2
        /** 空间类型 */
        spaceType: number
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

    type DeleteSpaceUserDto = {
        /** 空间成员id */
        id: string
    }

    type DeleteSpaceUserVo = {
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

    type EditPictureBatchVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 批量编辑结果 */
        data: boolean
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type EditPictureByBatchDto = {
        /** 图片id列表 */
        idList: string[]
        /** 空间id */
        spaceId: string
        /** 图片类别 */
        category?: string
        /** 图片标签 */
        tags?: string[]
        /** 命名规则 */
        nameRule?: string
    }

    type EditSpaceDto = {
        /** 空间id */
        id: string
        /** 空间名称 */
        spaceName: string
    }

    type EditSpaceUserDto = {
        /** 空间用户id */
        id: string
        /** 空间角色 */
        spaceRole: 'viewer' | 'editor' | 'admin'
    }

    type EditSpaceUserVo = {
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
        /** 图片颜色 */
        picColor: string
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
        /** 权限列表 */
        permissions?: string[]
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

    type Output = {
        task_status: string
        task_id: string
    }

    type PictureControllerGenerateImageV1Params = {
        taskId: string
    }

    type PictureControllerGetAiExpandPictureTaskV1Params = {
        taskId: string
    }

    type PictureControllerGetByIdV1Params = {
        id: string
    }

    type PictureControllerGetByIdVoV1Params = {
        id: string
    }

    type PictureControllerGetPictureByColorV1Params = {
        spaceId: string
        color: string
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
        /** 图片颜色 */
        picColor: string
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

    type QueryOutput = {
        task_id: string
        task_status: string
        submit_time?: string
        scheduled_time?: string
        end_time?: string
        output_image_url?: string
        task_metrics?: TaskMetrics
        code?: string
        message?: string
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
        /** 空间类型 */
        spaceType?: number
    }

    type QuerySpaceUserDto = {
        /** 空间用户id */
        id?: string
        /** 用户id */
        userId?: string
        /** 空间id */
        spaceId?: string
        /** 空间角色 */
        spaceRole?: 'viewer' | 'editor' | 'admin'
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

    type Result = {
        orig_prompt: string
        actual_prompt: string
        url: string
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
        /** 图片颜色 */
        color: string
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

    type SpaceCategoryAnalyzeDto = {
        /** 空间id */
        spaceId?: string
        /** 是否查询公开图库 */
        queryPublic?: boolean
        /** 全空间分析 */
        queryAll?: boolean
    }

    type SpaceCategoryAnalyzeModelVo = {
        /** 图片分类 */
        category: string
        /** 图片数量 */
        count: number
        /** 分类图片总大小 */
        totalSize: number
    }

    type SpaceCategoryAnalyzeVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 图片分类统计数据 */
        data: SpaceCategoryAnalyzeModelVo[]
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceControllerGetSpaceVoV1Params = {
        spaceId: string
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
        /** 空间类型 */
        spaceType: number
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
        /** 权限列表 */
        permissions?: string[]
    }

    type SpaceRankAnalyzeDto = {
        /** 排名前几的数量 */
        topN?: number
    }

    type SpaceRankAnalyzeModelVo = {
        /** 空间id */
        id: string
        /** 空间名称 */
        spaceName: string
        /** 空间大小 */
        totalSize: number
        /** 用户id */
        userId: string
    }

    type SpaceRankAnalyzeVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 空间排行 */
        data: SpaceRankAnalyzeModelVo[]
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceSizeAnalyzeDto = {
        /** 空间id */
        spaceId?: string
        /** 是否查询公开图库 */
        queryPublic?: boolean
        /** 全空间分析 */
        queryAll?: boolean
    }

    type SpaceSizeAnalyzeVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 图片大小分析结果 */
        data: SpaceSizeModelVo[]
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceSizeModelVo = {
        /** 图片大小范围 */
        sizeRange: string
        /** 图片数量 */
        count: number
    }

    type SpaceTagAnalyzeModelVo = {
        /** 标签 */
        tag: string
        /** 标签使用数量 */
        count: number
    }

    type SpaceTagAnalyzeVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 标签分析数据 */
        data: SpaceTagAnalyzeModelVo[]
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceUsageAnalyzeDto = {
        /** 空间id */
        spaceId?: string
        /** 是否查询公开图库 */
        queryPublic?: boolean
        /** 全空间分析 */
        queryAll?: boolean
    }

    type SpaceUsageAnalyzeModelVo = {
        /** 已使用空间大小 */
        usedSize: number
        /** 总大小 */
        maxSize: number
        /** 空间使用比例 */
        sizeUsageRatio: number
        /** 当前图片数量 */
        usedCount: number
        /** 图片总数量 */
        maxCount: number
        /** 图片使用比例 */
        countUsageRatio: number
    }

    type SpaceUsageAnalyzeVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 返回数据 */
        data: SpaceUsageAnalyzeModelVo
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceUserAnalyzeDto = {
        /** 空间id */
        spaceId?: string
        /** 是否查询公开图库 */
        queryPublic?: boolean
        /** 全空间分析 */
        queryAll?: boolean
        /** 用户id */
        userId: string
        /** 时间维度 */
        timeDimension: string
    }

    type SpaceUserAnalyzeModelVo = {
        /** 时间维度 */
        period: string
        /** 图片数量 */
        count: number
    }

    type SpaceUserAnalyzeVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 用户上传分析结构 */
        data: SpaceUserAnalyzeModelVo[]
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceUserEntitiesModelVo = {
        /** 空间用户id */
        id: string
        /** 用户id */
        userId: string
        /** 空间id */
        spaceId: string
        /** 空间角色 */
        spaceRole: string
        /** 创建时间 */
        createTime: string
        /** 更新时间 */
        updateTime: string
    }

    type SpaceUserEntitiesVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 空间用户信息 */
        data: SpaceUserEntitiesModelVo
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
    }

    type SpaceUserListVo = {
        /** 状态码 */
        code: number
        /** 消息 */
        message: string
        /** 空间用户信息 */
        data: any[][]
        /** 时间戳 */
        timestamp: string
        /** 路径 */
        path: string
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

    type SuccessOutput = {
        task_id: string
        task_status: string
        submit_time: string
        scheduled_time: string
        end_time: string
        results: Result[]
        task_metrics: TaskMetrics
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

    type TaskMetrics = {
        TOTAL: number
        SUCCEEDED: number
        FAILED: number
    }

    type UpdatePictureDto = {
        /** 图片id */
        id: string
        /** 图片名称 */
        name: string
        /** 图片介绍 */
        introduction: string
        /** 图片分类 */
        category: string
        /** 图片标签 */
        tags: string[]
        /** 图片url */
        url?: string
        /** 缩略图url */
        thumbnailUrl?: string
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
        /** 图片颜色 */
        color: string
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

    type Usage = {
        image_count: number
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
