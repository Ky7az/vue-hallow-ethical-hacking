<template>
    <div v-if="reportDetail">
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/writeup">Back</router-link>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col">
                <b>{{ reportDetail.name }}</b>
            </div>
        </div>
        <div class="row mb-3 justify-content-center">
            <div class="col-2">
                {{ reportDetail.website.name }} - {{ reportDetail.task_type_display }} {{ reportDetail.task_platform_display && ' - ' + reportDetail.task_platform_display || '' }}
            </div>
        </div>
        <div class="row mb-3 justify-content-center">
            <div class="col-2">
                <a :href="reportDetail.task_url" target="new">Link</a>
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
        <MarkdownEditor :markdown="reportDetail.content">
            <textarea :value="reportDetail.content" id="textarea-md-editor" class="form-control" rows="50" wrap="soft" @change="onInputReportUpdate($event.target.value, reportDetail, 'content')"/>
        </MarkdownEditor>
        <div class="row mt-3">
            <div class="col">
                <button type="button" class="btn m-2 btn-danger btn-sm" @click="onClickReportDelete(reportDetail)">Delete</button>
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
    name: 'WriteupReportOpen',
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
        onChangeTags(newTags) {
            this.onInputReportUpdate(newTags, this.reportDetail, 'tags');
        },
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
                data[field] = event.map(tag => ({name: tag.text, slug: slugify(tag.text, {'replacement': '-', 'lower': true})}));
            else
                data[field] = event;
            this.updateReport({report, data});
        }
    }
}
</script>