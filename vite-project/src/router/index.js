import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Index',
        meta: {
            title: '首页',
            keepAlive: true,
            requireAuth: true
        },
        component: () => import('@/pages/index.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
            keepAlive: true,
            requireAuth: false
        },
        component: () => import('@/pages/login.vue')
    },
    {
        path: '/usevue',
        name: 'usevue',
        meta: {
            title: 'usevue',
            keepAlive: true,
            requireAuth: false
        },
        component: () => import('@/pages/vueUse.vue')
    },
    {
        path: "/:pathMatch(.*)",
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router; 
