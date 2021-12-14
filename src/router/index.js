import Vue from 'vue'
import VueRouter from 'vue-router'
import Soup from '@/views/Soup.vue'
import SoupArticleList from '@/components/SoupArticleList.vue'
import SoupArticleCreate from '@/components/SoupArticleCreate.vue'
import SoupArticleOpen from '@/components/SoupArticleOpen.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home'
    },
    {
        path: '/soup',
        name: 'soup',
        component: Soup,
        children: [
            { 
                path: '', 
                component: SoupArticleList
            },
            { 
                path: 'new', 
                component: SoupArticleCreate
            },
            { 
                path: 'art/:slug', 
                component: SoupArticleOpen
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

export default router
