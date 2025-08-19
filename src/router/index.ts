// router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Root from '@/components/Root.vue'

import LibraryPage from '@/pages/LibraryPage.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Root,
        children: [
            { path: '', redirect: '/library' },
            {
                path: 'library',
                name: 'library',
                component: LibraryPage,               // 👈 niente dynamic import qui
                meta: { titleKey: 'pages.library', chrome: true },
            },
            {
                path: 'stats',
                name: 'stats',
                component: () => import('@/pages/StatsPage.vue'),
                meta: { titleKey: 'pages.stats', chrome: true },
            },
            {
                path: 'tools',
                name: 'tools',
                component: () => import('@/pages/ToolsPage.vue'),
                meta: { titleKey: 'pages.tools', chrome: true },
            },
            {
                path: 'account',
                name: 'account',
                component: () => import('@/pages/AccountPage.vue'),
                meta: { titleKey: 'pages.account', chrome: true },
            },
            {
                path: ':pathMatch(.*)*',
                name: 'notfound',
                component: () => import('@/pages/NotFoundPage.vue'),
                meta: { titleKey: 'pages.notFound', chrome: false },
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 }, // ripristina scroll velocemente
})

export default router
