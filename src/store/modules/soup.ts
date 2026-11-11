import axios from 'axios';
import slugify from 'slugify';
import type { Module, ActionContext } from 'vuex';
import type { RootState } from '../index';
import { PROTO, API_HOST, AxiosConfig } from '../../storage/service';
import type { SoupTag, Article, TagInputItem } from '../../types';

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

interface SearchPayload {
    search_text: string | null;
    search_tags: TagInputItem[];
    search_bookmarked: boolean | null;
}

const state: SoupState = {
    tags: [],
    articles: [],
    article_count: 0,
    selected_page: 1,
    search_text: null,
    search_tags: [],
    search_bookmarked: null,
    search_params: null,
};

const getters = {
    getArticleBySlug: (state: SoupState) => (slug: string) =>
        state.articles.find((article) => article.slug === slug),
};

const actions = {
    async loadTags({ commit }: ActionContext<SoupState, RootState>) {
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/soup/tags/`,
            AxiosConfig,
        );
        commit('SET_TAGS', res.data);
    },
    async loadArticles(
        { commit }: ActionContext<SoupState, RootState>,
        signal: AbortSignal,
    ) {
        AxiosConfig.signal = signal;
        let req_params = `?page=${state.selected_page}`;
        if (state.search_params) req_params += `&${state.search_params}`;
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/soup/articles/${req_params}`,
            AxiosConfig,
        );
        commit('SET_ARTICLES', res.data.results);
        commit('SET_ARTICLE_COUNT', res.data.count);
    },
    async createArticle(
        { commit }: ActionContext<SoupState, RootState>,
        data: Partial<Article>,
    ) {
        const res = await axios.post(
            `${PROTO}://${API_HOST}/api/soup/articles/`,
            data,
            AxiosConfig,
        );
        commit('CREATE_ARTICLE', res.data);
        return res.data as Article;
    },
    async updateArticle(
        { commit }: ActionContext<SoupState, RootState>,
        { article, data }: { article: Article; data: Partial<Article> },
    ) {
        const res = await axios.patch(
            `${PROTO}://${API_HOST}/api/soup/articles/${article.slug}/`,
            data,
            AxiosConfig,
        );
        commit('UPDATE_ARTICLE', res.data);
        return res.data as Article;
    },
    async deleteArticle(
        { commit }: ActionContext<SoupState, RootState>,
        article: Article,
    ) {
        await axios.delete(
            `${PROTO}://${API_HOST}/api/soup/articles/${article.slug}/`,
            AxiosConfig,
        );
        commit('DELETE_ARTICLE', article);
    },
    updateSelectedPage(
        { commit }: ActionContext<SoupState, RootState>,
        page: number,
    ) {
        commit('SET_SELECTED_PAGE', page);
    },
    updateSearchParams(
        { commit }: ActionContext<SoupState, RootState>,
        search: SearchPayload,
    ) {
        commit('SET_SEARCH_PARAMS', search);
    },
};

const mutations = {
    SET_TAGS(state: SoupState, tags: SoupTag[]) {
        state.tags = tags;
    },
    SET_ARTICLES(state: SoupState, articles: Article[]) {
        state.articles = articles;
    },
    SET_ARTICLE_COUNT(state: SoupState, count: number) {
        state.article_count = count;
    },
    CREATE_ARTICLE(state: SoupState, article: Article) {
        state.articles.unshift(article);
    },
    UPDATE_ARTICLE(state: SoupState, article: Article) {
        const index = state.articles.findIndex((a) => a.slug === article.slug);
        state.articles.splice(index, 1);
        state.articles.unshift(article);
    },
    DELETE_ARTICLE(state: SoupState, article: Article) {
        state.articles = state.articles.filter((a) => a.slug !== article.slug);
    },
    SET_SELECTED_PAGE(state: SoupState, page: number) {
        state.selected_page = page || 1;
    },
    SET_SEARCH_PARAMS(state: SoupState, search: SearchPayload) {
        const params: string[] = [];
        if (search.search_text)
            params.push('name_or_content=' + search.search_text);
        state.search_text = search.search_text;
        if (search.search_tags.length)
            search.search_tags.forEach((tag) =>
                params.push(
                    'tags=' +
                        slugify(tag.text, { replacement: '-', lower: true }),
                ),
            );
        state.search_tags = search.search_tags;
        if (search.search_bookmarked)
            params.push('bookmarked=' + search.search_bookmarked);
        state.search_bookmarked = search.search_bookmarked;
        state.search_params = params.join('&');
    },
};

const soup: Module<SoupState, RootState> = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};

export default soup;
