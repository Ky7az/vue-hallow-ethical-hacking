<template>
    <div v-if="reportDetail">
        <b-row class="mb-4">
            <b-col>
                <b-button to="/writeup">Back</b-button>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                <b>{{ reportDetail.name }}</b>
            </b-col>
        </b-row>
        <b-row class="mb-3" align-h="center">
            <b-col cols="2">
                {{ reportDetail.website.name }} - {{ reportDetail.task_type_display }} {{ reportDetail.task_platform_display && ' - ' + reportDetail.task_platform_display || '' }}
            </b-col>
        </b-row>
        <b-row class="mb-3" align-h="center">
            <b-col cols="2">
                <b-link v-bind:href="reportDetail.task_url" target="new">Link</b-link>
            </b-col>
        </b-row>
        <b-row class="mb-3" align-h="center">
            <b-col cols="4">
                <b-form-tags placeholder="Tags" :value="selectedTags" @input="onInputReportUpdate($event, reportDetail, 'tags')" @tag-state="onTagState"></b-form-tags>
            </b-col>
        </b-row>
        <MarkdownEditor v-bind:markdown="reportDetail.content">
            <b-textarea :value="reportDetail.content" @change="onInputReportUpdate($event, reportDetail, 'content')" rows="50" autofocus/>
        </MarkdownEditor>
        <b-row class="mt-3">
            <b-col>
                <b-button variant="danger" size="sm" class="m-2" @click="onClickReportDelete(reportDetail)">Delete</b-button>
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
    name: 'WriteupReportOpen',
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
        ...Vuex.mapGetters('writeup', [
            'getReportBySlug'
        ]),
        reportDetail() {
            return this.getReportBySlug(this.$route.params.slug);
        },
        selectedTags() {
            return this.reportDetail.tags.map(tag => tag.name);
        }
    },
    methods: {
        ...Vuex.mapActions('writeup', [
            'deleteReport',
            'updateReport'
        ]),
        onClickReportDelete(report) {
            var is_ok = confirm("Delete Report ?");
            if (is_ok) {
                this.deleteReport(report).then(() => {
                   this.$router.push('/writeup');
                });
            };
        },
        onInputReportUpdate(event, report, field) {
            let data = {};
            if (field === 'tags')
                data[field] = event.map(tag => ({name: tag, slug: slugify(tag, {'replacement': '-', 'lower': true})}));
            else
                data[field] = event;
            this.updateReport({report, data});
        },
        onTagState(valid, invalid, duplicate) {
            this.valid_tags = valid;
            this.invalid_tags = invalid;
            this.duplicate_tags = duplicate;
        }
    }
}
</script>