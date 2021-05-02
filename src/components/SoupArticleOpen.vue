<template>
    <div>
        <b-row class="mb-4">
            <b-col>
                <b-button to="/soup">Back</b-button>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                <b>{{articledetail.name}}</b>
            </b-col>
        </b-row>
        <b-row class="mb-3" align-h="center">
            <b-col cols="4">
                <b-form-tags placeholder="Tags" v-model="selected_tags" @input="articleUpdate(articledetail)" @tag-state="onTagState"></b-form-tags>
            </b-col>
        </b-row>
        <MarkdownEditor v-bind:markdown="articledetail.content">
            <b-textarea v-model="articledetail.content" @input="articleUpdate(articledetail)" rows="20"/>
        </MarkdownEditor>
        <b-row class="mt-3">
            <b-col>
                <button class="btn-sm btn-danger m-2" v-on:click="articleDelete(articledetail)">Delete</button>
            </b-col>
        </b-row>
    </div>
</template>

<script>

import axios from 'axios';
import slugify from 'slugify';

import {AxiosConfig} from '../storage/service'
import MarkdownEditor from '@/components/MarkdownEditor';

export default {
    name: 'SoupArticleOpen',
    components: {
        MarkdownEditor
    },
    data() {
        return {
            articledetail: {},
            selected_tags: [],
            valid_tags: [],
            invalid_tags: [],
            duplicate_tags: []
        }
    },
    methods: {
        getArticle() {
            axios.get(`http://127.0.0.1:8000/api/soup/articles/${this.$route.params.slug}/`, AxiosConfig)
            .then(res => {
                this.articledetail = res.data;
                this.selected_tags = this.articledetail.tags.map(tag => tag.name);
            })
            .catch(err => console.log(err));
        },
        articleDelete(articledetail) {
            var is_ok = confirm("Delete Article ?");
            if (is_ok) {
                axios.delete(`http://127.0.0.1:8000/api/soup/articles/${articledetail.slug}/`, AxiosConfig)
                .then(this.$router.push('/soup'))
                .catch(err => console.log(err));
            };
        },
        articleUpdate(articledetail) {
            axios.put(`http://127.0.0.1:8000/api/soup/articles/${articledetail.slug}/`, {
                name: articledetail.name,
                slug: articledetail.slug,
                content: articledetail.content,
                tags: this.selected_tags.map(tag => ({name: tag, slug: slugify(tag, {'replacement': '_', 'lower': true})})),
            }, AxiosConfig)
            .then()
            .catch(err => console.log(err))
        },
        onTagState(valid, invalid, duplicate) {
            this.valid_tags = valid;
            this.invalid_tags = invalid;
            this.duplicate_tags = duplicate;
        }
    },
    mounted() {
        this.getArticle();
    }
}
</script>
