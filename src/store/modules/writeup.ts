import axios from 'axios';
import slugify from 'slugify';
import type { Module, ActionContext } from 'vuex';
import type { RootState } from '../index';
import { PROTO, API_HOST, AxiosConfig } from '../../storage/service';
import type { WriteupTag, Website, Report, TagInputItem } from '../../types';

export interface WriteupState {
    tags: WriteupTag[];
    websites: Website[];
    reports: Report[];
    report_count: number;
    selected_page: number;
    search_text: string | null;
    search_tags: TagInputItem[];
    search_websites: string[];
    search_task_types: string[];
    search_task_platforms: string[];
    search_params: string | null;
}

interface SearchPayload {
    search_text: string | null;
    search_tags: TagInputItem[];
    search_websites: string[];
    search_task_types: string[];
    search_task_platforms: string[];
}

const state: WriteupState = {
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
    search_params: null,
};

const getters = {
    getReportBySlug: (state: WriteupState) => (slug: string) =>
        state.reports.find((report) => report.slug === slug),
};

const actions = {
    async loadTags({ commit }: ActionContext<WriteupState, RootState>) {
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/writeup/tags/`,
            AxiosConfig,
        );
        commit('SET_TAGS', res.data);
    },
    async loadWebsites({ commit }: ActionContext<WriteupState, RootState>) {
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/writeup/websites/`,
            AxiosConfig,
        );
        commit('SET_WEBSITES', res.data);
    },
    async loadReports(
        { commit }: ActionContext<WriteupState, RootState>,
        signal: AbortSignal,
    ) {
        AxiosConfig.signal = signal;
        let req_params = `?page=${state.selected_page}`;
        if (state.search_params) req_params += `&${state.search_params}`;
        const res = await axios.get(
            `${PROTO}://${API_HOST}/api/writeup/reports/${req_params}`,
            AxiosConfig,
        );
        commit('SET_REPORTS', res.data.results);
        commit('SET_REPORT_COUNT', res.data.count);
    },
    async createReport(
        { commit }: ActionContext<WriteupState, RootState>,
        data: Partial<Report>,
    ) {
        const res = await axios.post(
            `${PROTO}://${API_HOST}/api/writeup/reports/`,
            data,
            AxiosConfig,
        );
        commit('CREATE_REPORT', res.data);
        return res.data as Report;
    },
    async updateReport(
        { commit }: ActionContext<WriteupState, RootState>,
        { report, data }: { report: Report; data: Partial<Report> },
    ) {
        const res = await axios.patch(
            `${PROTO}://${API_HOST}/api/writeup/reports/${report.slug}/`,
            data,
            AxiosConfig,
        );
        commit('UPDATE_REPORT', res.data);
        return res.data as Report;
    },
    async deleteReport(
        { commit }: ActionContext<WriteupState, RootState>,
        report: Report,
    ) {
        await axios.delete(
            `${PROTO}://${API_HOST}/api/writeup/reports/${report.slug}/`,
            AxiosConfig,
        );
        commit('DELETE_REPORT', report);
    },
    updateSelectedPage(
        { commit }: ActionContext<WriteupState, RootState>,
        page: number,
    ) {
        commit('SET_SELECTED_PAGE', page);
    },
    updateSearchParams(
        { commit }: ActionContext<WriteupState, RootState>,
        search: SearchPayload,
    ) {
        commit('SET_SEARCH_PARAMS', search);
    },
};

const mutations = {
    SET_TAGS(state: WriteupState, tags: WriteupTag[]) {
        state.tags = tags;
    },
    SET_WEBSITES(state: WriteupState, websites: Website[]) {
        state.websites = websites;
    },
    SET_REPORTS(state: WriteupState, reports: Report[]) {
        state.reports = reports;
    },
    SET_REPORT_COUNT(state: WriteupState, count: number) {
        state.report_count = count;
    },
    CREATE_REPORT(state: WriteupState, report: Report) {
        state.reports.unshift(report);
    },
    UPDATE_REPORT(state: WriteupState, report: Report) {
        const index = state.reports.findIndex((a) => a.slug === report.slug);
        state.reports.splice(index, 1);
        state.reports.unshift(report);
    },
    DELETE_REPORT(state: WriteupState, report: Report) {
        state.reports = state.reports.filter((x) => x.id !== report.id);
    },
    SET_SELECTED_PAGE(state: WriteupState, page: number) {
        state.selected_page = page || 1;
    },
    SET_SEARCH_PARAMS(state: WriteupState, search: SearchPayload) {
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
        if (search.search_websites.length)
            search.search_websites.forEach((website) =>
                params.push('website=' + website),
            );
        state.search_websites = search.search_websites;
        if (search.search_task_types.length)
            search.search_task_types.forEach((type) =>
                params.push('task_type=' + type),
            );
        state.search_task_types = search.search_task_types;
        if (search.search_task_platforms.length)
            search.search_task_platforms.forEach((platform) =>
                params.push('task_platform=' + platform),
            );
        state.search_task_platforms = search.search_task_platforms;
        state.search_params = params.join('&');
    },
};

const writeup: Module<WriteupState, RootState> = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};

export default writeup;
