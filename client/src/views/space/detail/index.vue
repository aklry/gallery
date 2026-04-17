<script setup lang="ts">
import { useSpaceDetail } from './hooks'
import {
    PlusOutlined,
    EditOutlined,
    BarChartOutlined,
    PictureOutlined,
    CloudOutlined,
    TeamOutlined,
    LogoutOutlined,
    CrownOutlined
} from '@ant-design/icons-vue'
import PictureCard from '@/components/picture-card/index.vue'
import QueryForm from './component/query-form/index.vue'
import EditBatchModal from './component/edit-batch-modal/index.vue'
import { formatTime } from '@/utils'

const {
    spaceDetail,
    handleCreateImage,
    privatePictureList,
    memberList,
    loading,
    memberLoading,
    handleDeletePrivatePicture,
    handleEditPrivatePicture,
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
    handleSearch,
    handleReset,
    handleEditBatchPicture,
    handleGoToSpaceAnalyze,
    handlePreviewPrivatePicture,
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
    <div class="space-detail">
        <div class="space-detail-header">
            <div class="space-info">
                <div class="space-info__title-row">
                    <h2 class="space-info__name">{{ spaceDetail?.spaceName }}</h2>
                    <a-tag v-if="isTeamSpace" color="blue">团队空间</a-tag>
                    <a-tag v-else color="green">私有空间</a-tag>
                </div>
                <div class="space-info__stats">
                    <div class="stat-item">
                        <PictureOutlined />
                        <span class="stat-value">{{ pictureCount }}</span>
                        张图片
                    </div>
                    <span class="stat-divider">|</span>
                    <div class="space-capacity">
                        <CloudOutlined style="color: #64748b" />
                        <a-tooltip title="当前使用空间容量">
                            <a-progress
                                :percent="percent"
                                :size="[120, 8]"
                                :stroke-color="{ from: '#6366f1', to: '#8b5cf6' }"
                            />
                        </a-tooltip>
                        <span class="space-capacity__label">{{ percent }}%</span>
                    </div>
                </div>
            </div>
            <div class="space-actions">
                <a-button v-if="canUploadPicture" type="primary" @click="handleCreateImage">
                    <PlusOutlined />
                    创建图片
                </a-button>
                <a-button v-if="canAnalyzeSpace" type="primary" ghost @click="handleGoToSpaceAnalyze">
                    <BarChartOutlined />
                    空间分析
                </a-button>
                <a-button v-if="canEditPicture" type="primary" ghost @click="editBatchModalVisible = true">
                    <EditOutlined />
                    批量编辑
                </a-button>
                <a-button v-if="isTeamSpace && canManageMembers" type="default" @click="openMemberDrawer">
                    <TeamOutlined />
                    成员管理
                </a-button>
                <a-button v-if="canQuitSpace" danger ghost @click="handleQuitSpace">
                    <LogoutOutlined />
                    退出空间
                </a-button>
            </div>
        </div>

        <query-form :onSuccess="handleSearch" :spaceId="spaceId" :onReset="handleReset" />

        <template v-if="privatePictureList.length > 0 || loading">
            <picture-card
                :picture="privatePictureList"
                :loading="loading"
                :showEditAction="canEditPicture"
                :showDeleteAction="canDeletePicture"
                @deletePicture="handleDeletePrivatePicture"
                @editPicture="handleEditPrivatePicture"
                @previewPicture="handlePreviewPrivatePicture"
            />
        </template>
        <template v-else>
            <div class="empty-state">
                <a-empty :description="canUploadPicture ? '暂无图片，点击「创建图片」开始上传吧' : '暂无图片'">
                    <a-button v-if="canUploadPicture" type="primary" @click="handleCreateImage">
                        <PlusOutlined />
                        创建图片
                    </a-button>
                </a-empty>
            </div>
        </template>

        <edit-batch-modal
            v-model:visible="editBatchModalVisible"
            :pictureList="privatePictureList"
            :on-ok="handleEditBatchPicture"
        />

        <a-drawer
            v-model:open="memberDrawerVisible"
            title="成员管理"
            placement="right"
            :width="520"
            :destroy-on-close="false"
        >
            <div class="member-drawer">
                <div class="member-drawer__summary">
                    <div>
                        <div class="member-drawer__title">团队成员</div>
                        <div class="member-drawer__desc">仅团队空间管理员可添加成员、调整角色和移除成员。</div>
                    </div>
                    <a-tag color="blue">{{ memberList.length }} 人</a-tag>
                </div>

                <a-card size="small" title="添加成员" class="member-drawer__card">
                    <a-form :model="addMemberForm" layout="vertical" @finish="handleAddMember">
                        <a-form-item
                            label="用户 ID"
                            name="userId"
                            :rules="[{ required: true, message: '请输入要添加的用户 ID' }]"
                        >
                            <a-input v-model:value="addMemberForm.userId" placeholder="请输入用户 ID" />
                        </a-form-item>
                        <a-form-item
                            label="空间角色"
                            name="spaceRole"
                            :rules="[{ required: true, message: '请选择空间角色' }]"
                        >
                            <a-select v-model:value="addMemberForm.spaceRole" :options="memberRoleOptions" />
                        </a-form-item>
                        <a-button type="primary" html-type="submit" :loading="addMemberSubmitting" block>
                            添加成员
                        </a-button>
                    </a-form>
                </a-card>

                <a-table
                    :data-source="memberList"
                    :loading="memberLoading"
                    :pagination="false"
                    row-key="id"
                    size="small"
                >
                    <a-table-column title="成员">
                        <template #default="{ record }: { record: any }">
                            <div class="member-row">
                                <a-avatar :src="record.user?.userAvatar">{{ record.user?.userName?.[0] }}</a-avatar>
                                <div class="member-row__meta">
                                    <div class="member-row__name">
                                        {{ record.user?.userName || record.userId }}
                                        <a-tag v-if="record.userId === spaceDetail?.userId" color="gold">
                                            <CrownOutlined />
                                            创建者
                                        </a-tag>
                                        <a-tag v-if="record.userId === loginUser.id" color="green">我</a-tag>
                                    </div>
                                    <div class="member-row__sub">
                                        <span>{{ record.user?.userAccount || record.userId }}</span>
                                        <span>加入于 {{ formatTime(record.createTime) }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-table-column>
                    <a-table-column title="角色" width="128">
                        <template #default="{ record }: { record: any }">
                            <a-select
                                :value="memberRoleDraft[record.id]"
                                :options="memberRoleOptions"
                                size="small"
                                :disabled="memberSubmittingId === record.id"
                                @update:value="(value: string) => (memberRoleDraft[record.id] = value as any)"
                                @change="(value: string) => handleChangeMemberRole(record, value as any)"
                            />
                        </template>
                    </a-table-column>
                    <a-table-column title="操作" width="88">
                        <template #default="{ record }: { record: any }">
                            <a-button
                                v-if="record.userId !== loginUser.id"
                                type="link"
                                danger
                                :loading="memberSubmittingId === record.id"
                                @click="handleDeleteMember(record)"
                            >
                                移除
                            </a-button>
                        </template>
                    </a-table-column>
                </a-table>
            </div>
        </a-drawer>
    </div>
</template>
<style scoped lang="scss">
@use './css/index' as *;

.member-drawer {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__summary {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
    }

    &__title {
        font-size: 16px;
        font-weight: 600;
        color: #0f172a;
    }

    &__desc {
        margin-top: 4px;
        font-size: 13px;
        line-height: 1.6;
        color: #64748b;
    }

    &__card {
        border-radius: 12px;
    }
}

.member-row {
    display: flex;
    align-items: center;
    gap: 12px;

    &__meta {
        min-width: 0;
    }

    &__name {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        color: #0f172a;
        font-weight: 500;
    }

    &__sub {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 4px;
        font-size: 12px;
        color: #64748b;
    }
}

.space-info__title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
</style>
