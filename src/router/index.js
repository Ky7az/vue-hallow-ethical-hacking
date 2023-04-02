import Vue from 'vue'
import VueRouter from 'vue-router'
import Soup from '@/views/Soup.vue'
import Watch from '@/views/Watch.vue'
import Pentest from '@/views/Pentest.vue'
import Writeup from '@/views/Writeup.vue'
import SoupArticleList from '@/components/SoupArticleList.vue'
import SoupArticleCreate from '@/components/SoupArticleCreate.vue'
import SoupArticleOpen from '@/components/SoupArticleOpen.vue'
import WatchContentList from '@/components/WatchContentList.vue'
import WatchFeedCreate from '@/components/WatchFeedCreate.vue'
import PentestTaskList from '@/components/PentestTaskList.vue'
import PentestTaskCreate from '@/components/PentestTaskCreate.vue'
import PentestTaskOpen from '@/components/PentestTaskOpen.vue'
import WriteupReportList from '@/components/WriteupReportList.vue'
import WriteupReportCreate from '@/components/WriteupReportCreate.vue'
import WriteupReportOpen from '@/components/WriteupReportOpen.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            title: 'Hallow'
        }
    },
    {
        path: '/soup',
        name: 'soup',
        component: Soup,
        children: [
            { 
                path: '', 
                component: SoupArticleList,
                meta: {
                    title: 'Soup - List Articles'
                }
            },
            { 
                path: 'new', 
                component: SoupArticleCreate,
                meta: {
                    title: 'Soup - New Article'
                }
            },
            { 
                path: 'art/:slug', 
                component: SoupArticleOpen,
                meta: {
                    title: 'Soup - Open Article'
                }
            }
        ]
    },
    {
        path: '/watch',
        name: 'watch',
        component: Watch,
        children: [
            { 
                path: '', 
                component: WatchContentList,
                meta: {
                    title: 'Watch - List Contents'
                }
            },
            { 
                path: 'new', 
                component: WatchFeedCreate,
                meta: {
                    title: 'Watch - Create Feed'
                }
            }
        ]
    },
    {
        path: '/pentest',
        name: 'pentest',
        meta: {
            title: 'Pentest'
        },
        component: Pentest,
        children: [
            { 
                path: '', 
                component: PentestTaskList,
                meta: {
                    title: 'Pentest - List Tasks'
                }
            },
            { 
                path: 'new', 
                component: PentestTaskCreate,
                meta: {
                    title: 'Pentest - Create Task'
                }
            },
            { 
                path: 'tsk/:id', 
                component: PentestTaskOpen,
                meta: {
                    title: 'Pentest - Open Task'
                }
            }
        ]
    },
    {
        path: '/writeup',
        name: 'writeup',
        component: Writeup,
        children: [
            { 
                path: '', 
                component: WriteupReportList,
                meta: {
                    title: 'Writeup - List Reports'
                }
            },
            { 
                path: 'new', 
                component: WriteupReportCreate,
                meta: {
                    title: 'Writeup - New Report'
                }
            },
            { 
                path: 'rpt/:slug', 
                component: WriteupReportOpen,
                meta: {
                    title: 'Writeup - Open Report'
                }
            }
        ]
    },
    {
        path: '*',
        redirect: '/'
    }

]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.afterEach((to, from) => {
    Vue.nextTick(() => {
        document.title = to.meta.title || 'Hallow';
    });
});

export default router
