<template>
    <div>
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/watch/new"
                    >New</router-link
                >
                <button
                    type="button"
                    class="btn btn-secondary ms-2"
                    v-if="selected_ids.size"
                    @click="onClickSkipSelected"
                >
                    Skip selected ({{ selected_ids.size }})
                </button>
            </div>
        </div>
        <WatchContentSearch @updated-search="onUpdatedSearch" />
        <div class="row">
            <div class="col">
                <table class="table table-hover" v-if="contents.length">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    title="Select all"
                                    :checked="allSelected"
                                    :indeterminate="
                                        selected_ids.size > 0 && !allSelected
                                    "
                                    @change="toggleSelectAll"
                                />
                            </th>
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
                            class="clickable"
                            :class="{
                                'table-active': selected_ids.has(
                                    contentDetail.id,
                                ),
                            }"
                            @click="onClickRow($event, contentDetail.id)"
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    class="form-check-input"
                                    :checked="
                                        selected_ids.has(contentDetail.id)
                                    "
                                    @change="toggleSelect(contentDetail.id)"
                                />
                            </td>
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { VueginateBootstrap } from 'vueginate';
import WatchContentSearch from '@/components/WatchContentSearch.vue';
import { useWatchStore } from '@/stores/watch';
import { TokenService } from '@/storage/service';
import type { Content } from '@/types';

const watchStore = useWatchStore();
const content_per_page = 20;
let abort_controller: AbortController | null = null;
let pollInterval: ReturnType<typeof setInterval> | null = null;

const contents = computed(() => watchStore.contents);
const content_count = computed(() => watchStore.content_count);
const selected_page = computed(() => watchStore.selected_page);
const selected_ids = ref<Set<number>>(new Set());
const allSelected = computed(
    () =>
        contents.value.length > 0 &&
        contents.value.every((c) => selected_ids.value.has(c.id)),
);

// Drop selected ids that are no longer displayed (page change, search, polling)
watch(contents, (list) => {
    const visible = new Set(list.map((c) => c.id));
    selected_ids.value = new Set(
        [...selected_ids.value].filter((id) => visible.has(id)),
    );
});

function toggleSelect(id: number) {
    const ids = new Set(selected_ids.value);
    if (ids.has(id)) ids.delete(id);
    else ids.add(id);
    selected_ids.value = ids;
}

function onClickRow(event: MouseEvent, id: number) {
    // Ignore clicks on the checkbox and the row actions (View, Skip, Bookmark)
    if ((event.target as HTMLElement).closest('a, i, input, button')) return;
    toggleSelect(id);
}

function toggleSelectAll() {
    selected_ids.value = allSelected.value
        ? new Set()
        : new Set(contents.value.map((c) => c.id));
}

function onClickSkipSelected() {
    if (!selected_ids.value.size) return;
    watchStore.bulkViewContents([...selected_ids.value]).then(() => {
        selected_ids.value = new Set();
        onUpdatedSearch(selected_page.value);
    });
}

function onUpdatedSearch(pageNum = 1) {
    abortSearch();
    abort_controller = new AbortController();
    watchStore.updateSelectedPage(pageNum);
    watchStore
        .loadContents(abort_controller.signal)
        .then(() => {
            abort_controller = null;
        })
        .catch(() => {});
}

function pollContents() {
    pollInterval = setInterval(() => {
        watchStore.loadContents();
    }, 60000);
}

function onClickContentView(contentDetail: Content) {
    watchStore
        .updateContent({
            content: contentDetail,
            data: { viewed: true },
        })
        .then(() => {
            onUpdatedSearch(selected_page.value);
        });
}

function onClickContentBookmark(contentDetail: Content) {
    watchStore
        .updateContent({
            content: contentDetail,
            data: { bookmarked: !contentDetail.bookmarked },
        })
        .then(() => {
            onUpdatedSearch(selected_page.value);
        });
}

function selectPage(pageNum: number) {
    watchStore.updateSelectedPage(pageNum);
    watchStore.loadContents();
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

<style scoped>
.clickable {
    cursor: pointer;
}
</style>
