import axios from 'axios';
import slugify from 'slugify';
import type { Module, ActionContext } from 'vuex';
import type { RootState } from '../index';
import { PROTO, API_HOST, AxiosConfig } from '../../storage/service';
import type {
    WatchTag,
    Source,
    Feed,
    Content,
    TagInputItem,
} from '../../types';

export interface WatchState {
    tags: WatchTag[];
    sources: Source[];
    feeds: Feed[];
    contents: Content[];
    content_count: number;
    selected_page: number;
    search_text: string | null;
    search_tags: TagInputItem[];
    search_source_type: string | null;
    search_viewed: boolean;
    search_bookmarked: boolean;
    search_params: string;
}

interface SearchPayload {
    search_text: string | null;
    search_tags: TagInputItem[];
    search_source_type: string | null;
    search_viewed: boolean;
    search_bookmarked: boolean;
}

const state: WatchState = {
    tags: [],
    sources: [],
    feeds: [],
    contents: [],
    content_count: 0,
    selected_page: 1,
    search_text: null,
    search_tags: [],
    search_source_type: null,
    search_viewed: false,
    search_bookmarked: false,
    search_params: 'viewed=false&bookmarked=false',
};

const getters = {
    getSourcesBySourceType: (state: WatchState) => (source_type: string) =>
        state.sources.filter((source) => source.source_type === source_type),
    getContentBySlug: (state: WatchState) => (slug: string) =>
        state.contents.find((content) => content.slug === slug),
};

const actions = {
    async loadTags({ commit }: ActionContext<WatchState, RootState>) {
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/watch/tags/`,
            AxiosConfig,
        );
        commit('SET_TAGS', res.data);
    },
    async loadSources({ commit }: ActionContext<WatchState, RootState>) {
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/watch/sources/`,
            AxiosConfig,
        );
        commit('SET_SOURCES', res.data);
    },
    async loadFeeds({ commit }: ActionContext<WatchState, RootState>) {
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/watch/feeds/`,
            AxiosConfig,
        );
        commit('SET_FEEDS', res.data);
    },
    async createFeed(
        { commit }: ActionContext<WatchState, RootState>,
        data: Partial<Feed>,
    ) {
        const res = await axios.post(
            `${PROTO}://${API_HOST}/api/watch/feeds/`,
            data,
            AxiosConfig,
        );
        commit('CREATE_FEED', res.data);
        return res.data as Feed;
    },
    async updateFeed(
        { commit }: ActionContext<WatchState, RootState>,
        { feed, data }: { feed: Feed; data: Partial<Feed> },
    ) {
        const res = await axios.patch(
            `${PROTO}://${API_HOST}/api/watch/feeds/${feed.id}/`,
            data,
            AxiosConfig,
        );
        commit('UPDATE_FEED', res.data);
        return res.data as Feed;
    },
    async deleteFeed(
        { commit }: ActionContext<WatchState, RootState>,
        feed: Feed,
    ) {
        await axios.delete(
            `${PROTO}://${API_HOST}/api/watch/feeds/${feed.id}/`,
            AxiosConfig,
        );
        commit('DELETE_FEED', feed);
    },
    async loadContents(
        { commit }: ActionContext<WatchState, RootState>,
        signal: AbortSignal,
    ) {
        AxiosConfig.signal = signal;
        let req_params = `?page=${state.selected_page}`;
        if (state.search_params) req_params += `&${state.search_params}`;
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/watch/contents/${req_params}`,
            AxiosConfig,
        );
        commit('SET_CONTENTS', res.data.results);
        commit('SET_CONTENT_COUNT', res.data.count);
    },
    async updateContent(
        { commit }: ActionContext<WatchState, RootState>,
        { content, data }: { content: Content; data: Partial<Content> },
    ) {
        const res = await axios.patch(
            `${PROTO}://${API_HOST}/api/watch/contents/${content.id}/`,
            data,
            AxiosConfig,
        );
        commit('UPDATE_CONTENT', res.data);
        return res.data as Content;
    },
    async deleteContent(
        { commit }: ActionContext<WatchState, RootState>,
        content: Content,
    ) {
        await axios.delete(
            `${PROTO}://${API_HOST}/api/watch/contents/${content.id}/`,
            AxiosConfig,
        );
        commit('DELETE_CONTENT', content);
    },
    updateSelectedPage(
        { commit }: ActionContext<WatchState, RootState>,
        page: number,
    ) {
        commit('SET_SELECTED_PAGE', page);
    },
    updateSearchParams(
        { commit }: ActionContext<WatchState, RootState>,
        search: SearchPayload,
    ) {
        commit('SET_SEARCH_PARAMS', search);
    },
};

const mutations = {
    SET_TAGS(state: WatchState, tags: WatchTag[]) {
        state.tags = tags;
    },
    SET_SOURCES(state: WatchState, sources: Source[]) {
        state.sources = sources;
    },
    SET_FEEDS(state: WatchState, feeds: Feed[]) {
        state.feeds = feeds;
    },
    CREATE_FEED(state: WatchState, feed: Feed) {
        state.feeds.unshift(feed);
    },
    UPDATE_FEED(state: WatchState, feed: Feed) {
        const index = state.feeds.findIndex((f) => f.id === feed.id);
        state.feeds.splice(index, 1);
        state.feeds.unshift(feed);
    },
    DELETE_FEED(state: WatchState, feed: Feed) {
        state.feeds = state.feeds.filter((f) => f.id !== feed.id);
    },
    SET_CONTENTS(state: WatchState, contents: Content[]) {
        state.contents = contents;
    },
    SET_CONTENT_COUNT(state: WatchState, count: number) {
        state.content_count = count;
    },
    UPDATE_CONTENT(state: WatchState, content: Content) {
        const index = state.contents.findIndex((c) => c.id === content.id);
        state.contents.splice(index, 1);
        state.contents.unshift(content);
    },
    DELETE_CONTENT(state: WatchState, content: Content) {
        state.contents = state.contents.filter((c) => c.id !== content.id);
    },
    SET_SELECTED_PAGE(state: WatchState, page: number) {
        state.selected_page = page || 1;
    },
    SET_SEARCH_PARAMS(state: WatchState, search: SearchPayload) {
        const params: string[] = [];
        if (search.search_text) params.push('title=' + search.search_text);
        state.search_text = search.search_text;
        if (search.search_tags.length)
            search.search_tags.forEach((tag) =>
                params.push(
                    'tag=' +
                        slugify(tag.text, { replacement: '-', lower: true }),
                ),
            );
        state.search_tags = search.search_tags;
        if (search.search_source_type)
            params.push('source_type=' + search.search_source_type);
        state.search_source_type = search.search_source_type;
        state.search_viewed = search.search_viewed;
        params.push('viewed=' + search.search_viewed);
        state.search_bookmarked = search.search_bookmarked;
        params.push('bookmarked=' + search.search_bookmarked);
        state.search_params = params.join('&');
    },
};

const watch: Module<WatchState, RootState> = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};

export default watch;
