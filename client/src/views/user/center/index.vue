<template>
    <div class="flex justify-center items-center h-full bg-gray-100">
        <a-card title="个人信息" class="w-[600px] shadow-lg rounded-lg">
            <template #extra>
                <a-button type="primary" @click="handleEdit">编辑</a-button>
            </template>
            <div class="flex justify-center mb-4">
                <a-avatar :src="userInfo.userAvatar || image" :size="100" />
            </div>
            <a-descriptions :column="1" class="p-4">
                <a-descriptions-item label="用户名" class="mb-4">
                    <span class="text-lg font-medium">{{ userInfo.userName ?? '佚名' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="账号" class="mb-4">
                    <span class="text-lg font-medium">{{ userInfo.userAccount }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="简介">
                    <span class="text-lg font-medium">{{ userInfo.userProfile ?? '暂无简介' }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="角色" class="mb-4">
                    <span
                        class="px-3 py-1 rounded-full text-sm"
                        :class="{
                            'bg-blue-100 text-blue-800': userInfo.userRole === 'admin',
                            'bg-green-100 text-green-800': userInfo.userRole !== 'admin'
                        }"
                    >
                        {{ userInfo.userRole === 'admin' ? '管理员' : '普通用户' }}
                    </span>
                </a-descriptions-item>
            </a-descriptions>
        </a-card>
        <a-modal v-model:open="open" title="编辑个人信息" cancelText="取消" okText="确定" @ok="handleOk">
            <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="用户名">
                    <a-input v-model:value="form.userName" />
                </a-form-item>
                <a-form-item label="用户头像">
                    <PictureUpload :picture="picture" prefix="avatar" :onUploadAvatarSuccess="handleUploadSuccess" />
                </a-form-item>
                <a-form-item label="用户简介">
                    <a-textarea v-model:value="form.userProfile" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import useUserCenter from './hooks'
import image from '@/assets/images/logo.png'
import PictureUpload from '@/components/picture-upload/index.vue'

const { userInfo, open, form, handleOk, handleUploadSuccess, picture, handleEdit } = useUserCenter()
</script>

<style scoped lang="scss">
.ant-avatar {
    @apply block w-full text-center;
}
</style>
