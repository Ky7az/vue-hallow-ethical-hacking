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
                            <td>
                                {{
                                    contentDetail.source &&
                                    contentDetail.source.name
                                }}
                            </td>
                            <td>
                                {{
                                    contentDetail.source &&
                                    contentDetail.source.source_type_display
                                }}
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

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { VueginateBootstrap } from 'vueginate';
import WatchContentSearch from '@/components/WatchContentSearch.vue';
import { useStore } from '@/store';
import { TokenService } from '@/storage/service';
import type { Content } from '@/types';

const store = useStore();
const content_per_page = 20;
let abort_controller: AbortController | null = null;
let pollInterval: ReturnType<typeof setInterval> | null = null;

const contents = computed(() => store.state.watch.contents);
const content_count = computed(() => store.state.watch.content_count);
const selected_page = computed(() => store.state.watch.selected_page);

function onUpdatedSearch(pageNum = 1) {
    abortSearch();
    abort_controller = new AbortController();
    store.dispatch('watch/updateSelectedPage', pageNum);
    store
        .dispatch('watch/loadContents', abort_controller.signal)
        .then(() => {
            abort_controller = null;
        })
        .catch(() => {});
}

function pollContents() {
    pollInterval = setInterval(() => {
        store.dispatch('watch/loadContents');
    }, 60000);
}

function onClickContentView(contentDetail: Content) {
    store
        .dispatch('watch/updateContent', {
            content: contentDetail,
            data: { viewed: true },
        })
        .then(() => {
            onUpdatedSearch(selected_page.value);
        });
}

function onClickContentBookmark(contentDetail: Content) {
    store
        .dispatch('watch/updateContent', {
            content: contentDetail,
            data: { bookmarked: !contentDetail.bookmarked },
        })
        .then(() => {
            onUpdatedSearch(selected_page.value);
        });
}

function selectPage(pageNum: number) {
    store.dispatch('watch/updateSelectedPage', pageNum);
    store.dispatch('watch/loadContents');
}

function abortSearch() {
    if (abort_controller) abort_controller.abort();
}

onMounted(() => {
    if (TokenService.getToken()) pollContents();
});

onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval);
});
</script>
