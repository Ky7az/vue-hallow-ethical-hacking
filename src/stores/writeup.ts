import axios from 'axios';
import slugify from 'slugify';
import { defineStore } from 'pinia';
import { PROTO, API_HOST, AxiosConfig } from '../storage/service';
import type {
    WriteupTag,
    Website,
    Report,
    TagInputItem,
    ApiPayload,
} from '../types';

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

export interface SearchPayload {
    search_text: string | null;
    search_tags: TagInputItem[];
    search_websites: string[];
    search_task_types: string[];
    search_task_platforms: string[];
}

export const useWriteupStore = defineStore('writeup', {
    state: (): WriteupState => ({
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
    }),

    getters: {
        getReportBySlug: (state) => (slug: string) =>
            state.reports.find((report) => report.slug === slug),
    },

    actions: {
        async loadTags() {
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/writeup/tags/`,
                AxiosConfig,
            );
            this.tags = res.data;
        },
        async loadWebsites() {
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/writeup/websites/`,
                AxiosConfig,
            );
            this.websites = res.data;
        },
        async loadReports(signal?: AbortSignal) {
            AxiosConfig.signal = signal;
            let req_params = `?page=${this.selected_page}`;
            if (this.search_params) req_params += `&${this.search_params}`;
            const res = await axios.get(
                `${PROTO}://${API_HOST}/api/writeup/reports/${req_params}`,
                AxiosConfig,
            );
            this.reports = res.data.results;
            this.report_count = res.data.count;
        },
        async createReport(data: ApiPayload) {
            const res = await axios.post(
                `${PROTO}://${API_HOST}/api/writeup/reports/`,
                data,
                AxiosConfig,
            );
            this.reports.unshift(res.data);
            return res.data as Report;
        },
        async updateReport({
            report,
            data,
        }: {
            report: Report;
            data: ApiPayload;
        }) {
            const res = await axios.patch(
                `${PROTO}://${API_HOST}/api/writeup/reports/${report.slug}/`,
                data,
                AxiosConfig,
            );
            const updated = res.data as Report;
            const index = this.reports.findIndex(
                (a) => a.slug === updated.slug,
            );
            this.reports.splice(index, 1);
            this.reports.unshift(updated);
            return updated;
        },
        async deleteReport(report: Report) {
            await axios.delete(
                `${PROTO}://${API_HOST}/api/writeup/reports/${report.slug}/`,
                AxiosConfig,
            );
            this.reports = this.reports.filter((x) => x.id !== report.id);
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
            if (search.search_websites.length)
                search.search_websites.forEach((website) =>
                    params.push('website=' + website),
                );
            this.search_websites = search.search_websites;
            if (search.search_task_types.length)
                search.search_task_types.forEach((type) =>
                    params.push('task_type=' + type),
                );
            this.search_task_types = search.search_task_types;
            if (search.search_task_platforms.length)
                search.search_task_platforms.forEach((platform) =>
                    params.push('task_platform=' + platform),
                );
            this.search_task_platforms = search.search_task_platforms;
            this.search_params = params.join('&');
        },
    },
});
