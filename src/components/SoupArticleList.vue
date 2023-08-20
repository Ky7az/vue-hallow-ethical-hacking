<template>
    <div>
        <b-row class="mb-4">
            <b-col>
                <b-button to="/soup/new">New</b-button>
            </b-col>
        </b-row>
        <SoupArticleSearch @updated-search="onUpdatedSearch"/>
        <b-row cols="1" cols-sm="2" cols-md="3" cols-lg="4" cols-xl="6">
            <b-col v-for="articleDetail in articles"
                   :key="articleDetail.id"
                   :title="articleDetail.name"
                class="mb-4">
                <b-card bg-variant="dark"
                        text-variant="white">
                    <template #header>
                        <div class="orange card-overflow" @click="onClickArticleCard(articleDetail)">
                            {{articleDetail.name}}
                        </div>
                    </template>
                    <b-card-text class="card-overflow">
                        <small v-for="tagDetail in articleDetail.tags"
                               :key="tagDetail.id"
                               :title="tagDetail.name">
                            #{{tagDetail.name}}
                        </small>
                        <small v-if="articleDetail.tags.length === 0">#No Tags</small>
                    </b-card-text>
                    <template #footer>
                        <small class="text-muted">Updated <timeago :datetime="articleDetail.write_date" :auto-update="60"></timeago></small>
                        &nbsp;
                        <b-icon icon="bookmark-star" title="Bookmark" class="orange" @click="onClickArticleBookmark(articleDetail)" v-if="!articleDetail.bookmarked"></b-icon>
                        <b-icon icon="bookmark-star-fill" title="Bookmark" class="orange" @click="onClickArticleBookmark(articleDetail)" v-if="articleDetail.bookmarked"></b-icon>
                    </template>
                </b-card>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-pagination
                    :value="selected_page"
                    :total-rows="article_count"
                    :per-page="article_per_page"
                    align="right"
                    @change="selectPage"
                ></b-pagination>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'

import SoupArticleSearch from '@/components/SoupArticleSearch'

export default {
    name: 'SoupArticleList',
    components: {
        SoupArticleSearch
    },
    data() {
        return {
            article_per_page: 18,
            abort_controller: null
        }
    },
    computed: {
        ...Vuex.mapState('soup', [
            'articles',
            'article_count',
            'selected_page'
        ])
    },
    methods: {
        ...Vuex.mapActions('soup', [
            'loadArticles',
            'updateArticle',
            'updateSelectedPage'
        ]),
        onUpdatedSearch() {
            this.abortSearch();
            this.abort_controller = new AbortController();

            this.updateSelectedPage(1);

            this.loadArticles(this.abort_controller.signal)
            .then(() => {
                this.abort_controller = null;
            })
            .catch(() => {
            });
        },
        onClickArticleCard(articleDetail) {
            this.$router.push(`/soup/art/${articleDetail.slug}`);
        },
        onClickArticleBookmark(articleDetail) {
            var data = {
                bookmarked: !articleDetail.bookmarked
            }
            this.updateArticle({article: articleDetail, data});
        },
        selectPage(pageNum) {
            this.updateSelectedPage(pageNum);
            this.loadArticles();
        },
        abortSearch() {
            if (this.abort_controller) {
                this.abort_controller.abort();
            }
        }
    }
}
</script>