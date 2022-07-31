<template>
    <div>
        <b-row>
            <b-col class="mb-4">
                <b-button to="/soup/new">New</b-button>
            </b-col>
        </b-row>
        <SoupArticleSearch @updated-search="onUpdatedSearch"/>
        <b-row cols="1" cols-sm="2" cols-md="3" cols-lg="4" cols-xl="6">
            <b-col v-for="article in articles"
                   v-bind:key="article.id"
                   v-bind:title="article.name"
                   class="mb-4">
                <b-card v-bind:header="article.name"
                        bg-variant="dark"
                        text-variant="white">
                    <b-card-text>
                        <small v-for="tag in article.tags"
                                v-bind:key="tag.id"
                                v-bind:title="tag.name">
                            #{{tag.name}}
                        </small>
                        <router-link :to="`/soup/art/${article.slug}`">
                            <b-icon icon="arrow-up-right-circle" class="orange"></b-icon>
                        </router-link>
                    </b-card-text>
                    <template #footer>
                        <small class="text-muted">Updated <timeago :datetime="article.write_date" :auto-update="60"></timeago></small>
                    </template>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'

import SoupArticleSearch from '@/components/SoupArticleSearch'

export default {
    name: 'SoupArticleList',
    components: {
        SoupArticleSearch
    },
    computed: {
        ...Vuex.mapState('soup', [
            'articles'
        ])
    },
    methods: {
        ...Vuex.mapActions('soup', [
            'loadArticles'
        ]),
        onUpdatedSearch() {
            this.loadArticles();
        }
    }
}
</script>