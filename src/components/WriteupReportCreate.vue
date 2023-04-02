<template>
    <div>
        <b-row>
            <b-col class="mb-4">
                <b-button to="/writeup">Back</b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <form id="form-report" @submit.prevent="submitForm">
                    <b-row class="mb-3" align-h="center">
                        <b-col cols="4">
                            <b-form-input id="name" type="text" placeholder="Name" v-model="name" autofocus></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mb-3" align-h="center">
                        <b-col cols="2">
                            <b-form-select id="website" v-model="website" :options="optionsWebsites"></b-form-select>
                        </b-col>
                        <b-col cols="2">
                            <b-form-select id="task_type" v-model="task_type" :options="optionsTaskTypes"></b-form-select>
                        </b-col>
                        <b-col cols="2">
                            <b-form-select id="task_platform" v-model="task_platform" :options="optionsTaskPlatforms"></b-form-select>
                        </b-col>
                    </b-row>
                    <b-row class="mb-3" align-h="center">
                        <b-col cols="4">
                            <b-form-input id="task_url" type="url" placeholder="Task URL" v-model="task_url"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="mb-3" align-h="center">
                        <b-col cols="4">
                            <b-form-tags placeholder="Tags" v-model="selected_tags" @tag-state="onTagState"></b-form-tags>
                        </b-col>
                    </b-row>
                    <MarkdownEditor :markdown="content">
                        <b-textarea id="content" name="content" v-model="content" rows="20" autofocus/>
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
    name: 'WriteupReportCreate',
    components: {
        MarkdownEditor
    },
    data() {
        return {
            name: null,
            selected_tags: [],
            valid_tags: [],
            invalid_tags: [],
            duplicate_tags: [],
            website: null,
            optionsTaskTypes: [
                {value: "", text: 'Task Type', disabled: true},
                {value: 'bugbounty', text: 'Bug Bounty'},
                {value: 'ctf', text: 'Capture The Flag'}
            ],
            optionsTaskPlatforms: [
                {value: "", text: 'Task Platform', disabled: true},
                {value: 'linux', text: 'Linux'},
                {value: 'windows', text: 'Windows'}
            ],
            task_type: "",
            task_platform: "",
            task_url: "",
            content: ""
        }
    },
    computed: {
        ...Vuex.mapState('writeup', [
            'websites'
        ]),
        optionsWebsites() {
            var options = this.websites.map(x => ({value: x.id, text: x.name}));
            options.unshift({value: null, text: 'Website', disabled: true});
            return options;
        },
    },
    methods: {
        ...Vuex.mapActions('writeup', [
            'createReport'
        ]),
        submitForm() {
            let slug = slugify(this.name, {'replacement': '-', 'lower': true});
            let data = {
                name: this.name,
                slug: slug,
                website_id: this.website,
                task_type: this.task_type,
                task_platform: this.task_platform,
                task_url: this.task_url,
                content: this.content,
                tags: this.selected_tags.map(tag => ({name: tag, slug: slugify(tag, {'replacement': '-', 'lower': true})}))
            }
            this.createReport(data).then((res) => {
                this.$router.push(`/writeup/rpt/${res.slug}`);
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