<template>
    <div class="add-picture">
        <h2 class="text-xl">创建图片</h2>
        <picture-upload :picture="picture" :onUploadSuccess="handleUploadSuccess" />
        <a-card title="图片信息">
            <a-form ::model="pictureInfo">
                <a-form-item label="图片名称" name="name">
                    <a-input v-model:value="pictureInfo.name" />
                </a-form-item>
                <a-form-item label="图片简介" name="introduction">
                    <a-input v-model:value="pictureInfo.introduction" />
                </a-form-item>
                <a-form-item label="图片分类" name="category">
                    <a-auto-complete
                        v-model:value="pictureInfo.category"
                        allowClear
                        placeholder="请输入分类"
                        :options="tag_category?.categoryList"
                    />
                </a-form-item>
                <a-form-item label="图片标签" name="tags">
                    <a-select v-model:value="pictureInfo.tags" :options="tag_category?.tagList" mode="tags" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" block @click="handleUpdatePicture">创建</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/picture-upload/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { pictureControllerListPictureTagCategoryV1, pictureControllerUpdatePictureV1 } from '@/api/picture'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const picture = ref<API.UploadPictureVoModel>()
const router = useRouter()
const handleUploadSuccess = (result: API.UploadPictureVoModel) => {
    picture.value = result
    pictureInfo.name = result.filename
    pictureInfo.id = result.id
}
interface TagCategory {
    tagList: { value: string }[]
    categoryList: { value: string }[]
}
const tag_category = ref<TagCategory>()
const pictureInfo = reactive<API.UpdatePictureDto>({
    id: '',
    introduction: '',
    name: '',
    category: '',
    tags: []
})
const handleUpdatePicture = async () => {
    try {
        const res = await pictureControllerUpdatePictureV1(pictureInfo)
        if (res.data) {
            message.success('创建成功')
            router.push({
                path: `/picture/edit/${pictureInfo.id}`
            })
        } else {
            message.error(res.message)
        }
    } catch (error) {
        message.error('创建失败')
    }
}
onMounted(async () => {
    const res = await pictureControllerListPictureTagCategoryV1()
    const tagList = res.data.tagList.map(item => ({ value: item }))
    const categoryList = res.data.categoryList.map(item => ({ value: item }))

    tag_category.value = {
        tagList,
        categoryList
    }
})
</script>

<style scoped></style>
