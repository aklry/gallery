import AccessEnum from '@/permission/accessEnum'
import { type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/user/login',
        name: 'login',
        component: () => import('@/views/user/login/index.vue')
    },
    {
        path: '/user/register',
        name: 'register',
        component: () => import('@/views/user/register/index.vue')
    },
    {
        path: '/user/admin',
        name: 'admin',
        component: () => import('@/views/user/admin/index.vue'),
        meta: {
            access: AccessEnum.ADMIN
        }
    },
    {
        path: '/user/center',
        name: 'user-center',
        component: () => import('@/views/user/center/index.vue')
    },
    {
        path: '/user/message',
        name: 'user-message',
        component: () => import('@/views/user/message/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/not-found/index.vue')
    },
    {
        path: '/no-auth',
        name: 'no-auth',
        component: () => import('@/views/no-auth/index.vue')
    },
    {
        path: '/picture/add',
        name: 'add-picture',
        component: () => import('@/views/picture/add-picture/index.vue')
    },
    {
        path: '/picture/add/batch',
        name: 'add-picture-batch',
        component: () => import('@/views/picture/picture-batch/index.vue')
    },
    {
        path: '/picture/:id',
        name: 'picture-detail',
        component: () => import('@/views/picture/picture-detail/index.vue'),
        props: true
    },
    {
        path: '/picture/admin',
        name: 'admin-picture',
        component: () => import('@/views/picture/admin/index.vue'),
        meta: {
            access: AccessEnum.ADMIN
        }
    },
    {
        path: '/space/admin',
        name: 'admin-space',
        component: () => import('@/views/space/admin/index.vue'),
        meta: {
            access: AccessEnum.ADMIN
        }
    },
    {
        path: '/space/add',
        name: 'add-space',
        component: () => import('@/views/space/add/index.vue')
    },
    {
        path: '/space/user',
        name: 'user-space',
        component: () => import('@/views/space/user/index.vue')
    },
    {
        path: '/space/:id',
        name: 'space-detail',
        component: () => import('@/views/space/detail/index.vue'),
        props: true
    },
    {
        path: '/space/analyze',
        name: 'space-analyze',
        component: () => import('@/views/space/analyze/index.vue')
    }
]
