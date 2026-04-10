<script setup lang="ts">
import { computed } from 'vue'
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    LikeFilled,
    LikeOutlined,
    StarFilled,
    StarOutlined
} from '@ant-design/icons-vue'
import { formatSize, formatTime, toHexColor } from '@/utils'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'

const props = withDefaults(
    defineProps<{
        picture: API.GetPictureVoModel | null
        canEdit?: boolean
        canDelete?: boolean
        compact?: boolean
        downloadText?: string
    }>(),
    {
        canEdit: false,
        canDelete: false,
        compact: false,
        downloadText: '下载原图'
    }
)

const emit = defineEmits<{
    (e: 'download'): void
    (e: 'edit'): void
    (e: 'delete'): void
    (e: 'open-page'): void
    (e: 'like'): void
    (e: 'collect', pictureId: string, userId: string): void
}>()

const pictureTags = computed(() => props.picture?.tags ?? [])
const pictureColor = computed(() => toHexColor(props.picture?.picColor))
const showManageActions = computed(() => props.canEdit || props.canDelete)
const isLiked = computed(() => Boolean(props.picture?.isLike))
const isCollected = computed(() => Boolean(props.picture?.isCollect))

const userStore = useUserStore()

const { loginUser } = storeToRefs(userStore)
</script>

<template>
    <div class="picture-detail-content" :class="{ 'picture-detail-content--compact': compact }">
        <a-card class="info-card" :bordered="false">
            <template #title>
                <span class="card-title">基本信息</span>
            </template>

            <div class="picture-summary" v-if="picture?.name || picture?.introduction">
                <h2 class="picture-summary__name">{{ picture?.name || '未命名图片' }}</h2>
                <p class="picture-summary__intro" v-if="picture?.introduction">{{ picture.introduction }}</p>
            </div>

            <div class="info-list">
                <div class="info-item">
                    <span class="label">分辨率</span>
                    <span class="value text-primary"
                        >{{ picture?.picWidth || '-' }} x {{ picture?.picHeight || '-' }}</span
                    >
                </div>
                <div class="info-item">
                    <span class="label">格式</span>
                    <span class="value">{{ picture?.picFormat?.toUpperCase() || '未知' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">大小</span>
                    <span class="value">{{ formatSize(picture?.picSize) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">宽高比</span>
                    <span class="value">{{ picture?.picScale || '未知' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">主色调</span>
                    <span class="value color-value">
                        <span class="color-hex">{{ pictureColor || '无' }}</span>
                        <span class="color-block" v-if="pictureColor" :style="{ backgroundColor: pictureColor }"></span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="label">上传时间</span>
                    <span class="value">{{ formatTime(picture?.createTime) }}</span>
                </div>
                <div class="info-item author-item">
                    <span class="label">作者</span>
                    <a-space class="value">
                        <a-avatar :size="24" :src="picture?.user?.userAvatar" />
                        <span>{{ picture?.user?.userName ?? '佚名' }}</span>
                    </a-space>
                </div>
            </div>

            <div class="interaction-bar" v-if="loginUser.id !== picture?.user.id">
                <a-button class="interact-btn" :class="{ 'interact-btn--active': isLiked }" @click="emit('like')">
                    <template #icon>
                        <LikeFilled v-if="isLiked" />
                        <LikeOutlined v-else />
                    </template>
                    点赞
                </a-button>
                <a-button
                    class="interact-btn"
                    :class="{ 'interact-btn--active': isCollected }"
                    @click="emit('collect', picture?.id as string, picture?.user.id as string)"
                >
                    <template #icon>
                        <StarFilled v-if="isCollected" />
                        <StarOutlined v-else />
                    </template>
                    收藏
                </a-button>
            </div>

            <div class="actions-wrapper">
                <div class="action-btn-group">
                    <a-button type="primary" class="action-btn download-btn" @click="emit('download')">
                        <template #icon><DownloadOutlined /></template>
                        {{ downloadText }}
                    </a-button>
                    <a-dropdown v-if="showManageActions" placement="bottomRight">
                        <a-button type="primary" class="action-btn more-btn" danger> 操作 </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item v-if="canEdit" @click="emit('edit')"> <EditOutlined /> 编辑 </a-menu-item>
                                <a-menu-item v-if="canDelete" @click="emit('delete')" style="color: #ff4d4f">
                                    <DeleteOutlined /> 删除
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </a-card>

        <a-card v-if="picture?.category" class="info-card" :bordered="false">
            <template #title>
                <span class="card-title">分类</span>
            </template>
            <a-tag class="blue-tag">{{ picture.category }}</a-tag>
        </a-card>

        <a-card v-if="pictureTags.length > 0" class="info-card" :bordered="false">
            <template #title>
                <span class="card-title">标签</span>
            </template>
            <a-space wrap>
                <a-tag v-for="tag in pictureTags" :key="tag" class="blue-tag">{{ tag }}</a-tag>
            </a-space>
        </a-card>
    </div>
</template>

<style scoped lang="scss">
.picture-detail-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;

    .info-card {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgb(15 23 42 / 6%);
        overflow: hidden;

        :deep(.ant-card-head) {
            border-bottom: none;
            padding: 16px 20px 0;
            min-height: auto;
        }

        :deep(.ant-card-body) {
            padding: 16px 20px 20px;
        }
    }

    .card-title {
        position: relative;
        padding-left: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #1d2129;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 16px;
            background-color: #1677ff;
            border-radius: 2px;
        }
    }

    .picture-summary {
        margin-bottom: 18px;
        min-width: 0;

        &__name {
            margin: 0;
            font-size: 20px;
            line-height: 1.3;
            color: #1d2129;
            white-space: normal;
            overflow-wrap: anywhere;
            word-break: break-word;
        }

        &__intro {
            margin: 8px 0 0;
            font-size: 14px;
            line-height: 1.6;
            color: #4e5969;
            overflow-wrap: anywhere;
            word-break: break-word;
        }
    }

    .info-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        font-size: 14px;

        .label {
            color: #86909c;
            flex-shrink: 0;
        }

        .value {
            display: inline-flex;
            align-items: center;
            justify-content: flex-end;
            text-align: right;
            color: #1d2129;
            font-weight: 500;
        }

        .text-primary {
            color: #1677ff;
        }
    }

    .color-value {
        gap: 8px;

        .color-block {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 1px solid #e5e6eb;
            flex-shrink: 0;
        }
    }

    .interaction-bar {
        display: flex;
        gap: 12px;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px dashed #f0f0f0;

        .interact-btn {
            flex: 1;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 500;
            color: #4e5969;
            border: 1px solid #e5e6eb;
            transition: all 0.3s;
            box-shadow: 0 2px 4px rgb(0 0 0 / 2%);

            &:hover {
                color: #1677ff;
                border-color: #1677ff;
                background-color: #f0f5ff;
            }

            &.interact-btn--active {
                color: #1677ff;
                border-color: #1677ff;
                background-color: #f0f5ff;
                box-shadow: 0 4px 10px rgb(22 119 255 / 12%);
            }

            &.interact-btn--active:hover {
                color: #1677ff;
                border-color: #1677ff;
                background-color: #e6f4ff;
            }

            :deep(.anticon) {
                font-size: 18px;
                margin-right: 4px;
            }
        }
    }

    .actions-wrapper {
        margin-top: 16px;
    }

    .action-btn-group {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .action-btn {
        height: 40px;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        :deep(.anticon) {
            font-size: 18px;
        }
    }

    .view-btn {
        flex: 1 1 120px;
        border: none;
        background: #f7f8fa;
        color: #1d2129;

        &:hover {
            color: #1677ff;
            background: #f2f3f5;
        }
    }

    .download-btn {
        flex: 1 1 140px;
        background: #1677ff;
        box-shadow: 0 4px 10px rgb(22 119 255 / 20%);
    }

    .more-btn {
        min-width: 88px;
        background: transparent;
        border: 1px solid #ff4d4f;
        color: #ff4d4f;
        box-shadow: none;

        &:hover {
            background: #fff1f0;
        }
    }

    .blue-tag {
        background: #f0f5ff;
        color: #1677ff;
        border: none;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 13px;
    }
}

.picture-detail-content--compact {
    gap: 16px;

    .picture-summary {
        margin-bottom: 16px;

        &__name {
            font-size: 18px;
        }
    }

    .info-card {
        :deep(.ant-card-body) {
            padding: 16px;
        }

        :deep(.ant-card-head) {
            padding: 14px 16px 0;
        }
    }
}

@media (width <= 768px) {
    .picture-detail-content {
        .action-btn-group {
            flex-direction: column;
        }

        .action-btn,
        .more-btn {
            width: 100%;
        }
    }
}
</style>
