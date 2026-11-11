<template>
    <div v-if="articleDetail">
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/soup"
                    >Back</router-link
                >
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
            <textarea
                :value="articleDetail.content"
                id="textarea-md-editor"
                class="form-control"
                rows="50"
                wrap="soft"
                @change="
                    onInputArticleUpdate(
                        ($event.target as HTMLTextAreaElement).value,
                        articleDetail!,
                        'content',
                    )
                "
            />
        </MarkdownEditor>
        <div class="row mt-3">
            <div class="col">
                <button
                    type="button"
                    class="btn m-2 btn-danger btn-sm"
                    @click="onClickArticleDelete(articleDetail)"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import slugify from 'slugify';
import VueTagsInput from '@wslyhbb/vue3-tags-input';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { useStore } from '@/store';
import type { Article, TagInputItem } from '@/types';

const store = useStore();
const router = useRouter();
const route = useRoute();

const tag = ref('');

const articleDetail = computed(() =>
    (
        store.getters['soup/getArticleBySlug'] as (
            slug: string,
        ) => Article | undefined
    )(route.params.slug as string),
);

const selectedTags = computed(
    () => articleDetail.value?.tags.map((t) => ({ text: t.name })) ?? [],
);

function onChangeTags(newTags: TagInputItem[]) {
    onInputArticleUpdate(newTags, articleDetail.value!, 'tags');
}

function onClickArticleDelete(article: Article) {
    if (confirm('Delete Article ?')) {
        store.dispatch('soup/deleteArticle', article).then(() => {
            router.push('/soup');
        });
    }
}

function onInputArticleUpdate(event: unknown, article: Article, field: string) {
    const data: Record<string, unknown> = {};
    if (field === 'tags')
        data[field] = (event as TagInputItem[]).map((t) => ({
            name: t.text,
            slug: slugify(t.text, { replacement: '-', lower: true }),
        }));
    else data[field] = event;
    store.dispatch('soup/updateArticle', { article, data });
}
</script>
