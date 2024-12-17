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
    }
]
