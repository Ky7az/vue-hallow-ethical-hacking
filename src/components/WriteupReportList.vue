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
                   v-bind:key="report.id"
                   v-bind:title="report.name"
                   class="mb-4">
                <b-card v-bind:header="report.name"
                        v-bind:sub-title="report.website.name + ' - ' + report.task_type_display"
                        bg-variant="dark"
                        text-variant="white" >
                    <b-card-text>
                        <small v-for="tag in report.tags"
                                v-bind:key="tag.id"
                                v-bind:title="tag.name">
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
    computed: {
        ...Vuex.mapState('writeup', [
            'reports'
        ])
    },
    methods: {
        ...Vuex.mapActions('writeup', [
            'loadReports'
        ]),
        onUpdatedSearch() {
            this.loadReports();
        }
    }
}
</script>