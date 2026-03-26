<template>
    <div class="min-h-screen bg-gray-50 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl w-full">
            <!-- Profile Card -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <!-- Header Banner -->
                <div class="h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <div class="absolute top-4 right-4">
                        <a-button
                            type="primary"
                            shape="round"
                            class="!bg-white/20 !border-white/30 backdrop-blur-md hover:!bg-white/30 !text-white flex items-center"
                            @click="handleEdit"
                        >
                            <template #icon><SettingOutlined /></template>
                            <span class="ml-1">编辑资料</span>
                        </a-button>
                    </div>
                </div>

                <!-- Profile Info -->
                <div class="relative px-6 sm:px-10 pb-8">
                    <!-- Avatar -->
                    <div class="-mt-16 sm:-mt-24 mb-6 flex justify-between items-end">
                        <div class="p-1.5 bg-white rounded-full inline-block">
                            <a-avatar
                                :src="userInfo.userAvatar || '/logo.svg'"
                                :size="120"
                                class="border-4 border-gray-50 shadow-md"
                            />
                        </div>
                    </div>

                    <!-- User Details Header -->
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">
                            {{ userInfo.userName ?? '佚名' }}
                        </h1>
                        <p class="text-gray-500 text-base">
                            {{ userInfo.userProfile ?? '这个人很懒，什么都没留下...' }}
                        </p>
                        <div class="mt-4 flex items-center gap-3">
                            <span
                                class="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
                                :class="
                                    userInfo.userRole === 'admin'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-green-100 text-green-700'
                                "
                            >
                                {{ userInfo.userRole === 'admin' ? '管理员' : '普通用户' }}
                            </span>
                            <span class="text-gray-400 text-sm flex items-center gap-1">
                                <UserOutlined /> {{ userInfo.userAccount }}
                            </span>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="h-px bg-gray-100 w-full mb-8"></div>

                    <!-- Detail Sections -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div class="text-sm font-medium text-gray-500 mb-1">账号信息</div>
                            <div class="text-base text-gray-800 font-semibold">{{ userInfo.userAccount }}</div>
                        </div>
                        <div class="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div class="text-sm font-medium text-gray-500 mb-1">注册角色</div>
                            <div class="text-base text-gray-800 font-semibold">
                                {{ userInfo.userRole === 'admin' ? '管理员' : '普通用户' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <a-modal
            v-model:open="open"
            cancelText="取消"
            okText="确认"
            title="编辑个人信息"
            destroyOnClose
            :width="520"
            @ok="handleOk"
        >
            <div class="pt-4">
                <a-form :model="form" layout="vertical">
                    <a-form-item label="用户头像" class="text-center">
                        <PictureUpload
                            :picture="picture"
                            prefix="avatar"
                            :onUploadAvatarSuccess="handleUploadSuccess"
                        />
                    </a-form-item>
                    <a-form-item label="用户名">
                        <a-input v-model:value="form.userName" size="large" placeholder="请输入用户名" />
                    </a-form-item>
                    <a-form-item label="用户简介">
                        <a-textarea v-model:value="form.userProfile" :rows="4" placeholder="介绍一下你自己..." />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { SettingOutlined, UserOutlined } from '@ant-design/icons-vue'
import useUserCenter from './hooks'
import PictureUpload from '@/components/picture-upload/index.vue'

const { userInfo, open, form, handleOk, handleUploadSuccess, picture, handleEdit } = useUserCenter()
</script>

<style scoped lang="scss">
@use './css/index' as *;
</style>
