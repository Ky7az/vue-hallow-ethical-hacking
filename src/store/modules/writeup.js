import axios from 'axios'
import slugify from "slugify"

import {PROTO, API_HOST, AxiosConfig} from '../../storage/service'


const state = {
    tags: [],
    websites: [],
    reports: [],
    report_count: 0,
    selected_page: 1,
    search_text: null,
    search_tags: [],
    search_websites: [],
    search_task_types: [],
    search_task_platforms: [],
    search_params: null
}

const getters = {
    getReportBySlug: (state) => slug => state.reports.find(report => report.slug === slug)
}

const actions = {
    // Tags
    async loadTags({ commit }) {
        const res = await axios.get(`${PROTO}://${API_HOST}/api/writeup/tags/`, AxiosConfig);
        commit('SET_TAGS', res.data);
    },
    // Websites
    async loadWebsites({ commit }) {
        const res = await axios.get(`${PROTO}://${API_HOST}/api/writeup/websites/`, AxiosConfig);
        commit('SET_WEBSITES', res.data);
    },
    // Reports
    async loadReports({ commit }, signal) {
        AxiosConfig['signal'] = signal;
        let req_params = `?page=${state.selected_page}`;
        if (state.search_params)
            req_params += `&${state.search_params}`;
        const res = await axios.get(`${PROTO}://${API_HOST}/api/writeup/reports/${req_params}`, AxiosConfig);
        commit('SET_REPORTS', res.data.results);
        commit('SET_REPORT_COUNT', res.data.count);
    },
    async createReport({ commit }, data) {
        const res = await axios.post(`${PROTO}://${API_HOST}/api/writeup/reports/`, data, AxiosConfig)
        commit('CREATE_REPORT', res.data);
        return res.data;
    },
    async updateReport({ commit }, {report, data}) {
        const res = await axios.patch(`${PROTO}://${API_HOST}/api/writeup/reports/${report.slug}/`, data, AxiosConfig);
        commit('UPDATE_REPORT', res.data);
        return res.data;
    },
    async deleteReport({ commit }, report) {
        await axios.delete(`${PROTO}://${API_HOST}/api/writeup/reports/${report.slug}/`, AxiosConfig);
        commit('DELETE_REPORT', report);
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
    // Websites
    SET_WEBSITES(state, websites) {
        state.websites = websites;
    },
    // Reports
    SET_REPORTS(state, reports) {
        state.reports = reports;
    },
    SET_REPORT_COUNT(state, count) {
        state.report_count = count;
    },
    CREATE_REPORT(state, report) {
        state.reports.unshift(report);
    },
    UPDATE_REPORT(state, report) {
        const index = state.reports.findIndex(a => a.slug === report.slug);
        state.reports.splice(index, 1);
        state.reports.unshift(report);
    },
    DELETE_REPORT(state, report) {
        state.reports = state.reports.filter(x => x.id !== report.id);
    },
    // Selected Page
    SET_SELECTED_PAGE(state, page) {
        state.selected_page = page || 1;
    },
    // Search Params
    SET_SEARCH_PARAMS(state, search) {
        let params = [];
        if (search.search_text)
            params.push('name_or_content=' + search.search_text);
        state.search_text = search.search_text;
        if (search.search_tags.length)
            search.search_tags.forEach(tag => params.push('tags=' + slugify(tag.text, {'replacement': '-', 'lower': true})));
        state.search_tags = search.search_tags;
        if (search.search_websites.length)
            search.search_websites.forEach(website => params.push('website=' + website));
        state.search_websites = search.search_websites;
        if (search.search_task_types.length)
            search.search_task_types.forEach(type => params.push('task_type=' + type));
        state.search_task_types = search.search_task_types;
        if (search.search_task_platforms.length)
            search.search_task_platforms.forEach(platform => params.push('task_platform=' + platform));
        state.search_task_platforms = search.search_task_platforms;
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