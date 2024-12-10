<template>
    <div>
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/watch/new"
                    >New</router-link
                >
            </div>
        </div>
        <WatchContentSearch @updated-search="onUpdatedSearch" />
        <div class="row">
            <div class="col">
                <table class="table table-hover" v-if="contents.length">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Source</th>
                            <th>Type</th>
                            <th>Tag</th>
                            <th>Created</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="contentDetail in contents"
                            :key="contentDetail.id"
                        >
                            <td>{{ contentDetail.title }}</td>
                            <td>{{ contentDetail.source.name }}</td>
                            <td>
                                {{ contentDetail.source.source_type_display }}
                            </td>
                            <td>
                                {{
                                    contentDetail.tag && contentDetail.tag.name
                                }}
                            </td>
                            <td>
                                <timeago
                                    :datetime="contentDetail.create_date"
                                    :auto-update="60"
                                ></timeago>
                            </td>
                            <td>
                                <a
                                    :href="`${contentDetail.url}`"
                                    @click.left="
                                        onClickContentView(contentDetail)
                                    "
                                    @click.middle="
                                        onClickContentView(contentDetail)
                                    "
                                    target="_blank"
                                >
                                    <i
                                        class="bi-arrow-up-right-circle orange"
                                        title="View"
                                    ></i>
                                </a>
                            </td>
                            <td>
                                <i
                                    class="bi-x-square orange"
                                    title="Skip"
                                    @click="onClickContentView(contentDetail)"
                                ></i>
                            </td>
                            <td>
                                <i
                                    class="bi-bookmark-star orange"
                                    title="Bookmark"
                                    @click="
                                        onClickContentBookmark(contentDetail)
                                    "
                                    v-if="!contentDetail.bookmarked"
                                ></i>
                                <i
                                    class="bi-bookmark-star-fill orange"
                                    title="Bookmark"
                                    @click="
                                        onClickContentBookmark(contentDetail)
                                    "
                                    v-if="contentDetail.bookmarked"
                                ></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <VueginateBootstrap
                    :total-items="content_count"
                    :current-page="selected_page"
                    :items-per-page="content_per_page"
                    :custom-styles="{ container: ['justify-content-end'] }"
                    @page-change="selectPage"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Vuex from 'vuex';

import { TokenService } from '../storage/service';
import { VueginateBootstrap } from 'vueginate';

import WatchContentSearch from '@/components/WatchContentSearch';

export default {
    name: 'WatchContentList',
    components: {
        WatchContentSearch,
        VueginateBootstrap,
    },
    data() {
        return {
            content_per_page: 20,
            abort_controller: null,
        };
    },
    computed: {
        ...Vuex.mapState('watch', [
            'contents',
            'content_count',
            'selected_page',
        ]),
    },
    methods: {
        ...Vuex.mapActions('watch', [
            'loadContents',
            'updateContent',
            'updateSelectedPage',
        ]),
        onUpdatedSearch(pageNum = 1) {
            this.abortSearch();
            this.abort_controller = new AbortController();

            this.updateSelectedPage(pageNum);

            this.loadContents(this.abort_controller.signal)
                .then(() => {
                    this.abort_controller = null;
                })
                .catch(() => {});
        },
        pollContents() {
            this.$options.interval = setInterval(() => {
                this.loadContents();
            }, 60000);
        },
        onClickContentView(contentDetail) {
            var data = {
                viewed: true,
            };
            this.updateContent({ content: contentDetail, data }).then(() => {
                this.onUpdatedSearch(this.selected_page);
            });
        },
        onClickContentBookmark(contentDetail) {
            var data = {
                bookmarked: !contentDetail.bookmarked,
            };
            this.updateContent({ content: contentDetail, data }).then(() => {
                this.onUpdatedSearch(this.selected_page);
            });
        },
        selectPage(pageNum) {
            this.updateSelectedPage(pageNum);
            this.loadContents();
        },
        abortSearch() {
            if (this.abort_controller) {
                this.abort_controller.abort();
            }
        },
    },
    created() {
        if (TokenService.getToken()) {
            this.pollContents();
        }
    },
    beforeUnmount() {
        clearInterval(this.$options.interval);
    },
};
</script>
