import { type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/views/about/index.vue')
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
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/not-found/index.vue')
    }
]
