import axios from 'axios'
import slugify from "slugify"

import {PROTO, API_HOST, AxiosConfig} from '../../storage/service'


const state = {
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
    search_params: 'viewed=false&bookmarked=false'
}

const getters = {
    getSourcesBySourceType: (state) => source_type => state.sources.filter(source => source.source_type === source_type),
    getContentBySlug: (state) => slug => state.contents.find(content => content.slug === slug),
}

const actions = {
    // Tags
    async loadTags({ commit }) {
        const res = await axios.get(`${PROTO}://${API_HOST}/api/watch/tags/`, AxiosConfig);
        commit('SET_TAGS', res.data);
    },
    // Sources
    async loadSources({ commit }) {
        const res = await axios.get(`${PROTO}://${API_HOST}/api/watch/sources/`, AxiosConfig);
        commit('SET_SOURCES', res.data);
    },
    // Feeds
    async loadFeeds({ commit }) {
        const res = await axios.get(`${PROTO}://${API_HOST}/api/watch/feeds/`, AxiosConfig);
        commit('SET_FEEDS', res.data);
    },
    async createFeed({ commit }, data) {
        const res = await axios.post(`${PROTO}://${API_HOST}/api/watch/feeds/`, data, AxiosConfig)
        commit('CREATE_FEED', res.data);
        return res.data;
    },
    async updateFeed({ commit }, {feed, data}) {
        const res = await axios.patch(`${PROTO}://${API_HOST}/api/watch/feeds/${feed.id}/`, data, AxiosConfig);
        commit('UPDATE_FEED', res.data);
        return res.data;
    },
    async deleteFeed({ commit }, feed) {
        await axios.delete(`${PROTO}://${API_HOST}/api/watch/feeds/${feed.id}/`, AxiosConfig);
        commit('DELETE_FEED', feed);
    },
    // Contents
    async loadContents({ commit }, signal) {
        AxiosConfig['signal'] = signal;
        let req_params = `?page=${state.selected_page}`;
        if (state.search_params)
            req_params += `&${state.search_params}`;
        const res = await axios.get(`${PROTO}://${API_HOST}/api/watch/contents/${req_params}`, AxiosConfig);
        commit('SET_CONTENTS', res.data.results);
        commit('SET_CONTENT_COUNT', res.data.count);
    },
    async updateContent({ commit }, {content, data}) {
        const res = await axios.patch(`${PROTO}://${API_HOST}/api/watch/contents/${content.id}/`, data, AxiosConfig);
        commit('UPDATE_CONTENT', res.data);
        return res.data;
    },
    async deleteContent({ commit }, content) {
        await axios.delete(`${PROTO}://${API_HOST}/api/watch/contents/${content.id}/`, AxiosConfig);
        commit('DELETE_CONTENT', content);
    },
    // Selected Page
    updateSelectedPage({ commit }, page) {
        commit('SET_SELECTED_PAGE', page);
    },
    // Search Params
    updateSearchParams({ commit }, search) {
        commit('SET_SEARCH_PARAMS', search);
    }
}

const mutations = {
    // Tags
    SET_TAGS(state, tags) {
        state.tags = tags;
    },
    // Sources
    SET_SOURCES(state, sources) {
        state.sources = sources;
    },
    // Feeds
    SET_FEEDS(state, feeds) {
        state.feeds = feeds;
    },
    CREATE_FEED(state, feed) {
        state.feeds.unshift(feed);
    },
    UPDATE_FEED(state, feed) {
        const index = state.feeds.findIndex(f => f.id === feed.id);
        state.feeds.splice(index, 1);
        state.feeds.unshift(feed);
    },
    DELETE_FEED(state, feed) {
        state.feeds = state.feeds.filter(f => f.id !== feed.id);
    },
    // Contents
    SET_CONTENTS(state, contents) {
        state.contents = contents;
    },
    SET_CONTENT_COUNT(state, count) {
        state.content_count = count;
    },
    UPDATE_CONTENT(state, content) {
        const index = state.contents.findIndex(c => c.id === content.id);
        state.contents.splice(index, 1);
        state.contents.unshift(content);
    },
    DELETE_CONTENT(state, content) {
        state.contents = state.contents.filter(c => c.id !== content.id);
    },
    // Selected Page
    SET_SELECTED_PAGE(state, page) {
        state.selected_page = page || 1;
    },
    // Search Params
    SET_SEARCH_PARAMS(state, search) {
        let params = [];
        if (search.search_text)
            params.push('title=' + search.search_text);
        state.search_text = search.search_text;
        if (search.search_tags.length)
            search.search_tags.forEach(tag => params.push('tag=' + slugify(tag.text, {'replacement': '-', 'lower': true})));
        state.search_tags = search.search_tags;
        if (search.search_source_type)
            params.push('source_type=' + search.search_source_type);
        state.search_source_type = search.search_source_type;
        state.search_viewed = search.search_viewed;
        params.push('viewed=' + search.search_viewed);
        state.search_bookmarked = search.search_bookmarked;
        params.push('bookmarked=' + search.search_bookmarked);
        state.search_params = params.join('&');
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}