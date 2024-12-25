<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps<{
    picture: API.ShowPictureModelVo[]
    loading: boolean
}>()
const emit = defineEmits(['deletePicture', 'editPicture'])
const handleDeletePrivatePicture = (id: string, e: MouseEvent) => {
    e.stopPropagation()
    emit('deletePicture', id)
}
const handleEditPicture = (id: string, e: MouseEvent) => {
    e.stopPropagation()
    emit('editPicture', id)
}
const goToPictureDetail = (id: string) => {
    router.push(`/picture/${id}`)
}
</script>
<template>
    <div class="picture-card">
        <a-list
            :data-source="picture"
            :loading="loading"
            :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5 }"
        >
            <template #renderItem="{ item: picture }: { item: API.ShowPictureModelVo }">
                <a-list-item @click="goToPictureDetail(picture.id)">
                    <a-card :hoverable="true">
                        <template #cover>
                            <img
                                :src="picture.thumbnailUrl ?? picture.url"
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
<style scoped lang="scss">
.picture-card {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>
