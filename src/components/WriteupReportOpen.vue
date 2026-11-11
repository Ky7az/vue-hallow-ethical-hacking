<template>
    <div v-if="reportDetail">
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/writeup"
                    >Back</router-link
                >
            </div>
        </div>
        <div class="row mb-3">
            <div class="col">
                <b>{{ reportDetail.name }}</b>
            </div>
        </div>
        <div class="row mb-3 justify-content-center">
            <div class="col-2">
                {{ reportDetail.website && reportDetail.website.name }} -
                {{ reportDetail.task_type_display }}
                {{
                    (reportDetail.task_platform_display &&
                        ' - ' + reportDetail.task_platform_display) ||
                    ''
                }}
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
            <textarea
                :value="reportDetail.content"
                id="textarea-md-editor"
                class="form-control"
                rows="50"
                wrap="soft"
                @change="
                    onInputReportUpdate(
                        ($event.target as HTMLTextAreaElement).value,
                        reportDetail!,
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
                    @click="onClickReportDelete(reportDetail)"
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
import type { Report, TagInputItem } from '@/types';

const store = useStore();
const router = useRouter();
const route = useRoute();

const tag = ref('');

const reportDetail = computed(() =>
    (
        store.getters['writeup/getReportBySlug'] as (
            slug: string,
        ) => Report | undefined
    )(route.params.slug as string),
);

const selectedTags = computed(
    () => reportDetail.value?.tags.map((t) => t.name) ?? [],
);

function onChangeTags(newTags: TagInputItem[]) {
    onInputReportUpdate(newTags, reportDetail.value!, 'tags');
}

function onClickReportDelete(report: Report) {
    if (confirm('Delete Report ?')) {
        store.dispatch('writeup/deleteReport', report).then(() => {
            router.push('/writeup');
        });
    }
}

function onInputReportUpdate(event: unknown, report: Report, field: string) {
    const data: Record<string, unknown> = {};
    if (field === 'tags')
        data[field] = (event as TagInputItem[]).map((t) => ({
            name: t.text,
            slug: slugify(t.text, { replacement: '-', lower: true }),
        }));
    else data[field] = event;
    store.dispatch('writeup/updateReport', { report, data });
}
</script>
