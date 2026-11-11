<template>
    <div>
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/writeup"
                    >Back</router-link
                >
            </div>
        </div>
        <div class="row">
            <div class="col">
                <form id="form-report" @submit.prevent="submitForm">
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
                        <div class="col-2">
                            <select
                                class="form-select form-select-sm"
                                v-model="website"
                            >
                                <option
                                    v-for="option in optionsWebsites"
                                    :value="option.value"
                                    :key="option.value ?? ''"
                                >
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-2">
                            <select
                                class="form-select form-select-sm"
                                v-model="task_type"
                            >
                                <option
                                    v-for="option in optionsTaskTypes"
                                    :value="option.value"
                                    :key="option.value"
                                >
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-2">
                            <select
                                class="form-select form-select-sm"
                                v-model="task_platform"
                            >
                                <option
                                    v-for="option in optionsTaskPlatforms"
                                    :value="option.value"
                                    :key="option.value"
                                >
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3 justify-content-center">
                        <div class="col-4">
                            <input
                                class="form-control form-control-sm"
                                type="url"
                                placeholder="Task URL"
                                v-model="task_url"
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import slugify from 'slugify';
import VueTagsInput from '@wslyhbb/vue3-tags-input';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { useStore } from '@/store';
import type { TagInputItem, Report } from '@/types';

const store = useStore();
const router = useRouter();

const name = ref<string | null>(null);
const tag = ref('');
const selected_tags = ref<TagInputItem[]>([]);
const website = ref<number | null>(null);
const task_type = ref('');
const task_platform = ref('');
const task_url = ref('');
const content = ref('');

const optionsTaskTypes = [
    { value: '', text: 'Task Type', disabled: true },
    { value: 'bugbounty', text: 'Bug Bounty' },
    { value: 'ctf', text: 'Capture The Flag' },
];
const optionsTaskPlatforms = [
    { value: '', text: 'Task Platform', disabled: true },
    { value: 'linux', text: 'Linux' },
    { value: 'windows', text: 'Windows' },
];

const websites = computed(() => store.state.writeup.websites);

const optionsWebsites = computed(() => {
    const options: {
        value: number | null;
        text: string;
        disabled?: boolean;
    }[] = websites.value.map((x) => ({ value: x.id, text: x.name }));
    options.unshift({ value: null, text: 'Website', disabled: true });
    return options;
});

function onChangeTags(newTags: TagInputItem[]) {
    selected_tags.value = newTags;
}

function submitForm() {
    const slug = slugify(name.value!, { replacement: '-', lower: true });
    const data = {
        name: name.value,
        slug,
        website_id: website.value,
        task_type: task_type.value,
        task_platform: task_platform.value,
        task_url: task_url.value,
        content: content.value,
        tags: selected_tags.value.map((t) => ({
            name: t.text,
            slug: slugify(t.text, { replacement: '-', lower: true }),
        })),
    };
    store.dispatch('writeup/createReport', data).then((res: Report) => {
        router.push(`/writeup/rpt/${res.slug}`);
    });
}
</script>
