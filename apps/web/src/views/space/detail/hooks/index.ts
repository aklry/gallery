import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import {
    pictureControllerDeletePictureV1,
    pictureControllerEditPictureByBatchV1,
    pictureControllerGetPictureByPageVoV1
} from '@/api/picture'
import { spaceControllerGetSpaceVoV1 } from '@/api/space'
import {
    spaceInviteControllerDisableV1,
    spaceInviteControllerGenerateV1,
    spaceInviteControllerCurrentV1
} from '@/api/spaceInvite'
import {
    spaceUserControllerAddSpaceUserV1,
    spaceUserControllerDeleteSpaceUserV1,
    spaceUserControllerEditSpaceUserAuthV1,
    spaceUserControllerGetSpaceUserListV1,
    spaceUserControllerQuitSpaceV1
} from '@/api/spaceUser'
import { useUserStore } from '@/store/modules/user'
import { pictureDetailCache } from '@/utils/picture-detail-cache'

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
    INVITE: 'space:invite',
    UPLOAD: 'picture:upload',
    EDIT: 'picture:edit',
    DELETE: 'picture:delete'
} as const

const formatCountdown = (seconds: number) => {
    if (seconds <= 0) {
        return '已过期'
    }
    const minute = Math.floor(seconds / 60)
    const second = seconds % 60
    return `${minute}分${second.toString().padStart(2, '0')}秒后失效`
}

export const useSpaceDetail = () => {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const { loginUser } = storeToRefs(userStore)
    const spaceId = route.params.id as string

    const spaceDetail = ref<API.SpaceModelVo>()
    const privatePictureList = ref<API.ShowPictureModelVo[]>([])
    const memberList = ref<SpaceMemberRecord[]>([])
    const currentInviteCode = ref<API.SpaceInviteCodeModelVo | null>(null)

    const loading = ref(false)
    const memberLoading = ref(false)
    const inviteLoading = ref(false)
    const inviteSubmitting = ref(false)
    const memberDrawerVisible = ref(false)
    const editBatchModalVisible = ref(false)
    const memberRoleDraft = ref<Record<string, SpaceRole>>({})
    const addMemberSubmitting = ref(false)
    const memberSubmittingId = ref('')
    const inviteModalVisible = ref(false)
    const nowTs = ref(Date.now())
    let inviteTimer: number | undefined

    const addMemberForm = reactive<{ userId: string; spaceRole: SpaceRole }>({
        userId: '',
        spaceRole: 'viewer'
    })

    const permissionSet = computed(() => new Set(spaceDetail.value?.permissions ?? []))
    const isTeamSpace = computed(() => Number(spaceDetail.value?.spaceType) === 1)
    const canManageMembers = computed(() => permissionSet.value.has(SPACE_PERMISSION.MANAGE_MEMBER))
    const canInviteSpace = computed(() => permissionSet.value.has(SPACE_PERMISSION.INVITE))
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
        return Number.parseFloat(currentPercent)
    })

    const pictureCount = computed(() => spaceDetail.value?.totalCount ?? privatePictureList.value.length)
    const inviteExpireTimestamp = computed(() => {
        if (!currentInviteCode.value?.expireTime) {
            return 0
        }
        return new Date(currentInviteCode.value.expireTime).getTime()
    })
    const inviteRemainingSeconds = computed(() => {
        if (!inviteExpireTimestamp.value) {
            return 0
        }
        return Math.max(0, Math.ceil((inviteExpireTimestamp.value - nowTs.value) / 1000))
    })
    const inviteExpired = computed(() => !currentInviteCode.value || inviteRemainingSeconds.value <= 0)
    const inviteCountdown = computed(() => formatCountdown(inviteRemainingSeconds.value))

    const memberRoleOptions = [
        { label: '浏览者', value: 'viewer' },
        { label: '编辑者', value: 'editor' },
        { label: '管理员', value: 'admin' }
    ]

    const handlePreviewPrivatePicture = (id: string) => {
        void router.push({ path: `/picture/${id}`, query: { spaceId } })
    }

    const fetchCurrentInviteCode = async () => {
        if (!isTeamSpace.value || !canInviteSpace.value) {
            currentInviteCode.value = null
            return
        }
        inviteLoading.value = true
        try {
            const res = await spaceInviteControllerCurrentV1({ spaceId })
            if (res.code === 1) {
                currentInviteCode.value = res.data ?? null
                return
            }
            message.error(res.message)
        } catch (error) {
            message.error('获取邀请码失败')
        } finally {
            inviteLoading.value = false
        }
    }

    const fetchSpaceDetail = async () => {
        try {
            const res = (await spaceControllerGetSpaceVoV1({ spaceId })) as unknown as SpaceDetailResponse
            if (res.code === 1) {
                spaceDetail.value = res.data
                await fetchCurrentInviteCode()
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
        void router.push(`/picture/add?spaceId=${spaceId}`)
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
        void router.push(`/picture/add?id=${id}&spaceId=${spaceId}`)
    }

    const handleSearch = (result: API.ShowPictureVo) => {
        privatePictureList.value = result.data.list
    }

    const handleEditBatchPicture = async (params: API.EditPictureByBatchDto, callback?: () => void) => {
        try {
            const res = await pictureControllerEditPictureByBatchV1({ ...params, spaceId })
            if (res.code === 1) {
                pictureDetailCache.invalidateMany(params.idList)
                message.success('批量编辑成功')
                editBatchModalVisible.value = false
                await Promise.all([fetchPrivatePicture(), fetchSpaceDetail()])
                callback?.()
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('批量编辑失败')
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
        void router.push(`/space/analyze?spaceId=${spaceId}`)
    }

    const handleGenerateInviteCode = async (expireMinutes: number = 15) => {
        if (!canInviteSpace.value) {
            message.warning('当前角色没有生成邀请码权限')
            return
        }
        inviteSubmitting.value = true
        try {
            const res = await spaceInviteControllerGenerateV1({
                spaceId,
                expireMinutes
            })
            if (res.code === 1) {
                currentInviteCode.value = res.data ?? null
                message.success('邀请码已生成')
            } else {
                message.error(res.message)
            }
        } catch (error) {
            message.error('生成邀请码失败')
        } finally {
            inviteSubmitting.value = false
        }
    }

    const handleCopyInviteCode = async () => {
        if (!currentInviteCode.value?.code || inviteExpired.value) {
            message.warning('当前没有可复制的有效邀请码')
            return
        }
        try {
            await navigator.clipboard.writeText(currentInviteCode.value.code)
            message.success('邀请码已复制')
        } catch (error) {
            message.error('复制邀请码失败')
        }
    }

    const handleDisableInviteCode = () => {
        if (!currentInviteCode.value) {
            return
        }
        Modal.confirm({
            title: '确定让当前邀请码立即失效吗？',
            content: '失效后，成员将无法继续通过这个邀请码加入空间。',
            okText: '立即失效',
            cancelText: '取消',
            onOk: async () => {
                inviteSubmitting.value = true
                try {
                    const res = await spaceInviteControllerDisableV1({ spaceId })
                    if (res.code === 1) {
                        currentInviteCode.value = null
                        message.success('邀请码已失效')
                    } else {
                        message.error(res.message)
                    }
                } catch (error) {
                    message.error('邀请码失效失败')
                } finally {
                    inviteSubmitting.value = false
                }
            }
        })
    }

    const openMemberDrawer = async () => {
        memberDrawerVisible.value = true
        await fetchMemberList()
    }

    const handleAddMember = async () => {
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
            content: `移除后，${member.user?.userName || member.userId} 将失去当前空间的访问权限。`,
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
            content: '退出后，你将无法继续访问该团队空间中的内容。',
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
        inviteTimer = window.setInterval(() => {
            nowTs.value = Date.now()
        }, 1000)
        await fetchSpaceDetail()
        await fetchPrivatePicture()
    })

    onUnmounted(() => {
        if (inviteTimer !== undefined) {
            clearInterval(inviteTimer)
        }
    })

    return {
        spaceDetail,
        privatePictureList,
        memberList,
        currentInviteCode,
        loading,
        memberLoading,
        inviteLoading,
        inviteSubmitting,
        percent,
        spaceId,
        editBatchModalVisible,
        memberDrawerVisible,
        inviteModalVisible,
        addMemberForm,
        addMemberSubmitting,
        memberSubmittingId,
        memberRoleDraft,
        memberRoleOptions,
        isTeamSpace,
        canManageMembers,
        canInviteSpace,
        canUploadPicture,
        canEditPicture,
        canDeletePicture,
        canAnalyzeSpace,
        canQuitSpace,
        inviteExpired,
        inviteCountdown,
        handleCreateImage,
        handleDeletePrivatePicture,
        handleEditPrivatePicture,
        handlePreviewPrivatePicture,
        handleSearch,
        handleReset,
        handleEditBatchPicture,
        handleGoToSpaceAnalyze,
        handleGenerateInviteCode,
        handleCopyInviteCode,
        handleDisableInviteCode,
        openMemberDrawer,
        handleAddMember,
        handleChangeMemberRole,
        handleDeleteMember,
        handleQuitSpace,
        pictureCount,
        loginUser
    }
}
