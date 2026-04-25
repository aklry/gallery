import { useUserStore } from '@/store/modules/user'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { userControllerEditUserV1 } from '@/api/user'
import { pictureControllerGetPictureByPageVoV1 } from '@/api/picture'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { pictureCollectionControllerFavoritePictureCollectionV1 } from '@/api/pictureCollection'
import { pictureLikeControllerLikePictureV1 } from '@/api/pictureLike'

type ActionTabKey = 'likes' | 'collections'

type ActionTabState = {
    list: API.ShowPictureModelVo[]
    current: string
    pageSize: string
    total: number
    loading: boolean
    initialized: boolean
}

const createActionTabState = (): ActionTabState => ({
    list: [],
    current: '1',
    pageSize: '12',
    total: 0,
    loading: false,
    initialized: false
})

const useUserCenter = () => {
    const userStore = useUserStore()
    const router = useRouter()
    const { loginUser: userInfo } = storeToRefs(userStore)
    const open = ref(false)
    const picture = ref<API.UploadAvatarVoModel>()
    const activeTab = ref<ActionTabKey>('likes')
    const actionStats = reactive({
        publicPictureCount: 0,
        likeCount: 0,
        collectionCount: 0,
        loading: false
    })
    const actionTabs = reactive<Record<ActionTabKey, ActionTabState>>({
        likes: createActionTabState(),
        collections: createActionTabState()
    })
    const form = reactive<API.EditUserDto>({
        id: '',
        userName: '',
        userAvatar: '',
        userProfile: '',
        userPassword: ''
    })

    const isAdmin = computed(() => userInfo.value.userRole === 'admin')
    const currentTabState = computed(() => actionTabs[activeTab.value])
    const currentTabTitle = computed(() => (activeTab.value === 'likes' ? '我的点赞' : '我的收藏'))
    const currentTabDescription = computed(() =>
        activeTab.value === 'likes' ? '按最近点赞时间展示你认可的作品。' : '按最近收藏时间展示你留存的灵感。'
    )

    const syncFormWithUser = () => {
        form.id = userInfo.value.id
        form.userName = userInfo.value.userName
        form.userAvatar = userInfo.value.userAvatar
        form.userProfile = userInfo.value.userProfile
        form.userPassword = ''
    }

    const createActionQuery = (tab: ActionTabKey): API.QueryPictureDto => {
        const state = actionTabs[tab]
        return {
            current: state.current,
            pageSize: state.pageSize,
            sortField: 'createTime',
            sortOrder: 'desc',
            ...(tab === 'likes' ? { queryMyLike: true } : { queryMyCollection: true })
        }
    }

    const fetchActionStats = async () => {
        if (!userInfo.value.id) {
            return
        }
        actionStats.loading = true
        try {
            const [publicPictureRes, likeRes, collectionRes] = await Promise.all([
                pictureControllerGetPictureByPageVoV1({
                    current: '1',
                    pageSize: '1',
                    userId: userInfo.value.id
                }),
                pictureControllerGetPictureByPageVoV1({
                    current: '1',
                    pageSize: '1',
                    queryMyLike: true
                }),
                pictureControllerGetPictureByPageVoV1({
                    current: '1',
                    pageSize: '1',
                    queryMyCollection: true
                })
            ])

            actionStats.publicPictureCount = publicPictureRes.code === 1 ? publicPictureRes.data.total : 0
            actionStats.likeCount = likeRes.code === 1 ? likeRes.data.total : 0
            actionStats.collectionCount = collectionRes.code === 1 ? collectionRes.data.total : 0
        } catch (error) {
            message.error('获取个人中心数据失败')
        } finally {
            actionStats.loading = false
        }
    }

    const fetchActionList = async (tab: ActionTabKey = activeTab.value) => {
        const state = actionTabs[tab]
        state.loading = true
        try {
            const res = await pictureControllerGetPictureByPageVoV1(createActionQuery(tab))
            if (res.code !== 1) {
                message.error(res.message || '获取列表失败')
                return
            }
            state.list = res.data.list ?? []
            state.total = res.data.total ?? 0
            state.initialized = true
        } catch (error) {
            message.error(tab === 'likes' ? '获取点赞列表失败' : '获取收藏列表失败')
        } finally {
            state.loading = false
        }
    }

    const handleOk = async () => {
        try {
            const res = await userControllerEditUserV1(form)
            if (res.data) {
                message.success('修改成功')
                open.value = false
                await userStore.fetchLoginUser()
            } else {
                message.error(res.message || '修改失败')
            }
        } catch (error) {
            message.error('修改失败')
        }
    }
    const handleUploadSuccess = (result: API.UploadAvatarVoModel) => {
        picture.value = result
        form.userAvatar = result.url
    }
    const handleEdit = () => {
        syncFormWithUser()
        open.value = true
        picture.value = {
            url: userInfo.value.userAvatar
        }
    }

    const handleGoUpload = () => {
        router.push('/picture/add')
    }

    const handleTabChange = (tab: ActionTabKey) => {
        activeTab.value = tab
        if (!actionTabs[tab].initialized) {
            void fetchActionList(tab)
        }
    }

    const handlePageChange = (page: number, pageSize: number) => {
        currentTabState.value.current = String(page)
        currentTabState.value.pageSize = String(pageSize)
        void fetchActionList(activeTab.value)
    }

    const handleViewPicture = (pictureId: string) => {
        router.push(`/picture/${pictureId}`)
    }

    const handleRemoveAction = async (pictureId: string) => {
        if (!userInfo.value.id) {
            message.info('请先登录')
            return
        }
        try {
            const res =
                activeTab.value === 'likes'
                    ? await pictureLikeControllerLikePictureV1({
                          pictureId,
                          userId: userInfo.value.id,
                          status: 'CANCELLED'
                      })
                    : await pictureCollectionControllerFavoritePictureCollectionV1({
                          pictureId,
                          userId: userInfo.value.id,
                          status: 'CANCELLED'
                      })
            if (res.code !== 1) {
                message.error(res.message || '操作失败')
                return
            }
            message.success(res.message)
            const state = currentTabState.value
            const nextTotal = Math.max(state.total - 1, 0)
            const maxPage = Math.max(1, Math.ceil(nextTotal / Number(state.pageSize)))
            if (Number(state.current) > maxPage) {
                state.current = String(maxPage)
            }
            await Promise.all([fetchActionList(activeTab.value), fetchActionStats()])
        } catch (error) {
            message.error(activeTab.value === 'likes' ? '取消点赞失败' : '取消收藏失败')
        }
    }

    const handleRefreshCurrentTab = async () => {
        await Promise.all([fetchActionList(activeTab.value), fetchActionStats()])
    }

    const handleLogout = async () => {
        await userStore.userLogout()
        router.push('/user/login')
    }

    watch(
        userInfo,
        () => {
            syncFormWithUser()
        },
        { immediate: true }
    )

    onMounted(async () => {
        await Promise.all([fetchActionStats(), fetchActionList('likes')])
    })

    return {
        userInfo,
        isAdmin,
        open,
        form,
        picture,
        activeTab,
        actionStats,
        currentTabState,
        currentTabTitle,
        currentTabDescription,
        handleOk,
        handleUploadSuccess,
        handleEdit,
        handleLogout,
        handleGoUpload,
        handleTabChange,
        handlePageChange,
        handleViewPicture,
        handleRemoveAction,
        handleRefreshCurrentTab
    }
}

export default useUserCenter
