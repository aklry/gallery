<script setup lang="ts">
import { useEditBatchModal } from './hooks'
import { EditBatchProps } from './types'
import { TagsOutlined, AppstoreOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons-vue'

const props = defineProps<EditBatchProps>()
const visible = defineModel('visible', {
    type: Boolean,
    default: false
})
const { editBatchParams, categoryList, tagList, idList, handleOk } = useEditBatchModal(props)
</script>

<template>
    <div class="edit-batch-modal">
        <a-modal v-model:open="visible" title="批量编辑图片" @ok="handleOk" width="520px" centered>
            <a-form :model="editBatchParams" ref="form" layout="vertical" class="batch-form">
                <a-form-item label="分类" name="category">
                    <template #label>
                        <span class="form-label"><AppstoreOutlined /> 分类</span>
                    </template>
                    <a-select
                        v-model:value="editBatchParams.category"
                        :options="categoryList"
                        placeholder="请选择分类"
                    />
                </a-form-item>
                <a-form-item name="tags">
                    <template #label>
                        <span class="form-label"><TagsOutlined /> 标签</span>
                    </template>
                    <a-select
                        v-model:value="editBatchParams.tags"
                        mode="multiple"
                        :options="tagList"
                        placeholder="请选择标签"
                    />
                </a-form-item>
                <a-form-item name="idList">
                    <template #label>
                        <span class="form-label"><FileTextOutlined /> 图片列表</span>
                    </template>
                    <a-select
                        v-model:value="editBatchParams.idList"
                        mode="multiple"
                        :options="idList"
                        placeholder="请选择要编辑的图片"
                    />
                </a-form-item>
                <a-form-item name="nameRule">
                    <template #label>
                        <span class="form-label"><EditOutlined /> 命名规则</span>
                    </template>
                    <a-input
                        v-model:value="editBatchParams.nameRule"
                        placeholder="请输入命名规则(例如:filename{index})"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<style scoped lang="scss">
.batch-form {
    .form-label {
        @apply flex items-center gap-1.5;

        color: #374151;
    }

    :deep(.ant-form-item) {
        @apply mb-4;
    }
}
</style>
