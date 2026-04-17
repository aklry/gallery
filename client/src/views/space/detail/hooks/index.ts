import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { spaceControllerGetSpaceVoV1 } from '@/api/space'
import {
    pictureControllerDeletePictureV1,
    pictureControllerEditPictureByBatchV1,
    pictureControllerGetPictureByPageVoV1
} from '@/api/picture'
import {
    spaceUserControllerAddSpaceUserV1,
    spaceUserControllerDeleteSpaceUserV1,
    spaceUserControllerEditSpaceUserAuthV1,
    spaceUserControllerGetSpaceUserListV1,
    spaceUserControllerQuitSpaceV1
} from '@/api/spaceUser'
import { pictureDetailCache } from '@/utils/picture-detail-cache'
import { useUserStore } from '@/store/modules/user'

type SpaceRole = 'viewer' | 'editor' | 'admin'

type SpaceMemberRecord = {
    id: string
    userId: string
    spaceId: string
    spaceRole: SpaceRole
    createTime: string
    updateTime: string
    user?: API.UserVoModel | null
    space?: API.SpaceModelVo | null
}

type SpaceDetailResponse = {
    code: number
    message: string
    data: API.SpaceModelVo
}

const SPACE_PERMISSION = {
    ANALYZE: 'space:analyze',
    MANAGE_MEMBER: 'spaceUser:manage',
    UPLOAD: 'picture:upload',
    EDIT: 'picture:edit',
    DELETE: 'picture:delete'
} as const

export const useSpaceDetail = () => {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const { loginUser } = storeToRefs(userStore)
    const spaceId = route.params.id as string
    const spaceDetail = ref<API.SpaceModelVo>()
    const privatePictureList = ref<API.ShowPictureModelVo[]>([])
    const memberList = ref<SpaceMemberRecord[]>([])
    const loading = ref(false)
    const memberLoading = ref(false)
    const memberDrawerVisible = ref(false)
    const editBatchModalVisible = ref(false)
    const memberRoleDraft = ref<Record<string, SpaceRole>>({})
    const addMemberSubmitting = ref(false)
    const memberSubmittingId = ref('')
    const addMemberForm = reactive<{ userId: string; spaceRole: SpaceRole }>({
        userId: '',
        spaceRole: 'viewer'
    })

    const permissionSet = computed(() => new Set(spaceDetail.value?.permissions ?? []))
    const isTeamSpace = computed(() => Number(spaceDetail.value?.spaceType) === 1)
    const canManageMembers = computed(() => permissionSet.value.has(SPACE_PERMISSION.MANAGE_MEMBER))
    const canUploadPicture = computed(() => permissionSet.value.has(SPACE_PERMISSION.UPLOAD))
    const canEditPicture = computed(() => permissionSet.value.has(SPACE_PERMISSION.EDIT))
    const canDeletePicture = computed(() => permissionSet.value.has(SPACE_PERMISSION.DELETE))
    const canAnalyzeSpace = computed(() => permissionSet.value.has(SPACE_PERMISSION.ANALYZE))
    const canQuitSpace = computed(() => {
        if (!isTeamSpace.value || !loginUser.value?.id || !spaceDetail.value?.userId) {
            return false
        }
        return loginUser.value.id !== spaceDetail.value.userId
    })
    const percent = computed(() => {
        const currentPercent = (
            ((spaceDetail.value?.totalSize ?? 0) / (spaceDetail.value?.maxSize ?? 1)) *
            100
        ).toFixed(2)
        return parseFloat(currentPercent)
    })
    const pictureCount = computed(() => spaceDetail.value?.totalCount ?? privatePictureList.value.length)
    const memberRoleOptions = [
        { label: '浏览者', value: 'viewer' },
        { label: '编辑者', value: 'editor' },
        { label: '管理员', value: 'admin' }
    ]

    const handlePreviewPrivatePicture = (id: string) => {
        void router.push({ path: `/picture/${id}`, query: { spaceId } })
    }

    const fetchSpaceDetail = async () => {
        try {
            const res = (await spaceControllerGetSpaceVoV1({ spaceId })) as unknown as SpaceDetailResponse
            if (res.code === 1) {
                spaceDetail.value = res.data
                return
            }
            message.error(res.message)
        } catch (error) {
            message.error('获取空间详情失败')
        }
    }

    const fetchPrivatePicture = async () => {
        loading.value = true
        try {
            const res = await pictureControllerGetPictureByPageVoV1({ spaceId, current: '1', pageSize: '10' })
            if (res.code === 1) {
                privatePictureList.value = res.data.list
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('获取图片失败')
        } finally {
            loading.value = false
        }
    }

    const fetchMemberList = async () => {
        if (!canManageMembers.value) {
            return
        }
        memberLoading.value = true
        try {
            const res = await spaceUserControllerGetSpaceUserListV1({ spaceId })
            if (res.code === 1) {
                const list = (res.data as unknown as SpaceMemberRecord[]) ?? []
                memberList.value = list
                memberRoleDraft.value = Object.fromEntries(list.map(item => [item.id, item.spaceRole]))
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('获取成员列表失败')
        } finally {
            memberLoading.value = false
        }
    }

    const handleCreateImage = () => {
        if (!canUploadPicture.value) {
            message.warning('当前角色没有上传图片权限')
            return
        }
        router.push(`/picture/add?spaceId=${spaceId}`)
    }

    const handleDeletePrivatePicture = async (id: string) => {
        Modal.confirm({
            title: '确定删除图片吗？',
            content: '删除后将无法恢复',
            okText: '删除',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const res = await pictureControllerDeletePictureV1({ id })
                    if (res.code === 1) {
                        pictureDetailCache.invalidate(id)
                        message.success('删除成功')
                        await Promise.all([fetchPrivatePicture(), fetchSpaceDetail()])
                    } else {
                        message.error(res.message)
                    }
                } catch (error) {
                    message.error('删除图片失败')
                }
            }
        })
    }

    const handleEditPrivatePicture = (id: string) => {
        if (!canEditPicture.value) {
            message.warning('当前角色没有编辑图片权限')
            return
        }
        router.push(`/picture/add?id=${id}&spaceId=${spaceId}`)
    }

    const handleSearch = (result: API.ShowPictureVo) => {
        privatePictureList.value = result.data.list
    }

    const handleEditBatchPicture = async (params: API.EditPictureByBatchDto, callback?: () => void) => {
        try {
            const res = await pictureControllerEditPictureByBatchV1({ ...params, spaceId })
            if (res.code === 1) {
                pictureDetailCache.invalidateMany(params.idList)
                message.success('编辑图片成功')
                editBatchModalVisible.value = false
                await Promise.all([fetchPrivatePicture(), fetchSpaceDetail()])
                callback?.()
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('编辑图片失败')
        }
    }

    const handleReset = async () => {
        await fetchPrivatePicture()
    }

    const handleGoToSpaceAnalyze = () => {
        if (!canAnalyzeSpace.value) {
            message.warning('当前角色没有空间分析权限')
            return
        }
        router.push(`/space/analyze?spaceId=${spaceId}`)
    }

    const openMemberDrawer = async () => {
        memberDrawerVisible.value = true
        await fetchMemberList()
    }

    const handleAddMember = async () => {
        console.log(addMemberForm)
        if (!addMemberForm.userId) {
            message.warning('请输入要添加的用户 ID')
            return
        }
        addMemberSubmitting.value = true
        try {
            const res = await spaceUserControllerAddSpaceUserV1({
                spaceId,
                userId: addMemberForm.userId,
                spaceRole: addMemberForm.spaceRole
            })
            if (res.code === 1) {
                message.success('添加成员成功')
                addMemberForm.userId = ''
                addMemberForm.spaceRole = 'viewer'
                await fetchMemberList()
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('添加成员失败')
        } finally {
            addMemberSubmitting.value = false
        }
    }

    const handleChangeMemberRole = async (member: SpaceMemberRecord, nextRole: SpaceRole) => {
        if (member.spaceRole === nextRole) {
            return
        }
        memberSubmittingId.value = member.id
        try {
            const res = await spaceUserControllerEditSpaceUserAuthV1({ id: member.id, spaceRole: nextRole })
            if (res.code === 1) {
                message.success('成员角色更新成功')
                await fetchMemberList()
            } else {
                memberRoleDraft.value[member.id] = member.spaceRole
                message.error(res.message)
            }
        } catch (error) {
            memberRoleDraft.value[member.id] = member.spaceRole
            message.error('成员角色更新失败')
        } finally {
            memberSubmittingId.value = ''
        }
    }

    const handleDeleteMember = (member: SpaceMemberRecord) => {
        Modal.confirm({
            title: '确定移除该成员吗？',
            content: `成员移除后将失去当前空间的访问权限。${member.user?.userName ? `用户：${member.user.userName}` : ''}`,
            okText: '移除',
            cancelText: '取消',
            onOk: async () => {
                memberSubmittingId.value = member.id
                try {
                    const res = await spaceUserControllerDeleteSpaceUserV1({ id: member.id })
                    if (res.code === 1) {
                        message.success('成员移除成功')
                        await fetchMemberList()
                    } else {
                        message.error(res.message)
                    }
                } catch (error) {
                    message.error('成员移除失败')
                } finally {
                    memberSubmittingId.value = ''
                }
            }
        })
    }

    const handleQuitSpace = () => {
        Modal.confirm({
            title: '确定退出该团队空间吗？',
            content: '退出后将无法继续访问该团队空间中的内容。',
            okText: '退出',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const res = await spaceUserControllerQuitSpaceV1({ spaceId })
                    if (res.code === 1) {
                        message.success('已退出团队空间')
                        await router.push('/space/user')
                    } else {
                        message.error(res.message)
                    }
                } catch (error) {
                    message.error('退出团队空间失败')
                }
            }
        })
    }

    onMounted(async () => {
        await Promise.all([fetchSpaceDetail(), fetchPrivatePicture()])
    })

    return {
        spaceDetail,
        privatePictureList,
        memberList,
        loading,
        memberLoading,
        percent,
        spaceId,
        editBatchModalVisible,
        memberDrawerVisible,
        addMemberForm,
        addMemberSubmitting,
        memberSubmittingId,
        memberRoleDraft,
        memberRoleOptions,
        isTeamSpace,
        canManageMembers,
        canUploadPicture,
        canEditPicture,
        canDeletePicture,
        canAnalyzeSpace,
        canQuitSpace,
        handleCreateImage,
        handleDeletePrivatePicture,
        handleEditPrivatePicture,
        handlePreviewPrivatePicture,
        handleSearch,
        handleReset,
        handleEditBatchPicture,
        handleGoToSpaceAnalyze,
        openMemberDrawer,
        handleAddMember,
        handleChangeMemberRole,
        handleDeleteMember,
        handleQuitSpace,
        pictureCount,
        loginUser
    }
}
