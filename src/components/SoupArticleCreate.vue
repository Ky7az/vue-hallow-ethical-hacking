<template>
    <div>
        <b-row>
            <b-col class="mb-4">
                <b-button to="/soup">Back</b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <form id="form-article" @submit.prevent="submitForm">
                    <b-row class="mb-3" align-h="center">
                        <b-col cols="4">
                            <b-form-input id="name" type="text" placeholder="Name" v-model="name" autofocus></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mb-3" align-h="center">
                        <b-col cols="4">
                            <b-form-tags placeholder="Tags" v-model="selected_tags" @tag-state="onTagState"></b-form-tags>
                        </b-col>
                    </b-row>
                    <MarkdownEditor v-bind:markdown="content">
                        <b-textarea id="content" name="content" v-model="content" rows="20" class="text-center"/>
                    </MarkdownEditor>
                    <b-row class="mt-3">
                        <b-col>
                            <input class="btn-sm btn-primary" type="submit" value="Create"/>
                        </b-col>
                    </b-row>
                </form>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'
import slugify from 'slugify';

import MarkdownEditor from '@/components/MarkdownEditor';

export default {
    name: 'SoupArticleCreate',
    components: {
        MarkdownEditor
    },
    data() {
        return {
            name: null,
            content: "",
            selected_tags: [],
            valid_tags: [],
            invalid_tags: [],
            duplicate_tags: []
        }
    },
    methods: {
        ...Vuex.mapActions('soup', [
            'createArticle'
        ]),
        submitForm() {
            let slug = slugify(this.name, {'replacement': '-', 'lower': true});
            let data = {
                name: this.name,
                slug: slug,
                content: this.content,
                tags: this.selected_tags.map(tag => ({name: tag, slug: slugify(tag, {'replacement': '-', 'lower': true})}))
            }
            this.createArticle(data).then((res) => {
                this.$router.push(`/soup/art/${res.slug}`);
            });
        },
        onTagState(valid, invalid, duplicate) {
            this.valid_tags = valid;
            this.invalid_tags = invalid;
            this.duplicate_tags = duplicate;
        }
    }
}
</script>