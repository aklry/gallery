<script setup lang="ts">
import {
    BarChartOutlined,
    CloudOutlined,
    CopyOutlined,
    CrownOutlined,
    EditOutlined,
    LogoutOutlined,
    PictureOutlined,
    PlusOutlined,
    ShareAltOutlined,
    TeamOutlined
} from '@ant-design/icons-vue'
import QueryForm from './component/query-form/index.vue'
import EditBatchModal from './component/edit-batch-modal/index.vue'
import PictureCard from '@/components/picture-card/index.vue'
import { formatTime } from '@/utils'
import { useSpaceDetail } from './hooks'

const {
    spaceDetail,
    handleCreateImage,
    privatePictureList,
    memberList,
    currentInviteCode,
    loading,
    memberLoading,
    inviteLoading,
    inviteSubmitting,
    handleDeletePrivatePicture,
    handleEditPrivatePicture,
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
    handleSearch,
    handleReset,
    handleEditBatchPicture,
    handleGoToSpaceAnalyze,
    handlePreviewPrivatePicture,
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
} = useSpaceDetail()
</script>

<template>
    <div class="max-h-full overflow-auto p-4 lg:p-6 no-scrollbar">
        <!-- Space Header -->
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-7 rounded-[2rem] mb-8 bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.06] backdrop-blur-2xl border border-indigo-500/10 shadow-sm transition-all duration-300 hover:shadow-md"
        >
            <div class="flex flex-col gap-3.5">
                <div class="flex items-center gap-4 flex-wrap">
                    <h1 class="text-2xl font-black text-slate-800 tracking-tight m-0">
                        {{ spaceDetail?.spaceName }}
                    </h1>
                    <a-tag
                        v-if="isTeamSpace"
                        class="!bg-indigo-600 !text-white !border-none !rounded-full px-4 py-0.5 text-xs font-bold uppercase tracking-wider shadow-sm shadow-indigo-200"
                    >
                        团队空间
                    </a-tag>
                    <a-tag
                        v-else
                        class="!bg-emerald-500 !text-white !border-none !rounded-full px-4 py-0.5 text-xs font-bold uppercase tracking-wider shadow-sm shadow-emerald-200"
                    >
                        私人空间
                    </a-tag>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2 text-sm">
                        <PictureOutlined class="text-indigo-500 text-lg" />
                        <span class="font-extrabold text-indigo-600 text-lg">{{ pictureCount }}</span>
                        <span class="text-slate-500 font-medium">张图片</span>
                    </div>
                    <div class="h-4 w-px bg-slate-300/50 hidden sm:block"></div>
                    <div class="flex items-center gap-3.5">
                        <CloudOutlined class="text-slate-400" />
                        <a-tooltip title="空间使用率">
                            <div class="w-32 sm:w-48 overflow-hidden rounded-full h-2 bg-slate-200/50">
                                <div
                                    class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                                    :style="{ width: `${percent}%` }"
                                ></div>
                            </div>
                        </a-tooltip>
                        <span class="text-sm font-bold text-slate-500 min-w-[36px]">{{ percent }}%</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap items-center gap-3 mt-6 md:mt-0">
                <a-button
                    v-if="canUploadPicture"
                    type="primary"
                    class="!rounded-xl !h-10 !px-5 !bg-indigo-600 hover:!scale-105 transition-transform flex items-center justify-center gap-2 border-none shadow-lg shadow-indigo-200"
                    @click="handleCreateImage"
                >
                    <PlusOutlined />
                    <span class="font-bold">上传图片</span>
                </a-button>

                <a-button
                    v-if="isTeamSpace && canInviteSpace"
                    class="!rounded-xl !h-10 !px-5 !bg-white !border-indigo-200 !text-indigo-600 hover:!bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    @click="inviteModalVisible = true"
                >
                    <ShareAltOutlined />
                    <span class="font-bold">邀请</span>
                </a-button>

                <a-button
                    v-if="canAnalyzeSpace"
                    type="primary"
                    ghost
                    class="!rounded-xl !h-10 !px-5 !border-indigo-200 !text-indigo-600 hover:!bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    @click="handleGoToSpaceAnalyze"
                >
                    <BarChartOutlined />
                    <span class="font-bold">分析</span>
                </a-button>
                <a-button
                    v-if="canEditPicture"
                    type="primary"
                    ghost
                    class="!rounded-xl !h-10 !px-5 !border-indigo-200 !text-indigo-600 hover:!bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    @click="editBatchModalVisible = true"
                >
                    <EditOutlined />
                    <span class="font-bold">批量</span>
                </a-button>
                <a-button
                    v-if="isTeamSpace && canManageMembers"
                    class="!rounded-xl !h-10 !px-5 !bg-white !border-slate-200 !text-slate-600 hover:!border-indigo-400 hover:!text-indigo-600 transition-all flex items-center justify-center gap-2"
                    @click="openMemberDrawer"
                >
                    <TeamOutlined />
                    <span class="font-bold">成员</span>
                </a-button>
                <a-button
                    v-if="canQuitSpace"
                    danger
                    ghost
                    class="!rounded-xl !h-10 !px-5 flex items-center justify-center gap-2 hover:!bg-rose-50 transition-all"
                    @click="handleQuitSpace"
                >
                    <LogoutOutlined />
                    <span class="font-bold">退出</span>
                </a-button>
            </div>
        </div>

        <!-- Search Form -->
        <div class="mb-8">
            <query-form :onSuccess="handleSearch" :spaceId="spaceId" :onReset="handleReset" />
        </div>

        <!-- Picture Grid -->
        <div v-if="privatePictureList.length > 0 || loading" class="transition-opacity duration-300">
            <picture-card
                :picture="privatePictureList"
                :loading="loading"
                :showEditAction="canEditPicture"
                :showDeleteAction="canDeletePicture"
                @deletePicture="handleDeletePrivatePicture"
                @editPicture="handleEditPrivatePicture"
                @previewPicture="handlePreviewPrivatePicture"
            />
        </div>

        <!-- Empty State -->
        <div
            v-else
            class="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200"
        >
            <a-empty :description="canUploadPicture ? '暂无图片，点击“上传图片”开始你的创作吧' : '暂无图片'">
                <template #image>
                    <div class="flex justify-center mb-6 scale-150 opacity-20">
                        <PictureOutlined class="text-6xl text-slate-400" />
                    </div>
                </template>
                <a-button
                    v-if="canUploadPicture"
                    type="primary"
                    class="!rounded-xl !h-11 !px-8 !bg-indigo-600 hover:!scale-105 transition-transform flex items-center gap-2 border-none shadow-lg shadow-indigo-200 mt-4"
                    @click="handleCreateImage"
                >
                    <PlusOutlined />
                    <span class="font-bold text-base">立即上传</span>
                </a-button>
            </a-empty>
        </div>

        <!-- Modals and Drawers -->
        <edit-batch-modal
            v-model:visible="editBatchModalVisible"
            :pictureList="privatePictureList"
            :on-ok="handleEditBatchPicture"
        />

        <a-modal
            v-model:open="inviteModalVisible"
            title="空间邀请入驻"
            :footer="null"
            :width="480"
            centered
            class="invite-modal"
        >
            <a-spin :spinning="inviteLoading">
                <div class="flex flex-col gap-6">
                    <div class="px-2">
                        <p class="text-sm leading-relaxed text-slate-500 m-0 font-medium">
                            团队成员可分享 6 位邀请码，非成员在有效期内可直接加入空间，默认角色为浏览者。邀请码有效期为
                            15 分钟。
                        </p>
                    </div>

                    <div
                        class="flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 shadow-inner shadow-white/50"
                    >
                        <template v-if="currentInviteCode && !inviteExpired">
                            <div class="text-5xl font-black tracking-[0.25em] text-indigo-600 font-mono drop-shadow-sm">
                                {{ currentInviteCode.code }}
                            </div>
                            <div
                                class="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"
                            >
                                <CloudOutlined class="text-indigo-300" />
                                有效期至 {{ formatTime(currentInviteCode.expireTime) }}
                            </div>
                            <div class="mt-2 text-xs font-bold text-indigo-400">
                                {{ inviteCountdown }}
                            </div>
                        </template>
                        <template v-else>
                            <a-empty
                                :image="false"
                                description="当前没有可用邀请码，请点击下方按钮生成"
                                class="!my-0 font-medium"
                            />
                        </template>
                    </div>

                    <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-100 justify-center">
                        <a-button
                            type="primary"
                            :loading="inviteSubmitting"
                            class="!rounded-xl !h-10 !px-6 !bg-indigo-600 border-none font-bold"
                            @click="handleGenerateInviteCode()"
                        >
                            {{ currentInviteCode && !inviteExpired ? '重新生成' : '生成邀请码' }}
                        </a-button>
                        <a-button
                            v-if="currentInviteCode && !inviteExpired"
                            :disabled="inviteSubmitting"
                            class="!rounded-xl !h-10 !px-6 !bg-white !border-slate-200 !text-slate-600 hover:!border-indigo-400 hover:!text-indigo-600 font-bold flex items-center gap-2 shadow-sm"
                            @click="handleCopyInviteCode"
                        >
                            <CopyOutlined />
                            复制
                        </a-button>
                        <a-button
                            v-if="currentInviteCode && !inviteExpired"
                            danger
                            ghost
                            class="!rounded-xl !h-10 !px-6 font-bold flex items-center gap-2 hover:!bg-rose-50"
                            :loading="inviteSubmitting"
                            @click="handleDisableInviteCode"
                        >
                            立即失效
                        </a-button>
                    </div>
                </div>
            </a-spin>
        </a-modal>

        <a-drawer
            v-model:open="memberDrawerVisible"
            title="成员管理"
            placement="right"
            :width="560"
            :destroy-on-close="false"
            :header-style="{ borderBottom: '1px solid #f1f5f9', padding: '24px' }"
            :body-style="{ padding: '32px' }"
        >
            <div class="flex flex-col gap-8">
                <div class="flex items-start justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 m-0">团队成员</h3>
                        <p class="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                            管理员可以添加成员、调整角色，并随时移除团队空间中的成员。
                        </p>
                    </div>
                    <a-tag
                        class="!bg-indigo-100 !text-indigo-600 !border-indigo-200 !rounded-full px-4 py-0.5 font-bold"
                    >
                        {{ memberList.length }} 人
                    </a-tag>
                </div>

                <a-card
                    size="small"
                    title="添加成员"
                    class="!rounded-3xl border-slate-200/60 shadow-sm"
                    :head-style="{ fontWeight: 'bold', fontSize: '15px' }"
                >
                    <a-form :model="addMemberForm" layout="vertical" @finish="handleAddMember">
                        <a-form-item
                            label="用户 ID"
                            name="userId"
                            class="!mb-4"
                            :rules="[{ required: true, message: '请输入要添加的用户 ID' }]"
                        >
                            <a-input
                                v-model:value="addMemberForm.userId"
                                placeholder="请输入用户 ID"
                                class="!rounded-xl"
                            />
                        </a-form-item>
                        <a-form-item
                            label="空间角色"
                            name="spaceRole"
                            class="!mb-6"
                            :rules="[{ required: true, message: '请选择空间角色' }]"
                        >
                            <a-select
                                v-model:value="addMemberForm.spaceRole"
                                :options="memberRoleOptions"
                                class="!rounded-xl"
                            />
                        </a-form-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                            :loading="addMemberSubmitting"
                            block
                            class="!rounded-xl !h-10 !bg-indigo-600 border-none font-bold"
                        >
                            立即添加
                        </a-button>
                    </a-form>
                </a-card>

                <div class="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <a-table
                        :data-source="memberList"
                        :loading="memberLoading"
                        :pagination="false"
                        row-key="id"
                        size="middle"
                        class="member-table"
                    >
                        <a-table-column title="成员信息">
                            <template #default="{ record }: { record: any }">
                                <div class="flex items-center gap-3.5 py-1">
                                    <a-avatar
                                        v-if="record.user?.userAvatar"
                                        :src="record.user?.userAvatar"
                                        :size="40"
                                        class="!border-2 !border-white shadow-sm ring-1 ring-slate-100"
                                    />
                                    <a-avatar
                                        v-else
                                        :size="40"
                                        class="!bg-indigo-50/50 flex items-center justify-center border border-indigo-100/50"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            class="w-[24px] h-[24px] text-indigo-400/70"
                                        >
                                            <path
                                                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M6 21C6 18.2386 8.68629 16 12 16C15.3137 16 18 18.2386 18 21"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </a-avatar>
                                    <div class="flex flex-col min-w-0">
                                        <div class="flex items-center gap-1.5 flex-wrap">
                                            <span class="font-bold text-slate-800 truncate">{{
                                                record.user?.userName || record.userId
                                            }}</span>
                                            <a-tag
                                                v-if="record.userId === spaceDetail?.userId"
                                                class="!bg-amber-50 !text-amber-600 !border-amber-100 !rounded-full !px-2 !m-0 !text-[10px] scale-90 font-bold"
                                            >
                                                <CrownOutlined />
                                                创建者
                                            </a-tag>
                                            <a-tag
                                                v-if="record.userId === loginUser?.id"
                                                class="!bg-emerald-50 !text-emerald-600 !border-emerald-100 !rounded-full !px-2 !m-0 !text-[10px] scale-90 font-bold"
                                            >
                                                我
                                            </a-tag>
                                        </div>
                                        <span class="text-[11px] text-slate-400 font-medium mt-0.5">
                                            {{ record.user?.userAccount || record.userId }} ·
                                            {{ formatTime(record.createTime) }}
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </a-table-column>
                        <a-table-column title="角色" width="140">
                            <template #default="{ record }: { record: any }">
                                <a-select
                                    :value="memberRoleDraft[record.id]"
                                    :options="memberRoleOptions"
                                    size="small"
                                    class="!w-full !rounded-lg"
                                    :disabled="memberSubmittingId === record.id"
                                    @update:value="(value: string) => (memberRoleDraft[record.id] = value as any)"
                                    @change="(value: string) => handleChangeMemberRole(record, value as any)"
                                />
                            </template>
                        </a-table-column>
                        <a-table-column title="操作" width="80" align="center">
                            <template #default="{ record }: { record: any }">
                                <a-button
                                    v-if="record.userId !== loginUser?.id"
                                    type="link"
                                    danger
                                    class="!p-0 !h-auto font-bold hover:!text-rose-600"
                                    :loading="memberSubmittingId === record.id"
                                    @click="handleDeleteMember(record)"
                                >
                                    移除
                                </a-button>
                            </template>
                        </a-table-column>
                    </a-table>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

:deep(.ant-table-thead > tr > th) {
    background-color: #f8fafc;
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
    border-bottom: 1px solid #f1f5f9;
}

:deep(.ant-table-tbody > tr > td) {
    border-bottom: 1px solid #f8fafc;
}

:deep(.ant-table-tbody > tr:hover > td) {
    background-color: #f1f5f9/30 !important;
}

:deep(.ant-drawer-header-title) {
    flex-direction: row-reverse;
}

:deep(.ant-drawer-close) {
    margin-inline: 12px 0;
    color: #94a3b8;
}

:deep(.invite-modal .ant-modal-content) {
    border-radius: 2rem;
    padding: 32px;
}

:deep(.invite-modal .ant-modal-header) {
    border-bottom: none;
    margin-bottom: 16px;
}

:deep(.invite-modal .ant-modal-title) {
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
}
</style>
