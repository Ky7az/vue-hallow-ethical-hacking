<template>
    <div>
        <div class="row mb-4">
            <div class="col">
                <router-link class="btn btn-secondary" to="/soup/new"
                    >New</router-link
                >
            </div>
        </div>
        <SoupArticleSearch @updated-search="onUpdatedSearch" />
        <div
            class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6"
        >
            <div
                class="col mb-4"
                v-for="articleDetail in articles"
                :key="articleDetail.id"
                :title="articleDetail.name"
            >
                <div class="card text-white">
                    <div class="card-header">
                        <div
                            class="orange card-overflow"
                            @click="onClickArticleCard(articleDetail)"
                        >
                            {{ articleDetail.name }}
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            <small
                                v-for="tagDetail in articleDetail.tags"
                                :key="tagDetail.id"
                                :title="tagDetail.name"
                            >
                                #{{ tagDetail.name }}
                            </small>
                            <small v-if="articleDetail.tags.length === 0"
                                >#No Tags</small
                            >
                        </p>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted"
                            >Updated
                            <timeago
                                :datetime="articleDetail.write_date"
                                :auto-update="60"
                            ></timeago
                        ></small>
                        &nbsp;
                        <i
                            class="bi-bookmark-star orange"
                            title="Bookmark"
                            @click="onClickArticleBookmark(articleDetail)"
                            v-if="!articleDetail.bookmarked"
                        ></i>
                        <i
                            class="bi-bookmark-star-fill orange"
                            title="Bookmark"
                            @click="onClickArticleBookmark(articleDetail)"
                            v-if="articleDetail.bookmarked"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <VueginateBootstrap
                    :total-items="article_count"
                    :current-page="selected_page"
                    :items-per-page="article_per_page"
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
import SoupArticleSearch from '@/components/SoupArticleSearch.vue';
import { useSoupStore } from '@/stores/soup';
import type { Article } from '@/types';

const soupStore = useSoupStore();
const router = useRouter();
const article_per_page = 18;
let abort_controller: AbortController | null = null;

const articles = computed(() => soupStore.articles);
const article_count = computed(() => soupStore.article_count);
const selected_page = computed(() => soupStore.selected_page);

function onUpdatedSearch() {
    abortSearch();
    abort_controller = new AbortController();
    soupStore.updateSelectedPage(1);
    soupStore
        .loadArticles(abort_controller.signal)
        .then(() => {
            abort_controller = null;
        })
        .catch(() => {});
}

function onClickArticleCard(articleDetail: Article) {
    router.push(`/soup/art/${articleDetail.slug}`);
}

function onClickArticleBookmark(articleDetail: Article) {
    soupStore.updateArticle({
        article: articleDetail,
        data: { bookmarked: !articleDetail.bookmarked },
    });
}

function selectPage(pageNum: number) {
    soupStore.updateSelectedPage(pageNum);
    soupStore.loadArticles();
}

function abortSearch() {
    if (abort_controller) abort_controller.abort();
}
</script>
