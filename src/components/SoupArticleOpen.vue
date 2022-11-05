<template>
    <div v-if="articleDetail">
        <b-row class="mb-4">
            <b-col>
                <b-button to="/soup">Back</b-button>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                <b>{{articleDetail.name}}</b>
            </b-col>
        </b-row>
        <b-row class="mb-3" align-h="center">
            <b-col cols="4">
                <b-form-tags placeholder="Tags" :value="selectedTags" @input="onInputArticleUpdate($event, articleDetail, 'tags')" @tag-state="onTagState"></b-form-tags>
            </b-col>
        </b-row>
        <MarkdownEditor v-bind:markdown="articleDetail.content">
            <b-textarea :value="articleDetail.content" @change="onInputArticleUpdate($event, articleDetail, 'content')" rows="50"/>
        </MarkdownEditor>
        <b-row class="mt-3">
            <b-col>
                <b-button variant="danger" size="sm" class="m-2" @click="onClickArticleDelete(articleDetail)">Delete</b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'
import _ from 'lodash'
import slugify from 'slugify';

import MarkdownEditor from '@/components/MarkdownEditor';

export default {
    name: 'SoupArticleOpen',
    components: {
        MarkdownEditor
    },
    data() {
        return {
            valid_tags: [],
            invalid_tags: [],
            duplicate_tags: []
        }
    },
    computed: {
        ...Vuex.mapGetters('soup', [
            'getArticleBySlug'
        ]),
        articleDetail() {
            return this.getArticleBySlug(this.$route.params.slug);
        },
        selectedTags() {
            return this.articleDetail.tags.map(tag => tag.name);
        }
    },
    methods: {
        ...Vuex.mapActions('soup', [
            'deleteArticle',
            'updateArticle'
        ]),
        onClickArticleDelete(article) {
            var is_ok = confirm("Delete Article ?");
            if (is_ok) {
                this.deleteArticle(article).then(() => {
                   this.$router.push('/soup');
                });
            };
        },
        onInputArticleUpdate(event, article, field) {
            let data = {};
            if (field === 'tags')
                data[field] = event.map(tag => ({name: tag, slug: slugify(tag, {'replacement': '-', 'lower': true})}));
            else
                data[field] = event;
            this.updateArticle({article, data});
        },
        onTagState(valid, invalid, duplicate) {
            this.valid_tags = valid;
            this.invalid_tags = invalid;
            this.duplicate_tags = duplicate;
        }
    }
}
</script>