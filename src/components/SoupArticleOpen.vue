<template>
    <div v-if="articleDetail">
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/soup">Back</router-link>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col">
                <b>{{ articleDetail.name }}</b>
            </div>
        </div>
        <div class="row mb-3 justify-content-center">
            <div class="col-4">
                <vue-tags-input
                    v-model="tag"
                    :tags="selectedTags"
                    placeholder="Tags"
                    @tags-changed="onChangeTags"
                />
            </div>
        </div>
        <MarkdownEditor :markdown="articleDetail.content">
            <textarea :value="articleDetail.content" id="textarea-md-editor" class="form-control" rows="50" wrap="soft" @change="onInputArticleUpdate($event.target.value, articleDetail, 'content')"/>
        </MarkdownEditor>
        <div class="row mt-3">
            <div class="col">
                <button type="button" class="btn m-2 btn-danger btn-sm" @click="onClickArticleDelete(articleDetail)">Delete</button>
            </div>
        </div>
    </div>
</template>

<script>
import Vuex from 'vuex'
import slugify from 'slugify'

import VueTagsInput from '@wslyhbb/vue3-tags-input'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
    name: 'SoupArticleOpen',
    components: {
        VueTagsInput,
        MarkdownEditor
    },
    data() {
        return {
            tag: ""
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
            return this.articleDetail.tags.map(tag => ({text: tag.name}));
        }
    },
    methods: {
        ...Vuex.mapActions('soup', [
            'deleteArticle',
            'updateArticle'
        ]),
        onChangeTags(newTags) {
            this.onInputArticleUpdate(newTags, this.articleDetail, 'tags');
        },
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
                data[field] = event.map(tag => ({name: tag.text, slug: slugify(tag.text, {'replacement': '-', 'lower': true})}));
            else
                data[field] = event;
            this.updateArticle({article, data});
        }
    }
}
</script>