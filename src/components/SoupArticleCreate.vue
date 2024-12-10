<template>
    <div>
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/soup"
                    >Back</router-link
                >
            </div>
        </div>
        <div class="row">
            <div class="col">
                <form id="form-article" @submit.prevent="submitForm">
                    <div class="row mb-3 justify-content-center">
                        <div class="col-4">
                            <input
                                class="form-control form-control-sm"
                                type="text"
                                placeholder="Name"
                                v-model="name"
                            />
                        </div>
                    </div>
                    <div class="row mb-3 justify-content-center">
                        <div class="col-4">
                            <vue-tags-input
                                v-model="tag"
                                :tags="selected_tags"
                                placeholder="Tags"
                                @tags-changed="onChangeTags"
                            />
                        </div>
                    </div>
                    <MarkdownEditor :markdown="content">
                        <textarea
                            id="textarea-md-editor"
                            class="form-control"
                            rows="20"
                            wrap="soft"
                            v-model="content"
                        />
                    </MarkdownEditor>
                    <div class="row mt-3">
                        <div class="col">
                            <input
                                class="btn btn-primary btn-sm"
                                type="submit"
                                value="Create"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Vuex from 'vuex';
import slugify from 'slugify';

import VueTagsInput from '@wslyhbb/vue3-tags-input';
import MarkdownEditor from '@/components/MarkdownEditor';

export default {
    name: 'SoupArticleCreate',
    components: {
        VueTagsInput,
        MarkdownEditor,
    },
    data() {
        return {
            name: null,
            tag: '',
            selected_tags: [],
            content: '',
        };
    },
    methods: {
        ...Vuex.mapActions('soup', ['createArticle']),
        onChangeTags(newTags) {
            this.selected_tags = newTags;
        },
        submitForm() {
            let slug = slugify(this.name, { replacement: '-', lower: true });
            let data = {
                name: this.name,
                slug: slug,
                content: this.content,
                tags: this.selected_tags.map((tag) => ({
                    name: tag.text,
                    slug: slugify(tag.text, { replacement: '-', lower: true }),
                })),
            };
            this.createArticle(data).then((res) => {
                this.$router.push(`/soup/art/${res.slug}`);
            });
        },
    },
};
</script>
