import { nextTick } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import SoupView from '@/views/SoupView.vue';
import WatchView from '@/views/WatchView.vue';
import PentestView from '@/views/PentestView.vue';
import WriteupView from '@/views/WriteupView.vue';
import SoupArticleList from '@/components/SoupArticleList.vue';
import SoupArticleCreate from '@/components/SoupArticleCreate.vue';
import SoupArticleOpen from '@/components/SoupArticleOpen.vue';
import WatchContentList from '@/components/WatchContentList.vue';
import WatchFeedCreate from '@/components/WatchFeedCreate.vue';
import PentestTaskList from '@/components/PentestTaskList.vue';
import PentestTaskCreate from '@/components/PentestTaskCreate.vue';
import PentestTaskOpen from '@/components/PentestTaskOpen.vue';
import WriteupReportList from '@/components/WriteupReportList.vue';
import WriteupReportCreate from '@/components/WriteupReportCreate.vue';
import WriteupReportOpen from '@/components/WriteupReportOpen.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Hallow',
        },
    },
    {
        path: '/soup',
        name: 'soup',
        component: SoupView,
        children: [
            {
                name: 'SoupArticleList',
                path: '',
                component: SoupArticleList,
                meta: {
                    title: 'Soup - List Articles',
                },
            },
            {
                name: 'SoupArticleCreate',
                path: 'new',
                component: SoupArticleCreate,
                meta: {
                    title: 'Soup - New Article',
                },
            },
            {
                name: 'SoupArticleOpen',
                path: 'art/:slug',
                component: SoupArticleOpen,
                meta: {
                    title: 'Soup - Open Article',
                },
            },
        ],
    },
    {
        path: '/watch',
        name: 'watch',
        component: WatchView,
        children: [
            {
                name: 'WatchContentList',
                path: '',
                component: WatchContentList,
                meta: {
                    title: 'Watch - List Contents',
                },
            },
            {
                name: 'WatchFeedCreate',
                path: 'new',
                component: WatchFeedCreate,
                meta: {
                    title: 'Watch - Create Feed',
                },
            },
        ],
    },
    {
        path: '/pentest',
        name: 'pentest',
        meta: {
            title: 'Pentest',
        },
        component: PentestView,
        children: [
            {
                name: 'PentestTaskList',
                path: '',
                component: PentestTaskList,
                meta: {
                    title: 'Pentest - List Tasks',
                },
            },
            {
                name: 'PentestTaskCreate',
                path: 'new',
                component: PentestTaskCreate,
                meta: {
                    title: 'Pentest - Create Task',
                },
            },
            {
                name: 'PentestTaskOpen',
                path: 'tsk/:id',
                component: PentestTaskOpen,
                meta: {
                    title: 'Pentest - Open Task',
                },
            },
        ],
    },
    {
        path: '/writeup',
        name: 'writeup',
        component: WriteupView,
        children: [
            {
                name: 'WriteupReportList',
                path: '',
                component: WriteupReportList,
                meta: {
                    title: 'Writeup - List Reports',
                },
            },
            {
                name: 'WriteupReportCreate',
                path: 'new',
                component: WriteupReportCreate,
                meta: {
                    title: 'Writeup - New Report',
                },
            },
            {
                name: 'WriteupReportOpen',
                path: 'rpt/:slug',
                component: WriteupReportOpen,
                meta: {
                    title: 'Writeup - Open Report',
                },
            },
        ],
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
    nextTick(() => {
        document.title = to.meta.title || 'Hallow';
    });
});

export default router;
