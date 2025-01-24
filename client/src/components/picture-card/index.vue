<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { PictureCardEmits, PictureCardProps } from './types'
import usePictureCard from './hooks'
const props = defineProps<PictureCardProps>()
const emit = defineEmits<PictureCardEmits>()
const handleDeletePrivatePicture = (id: string, e: MouseEvent) => {
    e.stopPropagation()
    emit('deletePicture', id)
}
const handleEditPicture = (id: string, e: MouseEvent) => {
    e.stopPropagation()
    emit('editPicture', id)
}

const { goToPictureDetail } = usePictureCard(props)
</script>
<template>
    <div class="picture-card">
        <a-list
            :data-source="picture"
            :loading="loading"
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }"
        >
            <template #renderItem="{ item: picture }: { item: API.ShowPictureModelVo }">
                <a-list-item @click="goToPictureDetail(picture.id)">
                    <a-card :hoverable="true">
                        <template #cover>
                            <img
                                :src="picture.thumbnailUrl || picture.url"
                                :alt="picture.filename"
                                style="height: 180px; object-fit: cover"
                            />
                        </template>
                        <a-card-meta :title="picture.filename">
                            <template #description>
                                <a-flex>
                                    <a-tag color="success">{{ picture.category || '默认' }}</a-tag>
                                    <a-tag v-for="tag in picture.tags.slice(0, 2)" :key="tag">{{ tag }}</a-tag>
                                </a-flex>
                            </template>
                        </a-card-meta>
                        <template #actions>
                            <div
                                class="flex justify-center items-center"
                                @click="e => handleEditPicture(picture.id, e)"
                            >
                                <EditOutlined class="mr-1" />
                                编辑
                            </div>
                            <div
                                class="flex justify-center items-center"
                                @click="e => handleDeletePrivatePicture(picture.id, e)"
                            >
                                <DeleteOutlined class="mr-1" />
                                删除
                            </div>
                        </template>
                    </a-card>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>
<style scoped lang="scss"></style>
