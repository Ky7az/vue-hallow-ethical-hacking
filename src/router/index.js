import Vue from 'vue'
import VueRouter from 'vue-router'
import Soup from '@/views/Soup.vue'
import Pentest from '@/views/Pentest.vue'
import SoupArticleList from '@/components/SoupArticleList.vue'
import SoupArticleCreate from '@/components/SoupArticleCreate.vue'
import SoupArticleOpen from '@/components/SoupArticleOpen.vue'
import PentestTaskList from '@/components/PentestTaskList.vue'
import PentestTaskCreate from '@/components/PentestTaskCreate.vue'
import PentestTaskOpen from '@/components/PentestTaskOpen.vue'

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
                },
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
            },
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
