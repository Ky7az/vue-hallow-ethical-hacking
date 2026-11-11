import axios from 'axios';
import slugify from 'slugify';
import { defineStore } from 'pinia';
import { PROTO, API_HOST, AxiosConfig } from '../storage/service';
import type { SoupTag, Article, TagInputItem, ApiPayload } from '../types';

export interface SoupState {
    tags: SoupTag[];
    articles: Article[];
    article_count: number;
    selected_page: number;
    search_text: string | null;
    search_tags: TagInputItem[];
    search_bookmarked: boolean | null;
    search_params: string | null;
}

export interface SearchPayload {
    search_text: string | null;
    search_tags: TagInputItem[];
    search_bookmarked: boolean | null;
}

export const useSoupStore = defineStore('soup', {
    state: (): SoupState => ({
        tags: [],
        articles: [],
        article_count: 0,
        selected_page: 1,
        search_text: null,
        search_tags: [],
        search_bookmarked: null,
        search_params: null,
    }),

    getters: {
        getArticleBySlug: (state) => (slug: string) =>
            state.articles.find((article) => article.slug === slug),
    },

    actions: {
        async loadTags() {
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/soup/tags/`,
                AxiosConfig,
            );
            this.tags = res.data;
        },
        async loadArticles(signal?: AbortSignal) {
            AxiosConfig.signal = signal;
            let req_params = `?page=${this.selected_page}`;
            if (this.search_params) req_params += `&${this.search_params}`;
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/soup/articles/${req_params}`,
                AxiosConfig,
            );
            this.articles = res.data.results;
            this.article_count = res.data.count;
        },
        async createArticle(data: ApiPayload) {
            const res = await axios.post(
                `${PROTO}://${API_HOST}/api/soup/articles/`,
                data,
                AxiosConfig,
            );
            this.articles.unshift(res.data);
            return res.data as Article;
        },
        async updateArticle({
            article,
            data,
        }: {
            article: Article;
            data: ApiPayload;
        }) {
            const res = await axios.patch(
                `${PROTO}://${API_HOST}/api/soup/articles/${article.slug}/`,
                data,
                AxiosConfig,
            );
            const updated = res.data as Article;
            const index = this.articles.findIndex(
                (a) => a.slug === updated.slug,
            );
            this.articles.splice(index, 1);
            this.articles.unshift(updated);
            return updated;
        },
        async deleteArticle(article: Article) {
            await axios.delete(
                `${PROTO}://${API_HOST}/api/soup/articles/${article.slug}/`,
                AxiosConfig,
            );
            this.articles = this.articles.filter(
                (a) => a.slug !== article.slug,
            );
        },
        updateSelectedPage(page: number) {
            this.selected_page = page || 1;
        },
        updateSearchParams(search: SearchPayload) {
            const params: string[] = [];
            if (search.search_text)
                params.push('name_or_content=' + search.search_text);
            this.search_text = search.search_text;
            if (search.search_tags.length)
                search.search_tags.forEach((tag) =>
                    params.push(
                        'tags=' +
                            slugify(tag.text, {
                                replacement: '-',
                                lower: true,
                            }),
                    ),
                );
            this.search_tags = search.search_tags;
            if (search.search_bookmarked)
                params.push('bookmarked=' + search.search_bookmarked);
            this.search_bookmarked = search.search_bookmarked;
            this.search_params = params.join('&');
        },
    },
});
