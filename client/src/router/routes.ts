import AccessEnum from '@/permission/accessEnum'
import { type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    // 独立页面（无 BasicLayout）
    {
        path: '/user/login',
        name: 'login',
        component: () => import('@/views/user/login/index.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/user/register',
        name: 'register',
        component: () => import('@/views/user/register/index.vue'),
        meta: { title: '注册' }
    },
    // 带 BasicLayout 的页面
    {
        path: '/',
        component: () => import('@/layouts/basic-layout/index.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/views/home/index.vue'),
                meta: { title: '首页' }
            },
            {
                path: 'user/admin',
                name: 'admin',
                component: () => import('@/views/user/admin/index.vue'),
                meta: {
                    access: AccessEnum.ADMIN,
                    title: '用户管理'
                }
            },
            {
                path: 'user/center',
                name: 'user-center',
                component: () => import('@/views/user/center/index.vue'),
                meta: { title: '个人中心' },
                beforeEnter: async (to, _from, next) => {
                    const { useUserStore } = await import('@/store/modules/user')
                    const userStore = useUserStore()
                    const loginUser = userStore.loginUser
                    if (loginUser && loginUser.id) {
                        next()
                    } else {
                        next(`/user/login?redirect=${to.fullPath}`)
                    }
                }
            },
            {
                path: 'user/message',
                name: 'user-message',
                component: () => import('@/views/user/message/index.vue'),
                meta: { title: '消息中心' }
            },
            {
                path: 'no-auth',
                name: 'no-auth',
                component: () => import('@/views/no-auth/index.vue'),
                meta: { title: '无权限' }
            },
            {
                path: 'picture/add',
                name: 'add-picture',
                component: () => import('@/views/picture/add-picture/index.vue'),
                meta: { title: '上传图片' }
            },
            {
                path: 'picture/add/batch',
                name: 'add-picture-batch',
                component: () => import('@/views/picture/picture-batch/index.vue'),
                meta: { title: '批量上传图片' }
            },
            {
                path: 'picture/:id',
                name: 'picture-detail',
                component: () => import('@/views/picture/picture-detail/index.vue'),
                props: true,
                meta: { title: '图片详情' }
            },
            {
                path: 'picture/admin',
                name: 'admin-picture',
                component: () => import('@/views/picture/admin/index.vue'),
                meta: {
                    access: AccessEnum.ADMIN,
                    title: '图片管理'
                }
            },
            {
                path: 'space/admin',
                name: 'admin-space',
                component: () => import('@/views/space/admin/index.vue'),
                meta: {
                    access: AccessEnum.ADMIN,
                    title: '空间管理'
                }
            },
            {
                path: 'space/add',
                name: 'add-space',
                component: () => import('@/views/space/add/index.vue'),
                meta: { title: '创建空间' }
            },
            {
                path: 'space/user',
                name: 'user-space',
                // beforeEnter 始终会重定向，此组件不会实际渲染
                component: { render: () => null },
                beforeEnter: async (_to, _from, next) => {
                    const { useUserStore } = await import('@/store/modules/user')
                    const { spaceControllerListSpaceV1 } = await import('@/api/space')
                    const userStore = useUserStore()
                    const loginUser = userStore.loginUser
                    if (!loginUser || !loginUser.id) {
                        next('/user/login')
                        return
                    }
                    const res = await spaceControllerListSpaceV1({
                        userId: loginUser.id,
                        current: '1',
                        pageSize: '1'
                    })
                    if (res.code === 1 && res.data.list.length > 0) {
                        next(`/space/${res.data.list[0].id}`)
                    } else if (res.code === 1) {
                        next('/space/add')
                    } else {
                        next('/') // 请求失败则重定向到首页
                    }
                }
            },
            {
                path: 'space/:id',
                name: 'space-detail',
                component: () => import('@/views/space/detail/index.vue'),
                props: true,
                meta: { title: '空间详情' }
            },
            {
                path: 'space/analyze',
                name: 'space-analyze',
                component: () => import('@/views/space/analyze/index.vue'),
                meta: { title: '空间分析' }
            },
            {
                path: ':pathMatch(.*)*',
                name: 'not-found',
                component: () => import('@/views/not-found/index.vue'),
                meta: { title: '页面不存在' }
            }
        ]
    }
]
