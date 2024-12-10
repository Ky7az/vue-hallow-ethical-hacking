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
                                    :key="option.value"
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

<script>
import Vuex from 'vuex';
import slugify from 'slugify';

import VueTagsInput from '@wslyhbb/vue3-tags-input';
import MarkdownEditor from '@/components/MarkdownEditor';

export default {
    name: 'WriteupReportCreate',
    components: {
        VueTagsInput,
        MarkdownEditor,
    },
    data() {
        return {
            name: null,
            tag: '',
            selected_tags: [],
            website: null,
            optionsTaskTypes: [
                { value: '', text: 'Task Type', disabled: true },
                { value: 'bugbounty', text: 'Bug Bounty' },
                { value: 'ctf', text: 'Capture The Flag' },
            ],
            optionsTaskPlatforms: [
                { value: '', text: 'Task Platform', disabled: true },
                { value: 'linux', text: 'Linux' },
                { value: 'windows', text: 'Windows' },
            ],
            task_type: '',
            task_platform: '',
            task_url: '',
            content: '',
        };
    },
    computed: {
        ...Vuex.mapState('writeup', ['websites']),
        optionsWebsites() {
            var options = this.websites.map((x) => ({
                value: x.id,
                text: x.name,
            }));
            options.unshift({ value: null, text: 'Website', disabled: true });
            return options;
        },
    },
    methods: {
        ...Vuex.mapActions('writeup', ['createReport']),
        onChangeTags(newTags) {
            this.selected_tags = newTags;
        },
        submitForm() {
            let slug = slugify(this.name, { replacement: '-', lower: true });
            let data = {
                name: this.name,
                slug: slug,
                website_id: this.website,
                task_type: this.task_type,
                task_platform: this.task_platform,
                task_url: this.task_url,
                content: this.content,
                tags: this.selected_tags.map((tag) => ({
                    name: tag.text,
                    slug: slugify(tag.text, { replacement: '-', lower: true }),
                })),
            };
            this.createReport(data).then((res) => {
                this.$router.push(`/writeup/rpt/${res.slug}`);
            });
        },
    },
};
</script>
