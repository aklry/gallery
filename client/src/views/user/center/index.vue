<template>
    <div class="relative h-full min-h-0 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div class="absolute -left-16 top-10 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl"></div>
            <div class="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"></div>
            <div class="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-100/60 blur-3xl"></div>
        </div>

        <div class="relative mx-auto max-w-[1600px]">
            <div class="flex flex-col gap-6 xl:grid xl:grid-cols-[360px,minmax(0,1fr)] xl:items-start">
                <aside class="sticky top-6 flex flex-col gap-6">
                    <section
                        class="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_24px_80px_-36px_rgba(14,116,144,0.35)] backdrop-blur-xl"
                    >
                        <div class="relative overflow-hidden px-6 py-6 sm:px-7">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-sky-600 via-cyan-500 to-emerald-400"
                            ></div>
                            <div class="absolute -right-10 top-0 h-56 w-56 rounded-full bg-white/20 blur-3xl"></div>
                            <div class="absolute left-1/3 top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl"></div>

                            <div class="relative">
                                <div class="flex items-start justify-between gap-3">
                                    <span
                                        class="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/85"
                                    >
                                        Personal Hub
                                    </span>
                                    <span
                                        class="rounded-full px-3 py-1 text-xs font-semibold text-white"
                                        :class="isAdmin ? 'bg-slate-950/20' : 'bg-white/15'"
                                    >
                                        {{ isAdmin ? '管理员' : '普通用户' }}
                                    </span>
                                </div>

                                <div class="mt-6 flex flex-col items-start gap-4">
                                    <div
                                        class="rounded-[28px] border border-white/30 bg-white/15 p-2 shadow-2xl backdrop-blur-md"
                                    >
                                        <a-avatar
                                            :src="userInfo.userAvatar || '/logo.svg'"
                                            :size="96"
                                            class="border-4 border-white/70 shadow-lg"
                                        />
                                    </div>
                                    <div class="text-white">
                                        <h1 class="text-3xl font-semibold tracking-tight">
                                            {{ userInfo.userName || '佚名创作者' }}
                                        </h1>
                                        <p class="mt-3 text-sm leading-7 text-white/85">
                                            {{
                                                userInfo.userProfile ||
                                                '在这里管理资料、整理点赞与收藏，让高频浏览内容沉淀成你自己的灵感库。'
                                            }}
                                        </p>
                                    </div>
                                </div>

                                <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/80">
                                    <span
                                        class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5"
                                    >
                                        <UserOutlined />
                                        @{{ userInfo.userAccount || 'unknown' }}
                                    </span>
                                    <span
                                        class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5"
                                    >
                                        {{ currentTabTitle }} {{ currentTabState.total }}
                                    </span>
                                </div>

                                <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                    <a-button
                                        shape="round"
                                        class="!h-11 !rounded-full !border-white/30 !bg-white/15 !px-5 !text-white shadow-lg backdrop-blur-md hover:!border-white/50 hover:!bg-white/25"
                                        @click="handleEdit"
                                    >
                                        <template #icon><SettingOutlined /></template>
                                        编辑资料
                                    </a-button>
                                    <a-button
                                        shape="round"
                                        class="!h-11 !rounded-full !border-white/30 !bg-slate-950/20 !px-5 !text-white shadow-lg backdrop-blur-md hover:!border-white/50 hover:!bg-slate-950/35"
                                        @click="handleGoUpload"
                                    >
                                        <template #icon><UploadOutlined /></template>
                                        上传作品
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <a-popconfirm
                        title="确定要退出登录吗？"
                        ok-text="退出"
                        cancel-text="取消"
                        ok-type="danger"
                        @confirm="handleLogout"
                    >
                        <a-button
                            danger
                            shape="round"
                            class="!mt-2 !h-12 !w-full !rounded-full !border-rose-200 !bg-white/90 !text-base !text-rose-500 shadow-sm backdrop-blur-md hover:!border-rose-300 hover:!bg-rose-50"
                        >
                            <template #icon><LogoutOutlined /></template>
                            退出登录
                        </a-button>
                    </a-popconfirm>
                </aside>

                <section
                    class="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8"
                >
                    <div
                        class="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between"
                    >
                        <div>
                            <div class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                                Curated Library
                            </div>
                            <h2 class="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                                {{ currentTabTitle }}
                            </h2>
                            <p class="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                                {{ currentTabDescription }}
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-3">
                            <button
                                type="button"
                                class="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all"
                                :class="
                                    activeTab === 'likes'
                                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                "
                                @click="handleTabChange('likes')"
                            >
                                <HeartFilled />
                                我的点赞
                                <span
                                    class="rounded-full px-2 py-0.5 text-xs"
                                    :class="
                                        activeTab === 'likes' ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                                    "
                                >
                                    {{ actionStats.likeCount }}
                                </span>
                            </button>
                            <button
                                type="button"
                                class="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all"
                                :class="
                                    activeTab === 'collections'
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                "
                                @click="handleTabChange('collections')"
                            >
                                <StarFilled />
                                我的收藏
                                <span
                                    class="rounded-full px-2 py-0.5 text-xs"
                                    :class="
                                        activeTab === 'collections'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white text-slate-500'
                                    "
                                >
                                    {{ actionStats.collectionCount }}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div class="mt-6">
                        <div
                            v-if="currentTabState.loading"
                            class="flex min-h-[420px] flex-1 items-center justify-center"
                        >
                            <a-spin size="large" />
                        </div>

                        <div
                            v-else-if="currentTabState.list.length === 0"
                            class="flex min-h-[420px] flex-1 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center"
                        >
                            <a-empty
                                :description="activeTab === 'likes' ? '你还没有点赞过作品' : '你还没有收藏过作品'"
                            />
                            <div class="mt-6 flex flex-wrap justify-center gap-3">
                                <a-button
                                    shape="round"
                                    class="!h-11 !rounded-full !border-slate-200 !px-5 !text-slate-600 hover:!border-slate-300 hover:!text-slate-900"
                                    @click="handleRefreshCurrentTab"
                                >
                                    刷新当前列表
                                </a-button>
                                <a-button
                                    type="primary"
                                    shape="round"
                                    class="!h-11 !rounded-full !border-transparent !bg-slate-900 !px-5 hover:!bg-slate-800"
                                    @click="handleGoUpload"
                                >
                                    上传新的作品
                                </a-button>
                            </div>
                        </div>

                        <div v-else class="flex flex-col">
                            <div class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                                <article
                                    v-for="item in currentTabState.list"
                                    :key="item.id"
                                    class="group flex flex-col cursor-pointer overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-28px_rgba(15,23,42,0.35)]"
                                    @click="handleViewPicture(item.id)"
                                >
                                    <div class="relative aspect-[16/10] overflow-hidden rounded-t-[28px] bg-slate-100">
                                        <img
                                            :src="item.thumbnailUrl || item.url"
                                            :alt="item.filename"
                                            class="h-full w-full rounded-t-[28px] object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        <div
                                            class="absolute inset-0 rounded-t-[28px] bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent"
                                        ></div>

                                        <div class="absolute inset-x-3 top-3 flex items-start justify-end gap-3">
                                            <span
                                                class="rounded-full px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
                                                :class="activeTab === 'likes' ? 'bg-rose-500/85' : 'bg-amber-500/85'"
                                            >
                                                {{ activeTab === 'likes' ? '已点赞' : '已收藏' }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="flex flex-1 flex-col p-4">
                                        <div class="flex items-start justify-between gap-3">
                                            <h3 class="text-[15px] font-semibold leading-6 text-slate-900">
                                                {{ item.filename || '未命名作品' }}
                                            </h3>
                                        </div>
                                        <p
                                            class="mt-1.5 min-h-[40px] overflow-hidden text-sm leading-5 text-slate-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
                                        >
                                            {{ item.introduction || '这张作品暂时还没有填写描述。' }}
                                        </p>

                                        <div class="mt-3 flex flex-wrap gap-1.5">
                                            <span
                                                v-for="tag in item.tags?.slice(0, 3) ?? []"
                                                :key="tag"
                                                class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500"
                                            >
                                                #{{ tag }}
                                            </span>
                                            <span
                                                v-if="!item.tags || item.tags.length === 0"
                                                class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-400"
                                            >
                                                暂无标签
                                            </span>
                                        </div>

                                        <div class="mt-4 grid grid-cols-3 gap-2 rounded-[22px] bg-slate-50 p-2.5">
                                            <div class="rounded-2xl bg-white px-2 py-2 text-center shadow-sm">
                                                <div class="text-xs text-slate-400">浏览</div>
                                                <div class="mt-1 text-sm font-semibold text-slate-900">
                                                    {{ item.viewNumber ?? 0 }}
                                                </div>
                                            </div>
                                            <div class="rounded-2xl bg-white px-2 py-2 text-center shadow-sm">
                                                <div class="text-xs text-slate-400">点赞</div>
                                                <div class="mt-1 text-sm font-semibold text-slate-900">
                                                    {{ item.likeNumber ?? 0 }}
                                                </div>
                                            </div>
                                            <div class="rounded-2xl bg-white px-2 py-2 text-center shadow-sm">
                                                <div class="text-xs text-slate-400">收藏</div>
                                                <div class="mt-1 text-sm font-semibold text-slate-900">
                                                    {{ item.collectionNumber ?? 0 }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-4 flex gap-2.5">
                                            <a-button
                                                shape="round"
                                                class="!h-10 !flex-1 !rounded-full !border-slate-200 !px-3 !text-slate-700 hover:!border-slate-300 hover:!text-slate-900"
                                                @click.stop="handleViewPicture(item.id)"
                                            >
                                                <template #icon><EyeOutlined /></template>
                                                查看详情
                                            </a-button>
                                            <a-button
                                                shape="round"
                                                class="!h-10 !flex-1 !rounded-full !border-transparent !px-3 !text-white"
                                                :class="
                                                    activeTab === 'likes'
                                                        ? '!bg-rose-500 hover:!bg-rose-400'
                                                        : '!bg-amber-500 hover:!bg-amber-400'
                                                "
                                                @click.stop="handleRemoveAction(item.id)"
                                            >
                                                {{ activeTab === 'likes' ? '取消点赞' : '取消收藏' }}
                                            </a-button>
                                        </div>
                                    </div>
                                </article>
                            </div>

                            <div class="mt-8 flex justify-center pb-4 pt-5">
                                <a-pagination
                                    :current="Number(currentTabState.current)"
                                    :page-size="Number(currentTabState.pageSize)"
                                    :total="currentTabState.total"
                                    :show-size-changer="false"
                                    show-less-items
                                    @change="handlePageChange"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

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
import {
    EyeOutlined,
    HeartFilled,
    LogoutOutlined,
    SettingOutlined,
    StarFilled,
    UploadOutlined,
    UserOutlined
} from '@ant-design/icons-vue'
import useUserCenter from './hooks'
import PictureUpload from '@/components/picture-upload/index.vue'

const {
    userInfo,
    isAdmin,
    open,
    form,
    picture,
    activeTab,
    actionStats,
    currentTabState,
    currentTabTitle,
    currentTabDescription,
    handleOk,
    handleUploadSuccess,
    handleEdit,
    handleLogout,
    handleGoUpload,
    handleTabChange,
    handlePageChange,
    handleViewPicture,
    handleRemoveAction,
    handleRefreshCurrentTab
} = useUserCenter()
</script>
