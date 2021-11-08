<template>
    <div>
        <b-row>
            <b-col class="mb-4">
                <b-button to="/soup/new">New</b-button>
            </b-col>
        </b-row>
        <SoupArticleSearch v-on:updated-search="onUpdatedSearch"/>
        <b-row cols="6">
            <b-col v-for="article in articles"
                   v-bind:key="article.id"
                   v-bind:title="article.name">
                <b-card v-bind:header="article.name" bg-variant="dark" text-variant="white" class="mb-4">
                    <b-card-text>
                        <small v-for="tag in article.tags" 
                               v-bind:key="tag.id" 
                               v-bind:title="tag.name">
                            #{{tag.name}}
                        </small>
                        <a :href="`/soup/art/${article.slug}`">
                            <b-icon icon="arrow-up-right-circle" class="orange"></b-icon>
                        </a>
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

import axios from 'axios';
import slugify from "slugify";

import {API_HOST, AxiosConfig} from '../storage/service'
import SoupArticleSearch from '@/components/SoupArticleSearch'

export default {
    name: 'SoupArticleList',
    components: {
        SoupArticleSearch
    },
    data() {
        return {
            articles: [],
            search_params: ''
        }
    },
    methods: {
        getArticles() {
            axios.get(`http://${API_HOST}/api/soup/articles/?${this.search_params}`, AxiosConfig)
            .then(res => (this.articles = res.data))
            .catch(err => console.log(err));
        },
        onUpdatedSearch(name_or_content, tags) {
            let params = []
            if (name_or_content)
                params.push('name_or_content=' + name_or_content);
            if (tags.length)
                tags.forEach(tag => params.push('tags=' + slugify(tag, {'replacement': '_', 'lower': true})));
            this.search_params = params.join('&');
            this.getArticles();
        }
    },
    mounted() {
        this.getArticles();
    }
}
</script>
