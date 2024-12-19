<template>
    <div class="bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
            <a-card class="shadow-lg rounded-lg">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">注册</h1>
                </div>
                <a-form :model="formState" name="registerForm" autocomplete="off" @finish="onFinish">
                    <a-form-item
                        label="用户账户"
                        name="userAccount"
                        :rules="[{ required: true, message: '请输入用户账户!' }]"
                    >
                        <a-input v-model:value="formState.userAccount" class="rounded-md" />
                    </a-form-item>

                    <a-form-item label="密码" name="userPassword" :rules="[{ required: true, message: '请输入密码!' }]">
                        <a-input-password v-model:value="formState.userPassword" class="rounded-md" />
                    </a-form-item>

                    <a-form-item
                        label="确认密码"
                        name="checkedPassword"
                        :rules="[{ required: true, message: '请确认密码!' }]"
                    >
                        <a-input-password v-model:value="formState.checkedPassword" class="rounded-md" />
                    </a-form-item>

                    <a-form-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                            class="w-full rounded-md bg-blue-600 hover:bg-blue-700 py-2"
                        >
                            注册
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import useRegister from './hooks'

const { formState, onFinish } = useRegister()
</script>

<style scoped></style>
