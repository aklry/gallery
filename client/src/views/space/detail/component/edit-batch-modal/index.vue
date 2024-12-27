<script setup lang="ts">
import { useEditBatchModal } from './hooks'
import { EditBatchProps } from './types'

const props = defineProps<EditBatchProps>()
const visible = defineModel('visible', {
    type: Boolean,
    default: false
})
const { editBatchParams, categoryList, tagList, idList, handleOk } = useEditBatchModal(props)
</script>

<template>
    <div class="edit-batch-modal">
        <a-modal v-model:open="visible" title="批量编辑图片" @ok="handleOk">
            <a-form :model="editBatchParams" ref="form">
                <a-form-item label="分类" name="category">
                    <a-select v-model:value="editBatchParams.category" :options="categoryList" />
                </a-form-item>
                <a-form-item label="标签" name="tags">
                    <a-select v-model:value="editBatchParams.tags" mode="multiple" :options="tagList" />
                </a-form-item>
                <a-form-item label="图片列表" name="idList">
                    <a-select v-model:value="editBatchParams.idList" mode="multiple" :options="idList" />
                </a-form-item>
                <a-form-item label="命名规则" name="nameRule">
                    <a-input
                        v-model:value="editBatchParams.nameRule"
                        placeholder="请输入命名规则(例如:filename{index})"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<style scoped lang="scss"></style>
