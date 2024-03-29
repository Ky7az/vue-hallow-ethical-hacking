<template>
    <div>
        <b-row class="mb-4">
            <b-col>
                <b-button to="/writeup/new">New</b-button>
            </b-col>
        </b-row>
        <WriteupReportSearch @updated-search="onUpdatedSearch"/>
        <b-row cols="1" cols-sm="2" cols-md="3" cols-lg="4" cols-xl="6">
            <b-col v-for="reportDetail in reports"
                   :key="reportDetail.id"
                   :title="reportDetail.name"
                   class="mb-4">
                <b-card :sub-title="reportDetail.website.name + ' - ' + reportDetail.task_type_display"
                        bg-variant="dark"
                        text-variant="white">
                    <template #header>
                        <div class="orange card-overflow" @click="onClickReportCard(reportDetail)">
                            {{reportDetail.name}}
                        </div>
                    </template>
                    <b-card-text class="card-overflow">
                        <small v-for="tagDetail in reportDetail.tags"
                               :key="tagDetail.id"
                               :title="tagDetail.name">
                            #{{tagDetail.name}}
                        </small>
                        <small v-if="reportDetail.tags.length === 0">#No Tags</small>
                    </b-card-text>
                    <template #footer>
                        <small class="text-muted">Updated <timeago :datetime="reportDetail.write_date" :auto-update="60"></timeago></small>
                    </template>
                </b-card>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-pagination
                    :value="selected_page"
                    :total-rows="report_count"
                    :per-page="report_per_page"
                    align="right"
                    @change="selectPage"
                ></b-pagination>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'

import WriteupReportSearch from '@/components/WriteupReportSearch'

export default {
    name: 'WriteupReportList',
    components: {
        WriteupReportSearch
    },
    data() {
        return {
            report_per_page: 18,
            abort_controller: null
        }
    },
    computed: {
        ...Vuex.mapState('writeup', [
            'reports',
            'report_count',
            'selected_page'
        ])
    },
    methods: {
        ...Vuex.mapActions('writeup', [
            'loadReports',
            'updateSelectedPage'
        ]),
        onUpdatedSearch() {
            this.abortSearch();
            this.abort_controller = new AbortController();

            this.updateSelectedPage(1);

            this.loadReports(this.abort_controller.signal)
            .then(() => {
                this.abort_controller = null;
            })
            .catch(() => {
            });
        },
        onClickReportCard(reportDetail) {
            this.$router.push(`/writeup/rpt/${reportDetail.slug}`);
        },
        selectPage(pageNum) {
            this.updateSelectedPage(pageNum);
            this.loadReports();
        },
        abortSearch() {
            if (this.abort_controller) {
                this.abort_controller.abort();
            }
        }
    }
}
</script>