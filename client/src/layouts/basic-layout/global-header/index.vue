<template>
    <a-row>
        <a-col flex="50px">
            <a href="http://docs.aklry.com" target="_blank">
                <a-image src="http://quiz.aklry.com/logo.png" width="50" :preview="false" alt="源空间" />
            </a>
        </a-col>
        <a-col flex="auto"></a-col>
        <a-col flex="150px">
            <a-button type="primary">登录</a-button>
        </a-col>
    </a-row>
</template>

<script setup></script>

<style lang="scss" scoped>
.ant-row {
    @apply w-full h-full items-center;

    .ant-col {
        &:first-child {
            @apply h-[50px];
        }
    }
}
</style>
