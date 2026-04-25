<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import {
    TeamOutlined,
    ArrowRightOutlined,
    CrownOutlined,
    UsergroupAddOutlined,
    AppstoreOutlined,
    PictureOutlined,
    CloudOutlined
} from '@ant-design/icons-vue'
import { spaceControllerListSpaceV1 } from '@/api/space'
import { spaceInviteControllerJoinV1 } from '@/api/spaceInvite'
import { spaceUserControllerGetMyAddTeamV1 } from '@/api/spaceUser'
import { useUserStore } from '@/store/modules/user'
import { formatSize } from '@/utils'

type SpaceRole = 'viewer' | 'editor' | 'admin'

type JoinedSpaceRecord = {
    id: string
    userId: string
    spaceId: string
    spaceRole: SpaceRole
    createTime: string
    updateTime: string
    user?: API.UserVoModel | null
    space?: API.SpaceModelVo | null
}

const router = useRouter()
const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)
const loading = ref(false)
const joinSubmitting = ref(false)
const joinCode = ref('')
const createdSpaces = ref<API.SpaceModelVo[]>([])
const joinedSpaces = ref<JoinedSpaceRecord[]>([])

const roleTextMap: Record<SpaceRole, string> = {
    viewer: '浏览者',
    editor: '编辑者',
    admin: '管理员'
}

const roleColorMap: Record<SpaceRole, string> = {
    viewer: 'text-sky-600 bg-sky-50 border-sky-200',
    editor: 'text-amber-600 bg-amber-50 border-amber-200',
    admin: 'text-violet-600 bg-violet-50 border-violet-200'
}

const hasAnySpace = computed(() => createdSpaces.value.length > 0 || joinedSpaces.value.length > 0)
const shouldShowJoinCard = computed(() => {
    if (loading.value) {
        return false
    }
    return createdSpaces.value.length === 0 && !joinedSpaces.value.some(item => item.spaceRole === 'admin')
})

const goToSpace = (spaceId?: string) => {
    if (!spaceId) {
        return
    }
    router.push(`/space/${spaceId}`)
}

const getUsagePercent = (total?: number | string, max?: number | string) => {
    const t = Number(total) || 0
    const m = Number(max) || 1
    return Math.min(Math.round((t / m) * 100), 100)
}

const fetchCreatedSpaces = async () => {
    const res = await spaceControllerListSpaceV1({
        userId: loginUser.value.id,
        current: '1',
        pageSize: '100'
    })
    if (res.code === 1) {
        createdSpaces.value = res.data.list
        return
    }
    throw new Error(res.message)
}

const fetchJoinedSpaces = async () => {
    const res = await spaceUserControllerGetMyAddTeamV1()
    if (res.code === 1) {
        joinedSpaces.value = ((res.data as unknown as JoinedSpaceRecord[]) ?? []).filter(item => item.space)
        return
    }
    throw new Error(res.message)
}

const handleJoinSpaceByCode = async () => {
    const code = joinCode.value.trim()
    if (!/^\d{6}$/.test(code)) {
        message.warning('请输入 6 位邀请码')
        return
    }
    joinSubmitting.value = true
    try {
        const res = await spaceInviteControllerJoinV1({ code })
        if (res.code === 1) {
            message.success('加入空间成功')
            joinCode.value = ''
            await Promise.all([fetchCreatedSpaces(), fetchJoinedSpaces()])
            await router.push(`/space/${res.data.spaceId}`)
            return
        }
        message.error(res.message)
    } catch (error) {
        message.error('加入空间失败')
    } finally {
        joinSubmitting.value = false
    }
}

onMounted(async () => {
    if (!loginUser.value.id) {
        await userStore.fetchLoginUser()
    }
    if (!loginUser.value.id) {
        await router.push('/user/login')
        return
    }
    loading.value = true
    try {
        await Promise.all([fetchCreatedSpaces(), fetchJoinedSpaces()])
    } catch (error) {
        message.error(error instanceof Error ? error.message : '获取空间列表失败')
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="space-user-page p-6 flex flex-col gap-6 max-h-full overflow-auto">
        <!-- Hero Section -->
        <div class="hero-section relative overflow-hidden rounded-2xl px-8 py-7 flex justify-between items-start gap-6">
            <!-- Decorative background circles -->
            <div
                class="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-indigo-400/10 blur-2xl pointer-events-none"
            />
            <div
                class="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-violet-400/10 blur-2xl pointer-events-none"
            />

            <div class="relative z-10">
                <div
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 mb-3"
                >
                    <AppstoreOutlined />
                    空间协作
                </div>
                <h2 class="text-2xl font-bold text-slate-900 tracking-tight">我的空间与团队</h2>
                <p class="mt-2 max-w-xl text-slate-500 leading-relaxed text-sm">
                    集中展示你创建的空间和已加入的团队空间，进入后可继续管理图片、成员与分析能力。
                </p>
            </div>
            <a-button
                type="primary"
                size="large"
                class="relative z-10 hero-btn !rounded-xl !font-semibold !px-5 !h-11 flex-shrink-0"
                @click="router.push('/space/add')"
            >
                <UsergroupAddOutlined />
                创建新空间
            </a-button>
        </div>

        <div
            v-if="shouldShowJoinCard"
            class="join-card rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 flex flex-col gap-4 shadow-sm"
        >
            <div class="flex flex-col gap-1">
                <div class="text-base font-semibold text-slate-800">通过邀请码加入团队空间</div>
                <div class="text-sm text-slate-500">
                    输入团队成员分享的 6 位邀请码，在有效期内可直接加入团队空间，默认加入角色为浏览者。
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <a-input
                    v-model:value="joinCode"
                    :maxlength="6"
                    allow-clear
                    placeholder="输入 6 位邀请码"
                    class="!rounded-xl !h-11 sm:max-w-xs"
                    @pressEnter="handleJoinSpaceByCode"
                />
                <a-button
                    type="primary"
                    :loading="joinSubmitting"
                    class="!rounded-xl !h-11 !px-5 self-start"
                    @click="handleJoinSpaceByCode"
                >
                    立即加入
                </a-button>
            </div>
        </div>

        <a-spin :spinning="loading">
            <!-- Created Spaces Section -->
            <div class="flex flex-col gap-4 mb-6">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                        <h3 class="text-lg font-bold text-slate-800 m-0">我创建的空间</h3>
                        <span class="text-xs text-slate-400 font-normal">你拥有完整管理权限的空间</span>
                    </div>
                    <span
                        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100"
                    >
                        {{ createdSpaces.length }} 个
                    </span>
                </div>

                <div
                    v-if="createdSpaces.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    <div
                        v-for="space in createdSpaces"
                        :key="space.id"
                        class="space-card group cursor-pointer"
                        @click="goToSpace(space.id)"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0 flex-1">
                                <div
                                    class="text-base font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors duration-200"
                                >
                                    {{ space.spaceName }}
                                </div>
                                <div class="flex flex-wrap items-center gap-1.5 mt-2">
                                    <span
                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200"
                                    >
                                        <CrownOutlined class="text-[10px]" />
                                        创建者
                                    </span>
                                    <span
                                        :class="[
                                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
                                            Number(space.spaceType) === 1
                                                ? 'text-blue-600 bg-blue-50 border-blue-200'
                                                : 'text-emerald-600 bg-emerald-50 border-emerald-200'
                                        ]"
                                    >
                                        {{ Number(space.spaceType) === 1 ? '团队空间' : '私有空间' }}
                                    </span>
                                </div>
                            </div>
                            <ArrowRightOutlined
                                class="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-200 mt-1.5 flex-shrink-0"
                            />
                        </div>

                        <!-- Stats -->
                        <div class="mt-4 pt-3 border-t border-slate-100 space-y-2">
                            <div class="flex items-center justify-between text-xs">
                                <span class="flex items-center gap-1.5 text-slate-500">
                                    <PictureOutlined class="text-indigo-400" />
                                    {{ space.totalCount }}/{{ space.maxCount }} 张
                                </span>
                                <span class="flex items-center gap-1.5 text-slate-500">
                                    <CloudOutlined class="text-violet-400" />
                                    {{ formatSize(space.totalSize) }}/{{ formatSize(space.maxSize) }}
                                </span>
                            </div>
                            <!-- Progress bar -->
                            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                                    :style="{ width: getUsagePercent(space.totalCount, space.maxCount) + '%' }"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-box">
                    <a-empty description="你还没有创建空间" />
                </div>
            </div>

            <!-- Joined Spaces Section -->
            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
                        <h3 class="text-lg font-bold text-slate-800 m-0">我加入的团队空间</h3>
                        <span class="text-xs text-slate-400 font-normal">你作为成员参与协作的团队空间</span>
                    </div>
                    <span
                        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100"
                    >
                        {{ joinedSpaces.length }} 个
                    </span>
                </div>

                <div
                    v-if="joinedSpaces.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    <div
                        v-for="member in joinedSpaces"
                        :key="member.id"
                        class="space-card group cursor-pointer"
                        @click="goToSpace(member.space?.id || member.spaceId)"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0 flex-1">
                                <div
                                    class="text-base font-semibold text-slate-800 truncate group-hover:text-violet-600 transition-colors duration-200"
                                >
                                    {{ member.space?.spaceName || member.spaceId }}
                                </div>
                                <div class="flex flex-wrap items-center gap-1.5 mt-2">
                                    <span
                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200"
                                    >
                                        <TeamOutlined class="text-[10px]" />
                                        团队空间
                                    </span>
                                    <span
                                        :class="[
                                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
                                            roleColorMap[member.spaceRole]
                                        ]"
                                    >
                                        {{ roleTextMap[member.spaceRole] }}
                                    </span>
                                </div>
                            </div>
                            <ArrowRightOutlined
                                class="text-slate-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-200 mt-1.5 flex-shrink-0"
                            />
                        </div>

                        <!-- Stats -->
                        <div class="mt-4 pt-3 border-t border-slate-100 space-y-2">
                            <div class="flex items-center justify-between text-xs">
                                <span class="flex items-center gap-1.5 text-slate-500">
                                    <PictureOutlined class="text-violet-400" />
                                    {{ member.space?.totalCount || 0 }}/{{ member.space?.maxCount || 0 }} 张
                                </span>
                                <span class="flex items-center gap-1.5 text-slate-500">
                                    <CloudOutlined class="text-fuchsia-400" />
                                    {{ formatSize(member.space?.totalSize || 0) }}/{{
                                        formatSize(member.space?.maxSize || 0)
                                    }}
                                </span>
                            </div>
                            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                                    :style="{
                                        width: getUsagePercent(member.space?.totalCount, member.space?.maxCount) + '%'
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-box">
                    <a-empty description="你暂时还没有加入任何团队空间" />
                </div>
            </div>

            <div v-if="!loading && !hasAnySpace" class="empty-box py-20">
                <a-empty description="暂无可用空间，先创建一个试试" />
            </div>
        </a-spin>
    </div>
</template>

<style scoped lang="scss">
.hero-section {
    background: linear-gradient(135deg, rgb(99 102 241 / 8%) 0%, rgb(139 92 246 / 6%) 100%);
    backdrop-filter: blur(12px);
    border: 1px solid rgb(99 102 241 / 10%);
}

.hero-btn {
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgb(99 102 241 / 30%);
    }

    &:active {
        transform: translateY(0);
    }
}

.space-card {
    @apply relative rounded-xl p-5 border border-slate-100 bg-white;

    transition:
        transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
        border-color 0.25s ease;

    &:hover {
        transform: translateY(-2px);
        border-color: rgb(99 102 241 / 20%);
        box-shadow:
            0 4px 6px -1px rgb(0 0 0 / 5%),
            0 10px 25px -5px rgb(99 102 241 / 12%);
    }
}

.empty-box {
    @apply flex flex-col items-center justify-center py-12 rounded-xl;

    background: rgb(248 250 252 / 60%);
    border: 1px dashed #e2e8f0;

    :deep(.ant-empty-description) {
        @apply text-sm;

        color: #94a3b8;
    }
}

@media (width <= 640px) {
    .hero-section {
        @apply flex-col px-5 py-5;
    }
}

::-webkit-scrollbar {
    width: 0;
}
</style>
