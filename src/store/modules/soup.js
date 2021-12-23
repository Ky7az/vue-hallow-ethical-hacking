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
        try {
            const res = await axios.get(`http://${API_HOST}/api/soup/articles/?${state.search_params}`, AxiosConfig);
            return commit('SET_ARTICLES', res.data);
        } catch (err) {
            return console.log(err);
        }
    },
    async loadTags({ commit }) {
        try {
            const res = await axios.get(`http://${API_HOST}/api/soup/tags/`, AxiosConfig);
            return commit('SET_TAGS', res.data);
        } catch (err) {
            return console.log(err);
        }
    },
    updateSearchParams({ commit }, search) {
        commit('SET_SEARCH_PARAMS', search);
    },
    async createArticle({ commit }, data) {
        try {
            const res = await axios.post(`http://${API_HOST}/api/soup/articles/`, data, AxiosConfig)
            return commit('CREATE_ARTICLE', res.data);
        } catch (err) {
            return console.log(err);
        }
    },
    async deleteArticle({ commit }, article) {
        try {
            await axios.delete(`http://${API_HOST}/api/soup/articles/${article.slug}/`, AxiosConfig);
            return commit('DELETE_ARTICLE', article);
        } catch (err) {
            return console.log(err);
        }
    },
    async updateArticle({ commit }, {article, data}) {
        try {
            const res = await axios.patch(`http://${API_HOST}/api/soup/articles/${article.slug}/`, data, AxiosConfig);
            return commit('UPDATE_ARTICLE', res.data);
        } catch (err) {
            return console.log(err);
        }
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
            search.search_tags.forEach(tag => params.push('tags=' + slugify(tag, {'replacement': '_', 'lower': true})));
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