<template>
    <div>
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/writeup/new"
                    >New</router-link
                >
            </div>
        </div>
        <WriteupReportSearch @updated-search="onUpdatedSearch" />
        <div
            class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6"
        >
            <div
                class="col mb-4"
                v-for="reportDetail in reports"
                :key="reportDetail.id"
                :title="reportDetail.name"
            >
                <div class="card text-white">
                    <div class="card-header">
                        <div
                            class="orange card-overflow"
                            @click="onClickReportCard(reportDetail)"
                        >
                            {{ reportDetail.name }}
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-subtitle text-muted mb-2">
                            {{
                                reportDetail.website &&
                                reportDetail.website.name
                            }}
                            -
                            {{ reportDetail.task_type_display }}
                        </h6>
                        <p class="card-text">
                            <small
                                v-for="tagDetail in reportDetail.tags"
                                :key="tagDetail.id"
                                :title="tagDetail.name"
                            >
                                #{{ tagDetail.name }}
                            </small>
                            <small v-if="reportDetail.tags.length === 0"
                                >#No Tags</small
                            >
                        </p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted"
                            >Updated
                            <timeago
                                :datetime="reportDetail.write_date"
                                :auto-update="60"
                            ></timeago
                        ></small>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <VueginateBootstrap
                    :total-items="report_count"
                    :current-page="selected_page"
                    :items-per-page="report_per_page"
                    :custom-styles="{ container: ['justify-content-end'] }"
                    @page-change="selectPage"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { VueginateBootstrap } from 'vueginate';
import WriteupReportSearch from '@/components/WriteupReportSearch.vue';
import { useStore } from '@/store';
import type { Report } from '@/types';

const store = useStore();
const router = useRouter();
const report_per_page = 18;
let abort_controller: AbortController | null = null;

const reports = computed(() => store.state.writeup.reports);
const report_count = computed(() => store.state.writeup.report_count);
const selected_page = computed(() => store.state.writeup.selected_page);

function onUpdatedSearch() {
    abortSearch();
    abort_controller = new AbortController();
    store.dispatch('writeup/updateSelectedPage', 1);
    store
        .dispatch('writeup/loadReports', abort_controller.signal)
        .then(() => {
            abort_controller = null;
        })
        .catch(() => {});
}

function onClickReportCard(reportDetail: Report) {
    router.push(`/writeup/rpt/${reportDetail.slug}`);
}

function selectPage(pageNum: number) {
    store.dispatch('writeup/updateSelectedPage', pageNum);
    store.dispatch('writeup/loadReports');
}

function abortSearch() {
    if (abort_controller) abort_controller.abort();
}
</script>
