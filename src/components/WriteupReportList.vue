<template>
    <div>
        <b-row>
            <b-col class="mb-4">
                <b-button to="/writeup/new">New</b-button>
            </b-col>
        </b-row>
        <WriteupReportSearch @updated-search="onUpdatedSearch"/>
        <b-row cols="1" cols-sm="2" cols-md="3" cols-lg="4" cols-xl="6">
            <b-col v-for="report in reports"
                   :key="report.id"
                   :title="report.name"
                   class="mb-4">
                <b-card :header="report.name"
                        :sub-title="report.website.name + ' - ' + report.task_type_display"
                        bg-variant="dark"
                        text-variant="white" >
                    <b-card-text>
                        <small v-for="tag in report.tags"
                                :key="tag.id"
                                :title="tag.name">
                            #{{tag.name}}
                        </small>
                        <router-link :to="`/writeup/rpt/${report.slug}`">
                            <b-icon icon="arrow-up-right-circle" class="orange"></b-icon>
                        </router-link>
                    </b-card-text>
                    <template #footer>
                        <small class="text-muted">Updated <timeago :datetime="report.write_date" :auto-update="60"></timeago></small>
                    </template>
                </b-card>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="mb-4">
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