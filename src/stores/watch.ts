import axios from 'axios';
import slugify from 'slugify';
import { defineStore } from 'pinia';
import { PROTO, API_HOST, AxiosConfig } from '../storage/service';
import type {
    WatchTag,
    Source,
    Feed,
    Content,
    TagInputItem,
    ApiPayload,
} from '../types';

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

export interface SearchPayload {
    search_text: string | null;
    search_tags: TagInputItem[];
    search_source_type: string | null;
    search_viewed: boolean;
    search_bookmarked: boolean;
}

export const useWatchStore = defineStore('watch', {
    state: (): WatchState => ({
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
    }),

    getters: {
        getSourcesBySourceType: (state) => (source_type: string) =>
            state.sources.filter(
                (source) => source.source_type === source_type,
            ),
        getContentBySlug: (state) => (slug: string) =>
            state.contents.find((content) => content.slug === slug),
    },

    actions: {
        async loadTags() {
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/watch/tags/`,
                AxiosConfig,
            );
            this.tags = res.data;
        },
        async loadSources() {
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/watch/sources/`,
                AxiosConfig,
            );
            this.sources = res.data;
        },
        async loadFeeds() {
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/watch/feeds/`,
                AxiosConfig,
            );
            this.feeds = res.data;
        },
        async createFeed(data: ApiPayload) {
            const res = await axios.post(
                `${PROTO}://${API_HOST}/api/watch/feeds/`,
                data,
                AxiosConfig,
            );
            this.feeds.unshift(res.data);
            return res.data as Feed;
        },
        async updateFeed({ feed, data }: { feed: Feed; data: ApiPayload }) {
            const res = await axios.patch(
                `${PROTO}://${API_HOST}/api/watch/feeds/${feed.id}/`,
                data,
                AxiosConfig,
            );
            const updated = res.data as Feed;
            const index = this.feeds.findIndex((f) => f.id === updated.id);
            this.feeds.splice(index, 1);
            this.feeds.unshift(updated);
            return updated;
        },
        async deleteFeed(feed: Feed) {
            await axios.delete(
                `${PROTO}://${API_HOST}/api/watch/feeds/${feed.id}/`,
                AxiosConfig,
            );
            this.feeds = this.feeds.filter((f) => f.id !== feed.id);
        },
        async loadContents(signal?: AbortSignal) {
            AxiosConfig.signal = signal;
            let req_params = `?page=${this.selected_page}`;
            if (this.search_params) req_params += `&${this.search_params}`;
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/watch/contents/${req_params}`,
                AxiosConfig,
            );
            this.contents = res.data.results;
            this.content_count = res.data.count;
        },
        async updateContent({
            content,
            data,
        }: {
            content: Content;
            data: ApiPayload;
        }) {
            const res = await axios.patch(
                `${PROTO}://${API_HOST}/api/watch/contents/${content.id}/`,
                data,
                AxiosConfig,
            );
            const updated = res.data as Content;
            const index = this.contents.findIndex((c) => c.id === updated.id);
            this.contents.splice(index, 1);
            this.contents.unshift(updated);
            return updated;
        },
        async deleteContent(content: Content) {
            await axios.delete(
                `${PROTO}://${API_HOST}/api/watch/contents/${content.id}/`,
                AxiosConfig,
            );
            this.contents = this.contents.filter((c) => c.id !== content.id);
        },
        updateSelectedPage(page: number) {
            this.selected_page = page || 1;
        },
        updateSearchParams(search: SearchPayload) {
            const params: string[] = [];
            if (search.search_text) params.push('title=' + search.search_text);
            this.search_text = search.search_text;
            if (search.search_tags.length)
                search.search_tags.forEach((tag) =>
                    params.push(
                        'tag=' +
                            slugify(tag.text, {
                                replacement: '-',
                                lower: true,
                            }),
                    ),
                );
            this.search_tags = search.search_tags;
            if (search.search_source_type)
                params.push('source_type=' + search.search_source_type);
            this.search_source_type = search.search_source_type;
            this.search_viewed = search.search_viewed;
            params.push('viewed=' + search.search_viewed);
            this.search_bookmarked = search.search_bookmarked;
            params.push('bookmarked=' + search.search_bookmarked);
            this.search_params = params.join('&');
        },
    },
});
