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

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import slugify from 'slugify';
import VueTagsInput from '@wslyhbb/vue3-tags-input';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { useSoupStore } from '@/stores/soup';
import type { TagInputItem } from '@/types';

const soupStore = useSoupStore();
const router = useRouter();

const name = ref<string | null>(null);
const tag = ref('');
const selected_tags = ref<TagInputItem[]>([]);
const content = ref('');

function onChangeTags(newTags: TagInputItem[]) {
    selected_tags.value = newTags;
}

function submitForm() {
    const slug = slugify(name.value!, { replacement: '-', lower: true });
    const data = {
        name: name.value,
        slug,
        content: content.value,
        tags: selected_tags.value.map((t) => ({
            name: t.text,
            slug: slugify(t.text, { replacement: '-', lower: true }),
        })),
    };
    soupStore.createArticle(data).then((res) => {
        router.push(`/soup/art/${res.slug}`);
    });
}
</script>
