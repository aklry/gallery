<script setup lang="ts">
import { SpaceLevelEnum, SpaceLevelOptions } from '@/constants'
import { reactive, watchEffect } from 'vue'
import { EditDialogProps } from './type'
import { formatSize } from '@/utils'

const open = defineModel<boolean>('open')
const form = reactive<API.UpdateSpaceDto>({
    id: '',
    spaceName: '',
    spaceLevel: SpaceLevelEnum.FREE,
    maxSize: 0,
    maxCount: 0
})
const props = defineProps<EditDialogProps>()

watchEffect(() => {
    if (props.editRecord) {
        form.id = props.editRecord.id
        form.spaceName = props.editRecord.spaceName
        form.spaceLevel = props.editRecord.spaceLevel
        form.maxSize = parseFloat(formatSize(props.editRecord.maxSize))
        form.maxCount = Number(props.editRecord.maxCount)
    }
})
const handleOk = () => {
    props.confirm?.(form)
}
</script>
<template>
    <div class="edit-dialog-container">
        <a-modal v-model:open="open" title="编辑空间信息" cancelText="取消" okText="确定" @ok="handleOk">
            <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="空间名称" name="spaceName">
                    <a-input v-model:value="form.spaceName" />
                </a-form-item>
                <a-form-item label="空间等级" name="spaceLevel">
                    <a-select v-model:value="form.spaceLevel" :options="SpaceLevelOptions" />
                </a-form-item>
                <a-form-item label="空间大小" name="maxSize">
                    <a-space>
                        <a-input-number v-model:value="form.maxSize" />
                        <span>MB</span>
                    </a-space>
                </a-form-item>
                <a-form-item label="空间容量" name="maxCount">
                    <a-space>
                        <a-input-number v-model:value="form.maxCount" />
                        <span>个</span>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<style scoped lang="scss">
.edit-dialog-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>
