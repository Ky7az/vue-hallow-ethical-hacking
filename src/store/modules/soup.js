import axios from 'axios';
import slugify from "slugify";

import {API_HOST, AxiosConfig} from '../../storage/service'


const state = {
    articles: [],
    tags: [],
    search_text: null,
    search_tags: [],
    search_params: []
}

const getters = {
    getArticleBySlug: (state) => slug => state.articles.find(article => article.slug === slug)
}

const actions = {
    async loadArticles({ commit }) {
        const res = await axios.get(`http://${API_HOST}/api/soup/articles/?${state.search_params}`, AxiosConfig);
        commit('SET_ARTICLES', res.data);
    },
    async loadTags({ commit }) {
        const res = await axios.get(`http://${API_HOST}/api/soup/tags/`, AxiosConfig);
        commit('SET_TAGS', res.data);
    },
    updateSearchParams({ commit }, search) {
        commit('SET_SEARCH_PARAMS', search);
    },
    async createArticle({ commit }, data) {
        const res = await axios.post(`http://${API_HOST}/api/soup/articles/`, data, AxiosConfig)
        commit('CREATE_ARTICLE', res.data);
        return res.data;
    },
    async deleteArticle({ commit }, article) {
        await axios.delete(`http://${API_HOST}/api/soup/articles/${article.slug}/`, AxiosConfig);
        commit('DELETE_ARTICLE', article);
    },
    async updateArticle({ commit }, {article, data}) {
        const res = await axios.patch(`http://${API_HOST}/api/soup/articles/${article.slug}/`, data, AxiosConfig);
        commit('UPDATE_ARTICLE', res.data);
        return res.data;
    }
}

const mutations = {
    SET_ARTICLES(state, articles) {
        state.articles = articles;
    },
    SET_TAGS(state, tags) {
        state.tags = tags;
    },
    SET_SEARCH_PARAMS(state, search) {
        let params = [];
        if (search.search_text)
            params.push('name_or_content=' + search.search_text);
        state.search_text = search.search_text;
        if (search.search_tags.length)
            search.search_tags.forEach(tag => params.push('tags=' + slugify(tag, {'replacement': '-', 'lower': true})));
        state.search_tags = search.search_tags;
        state.search_params = params.join('&');
    },
    CREATE_ARTICLE(state, article) {
        state.articles.unshift(article);
    },
    DELETE_ARTICLE(state, article) {
        state.articles = state.articles.filter(a => a.slug !== article.slug);
    },
    UPDATE_ARTICLE(state, article) {
        const index = state.articles.findIndex(a => a.slug === article.slug);
        state.articles.splice(index, 1);
        state.articles.unshift(article);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}