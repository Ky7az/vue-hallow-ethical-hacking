<template>
    <div>
        <b-row class="mb-4">
            <b-col>
                <b-button to="/watch/new">New</b-button>
            </b-col>
        </b-row>
        <WatchContentSearch @updated-search="onUpdatedSearch"/>
        <b-row>
            <b-col class="m-4">
                <b-table-simple v-if="contents.length">
                    <b-thead>
                        <b-tr>
                            <b-th>Title</b-th>
                            <b-th>Source</b-th>
                            <b-th>Type</b-th>
                            <b-th>Tag</b-th>
                            <b-th>Created</b-th>
                            <b-th></b-th>
                            <b-th></b-th>
                        </b-tr>
                    </b-thead>
                    <b-tbody>
                        <b-tr v-for="contentDetail in contents" :key="contentDetail.id">
                            <b-td>{{ contentDetail.title }}</b-td>
                            <b-td>{{ contentDetail.source.name }}</b-td>
                            <b-td>{{ contentDetail.source.source_type_display }}</b-td>
                            <b-td>{{ contentDetail.tag && contentDetail.tag.name }}</b-td>
                            <b-td><timeago :datetime="contentDetail.create_date" :auto-update="60"></timeago></b-td>
                            <b-td>
                                <a :href="`${contentDetail.url}`" @click.left="onClickContentView(contentDetail)" @click.middle="onClickContentView(contentDetail)" target="_blank">
                                    <b-icon icon="arrow-up-right-circle" title="View" class="orange"></b-icon>
                                </a>
                            </b-td>
                            <b-td>
                                <b-icon icon="bookmark-star" title="Bookmark" class="orange" @click="onClickContentBookmark(contentDetail)" v-if="!contentDetail.bookmarked"></b-icon>
                                <b-icon icon="bookmark-star-fill" title="Bookmark" class="orange" @click="onClickContentBookmark(contentDetail)" v-if="contentDetail.bookmarked"></b-icon>
                            </b-td>
                        </b-tr>
                    </b-tbody>
                </b-table-simple>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="mb-4">
                <b-pagination
                    :value="selected_page"
                    :total-rows="content_count"
                    :per-page="content_per_page"
                    align="right"
                    @change="selectPage"
                ></b-pagination>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'

import { TokenService } from '../storage/service'

import WatchContentSearch from '@/components/WatchContentSearch'

export default {
    name: 'WatchContentList',
    components: {
        WatchContentSearch
    },
    data() {
        return {
            content_per_page: 20,
            abort_controller: null
        }
    },
    computed: {
        ...Vuex.mapState('watch', [
            'contents',
            'content_count',
            'selected_page'
        ])
    },
    methods: {
        ...Vuex.mapActions('watch', [
            'loadContents',
            'updateContent',
            'updateSelectedPage'
        ]),
        onUpdatedSearch(pageNum = 1) {
            this.abortSearch();
            this.abort_controller = new AbortController();

            this.updateSelectedPage(pageNum);

            this.loadContents(this.abort_controller.signal)
            .then(() => {
                this.abort_controller = null;
            })
            .catch(() => {
            });
        },
        onClickContentView(contentDetail) {
            var data = {
                viewed: true
            }
            this.updateContent({content: contentDetail, data}).then(() => {
                this.onUpdatedSearch(this.selected_page);
            })
        },
        onClickContentBookmark(contentDetail) {
            var data = {
                bookmarked: !contentDetail.bookmarked
            }
            this.updateContent({content: contentDetail, data}).then(() => {
                this.onUpdatedSearch(this.selected_page);
            })
        },
        selectPage(pageNum) {
            this.updateSelectedPage(pageNum);
            this.loadContents();
        },
        abortSearch() {
            if (this.abort_controller) {
                this.abort_controller.abort();
            }
        }
    }
}
</script>