<template>
    <div>
        <b-row>
            <b-col>
                <b-input-group size="sm" class="mb-2">
                    <b-input-group-prepend is-text>
                        <b-icon icon="search" class="orange"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input type="search" size="sm" v-model="search_by_name_or_content" @input="onInput"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col>
            </b-col>
        </b-row> 
        <b-row>
            <b-col class="mb-3">
                <b-form-tags size="sm" v-model="selected_tags" @input="onInput" no-outer-focus>
                    <template v-slot="{ tags, disabled, addTag, removeTag }">
                        <ul v-if="tags.length > 0" class="list-inline d-inline-block">
                            <li v-for="tag in tags" :key="tag" class="list-inline-item">
                            <b-form-tag
                                @remove="removeTag(tag)"
                                :title="tag"
                                :disabled="disabled"
                                variant="danger">
                            {{ tag }}</b-form-tag>
                            </li>
                        </ul>

                        <b-dropdown size="sm" variant="outline-secondary" block menu-class="w-100">
                            <template #button-content>
                                <b-icon icon="tag-fill" class="orange"></b-icon>
                            </template>
                            <b-dropdown-form @submit.stop.prevent="() => {}">
                                <b-form-group
                                    label=""
                                    label-for="tag-search-input"
                                    label-cols-md="auto"
                                    class="mb-0"
                                    label-size="sm"
                                    :description="searchDesc"
                                    :disabled="disabled">
                                    <b-form-input v-model="search_by_tags" id="tag-search-input" type="search" size="sm" autocomplete="off"></b-form-input>
                                </b-form-group>
                            </b-dropdown-form>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item-button
                                v-for="option in availableOptions"
                                :key="option"
                                @click="onOptionClick({ option, addTag })">
                                {{ option }}
                            </b-dropdown-item-button>
                            <b-dropdown-text v-if="availableOptions.length === 0">
                            There are no tags available to select
                            </b-dropdown-text>
                        </b-dropdown>
                    </template>
                </b-form-tags>
            </b-col>
        </b-row>
    </div>
</template>

<script>

import axios from 'axios';

import {API_HOST, AxiosConfig} from '../storage/service'

export default {
    name: 'SoupArticleSearch',
    data() {
        return {
            options: [],
            search_by_name_or_content: '',
            search_by_tags: '',
            selected_tags: []
        }
    },
    computed: {
        criteria() {
            // Compute the search criteria
            return this.search_by_tags.trim().toLowerCase();
        },
        availableOptions() {
            const criteria = this.criteria;
            // Filter out already selected options
            const options = this.options.filter(opt => this.selected_tags.indexOf(opt) === -1);
            if (criteria) {
            // Show only options that match criteria
            return options.filter(opt => opt.toLowerCase().indexOf(criteria) > -1);
            }
            // Show all options available
            return options;
        },
        searchDesc() {
            if (this.criteria && this.availableOptions.length === 0) {
                return 'There are no tags matching your search criteria';
            }
            return '';
        }
    },
    methods: {
        getTags() {
            axios.get(`http://${API_HOST}/api/soup/tags/`, AxiosConfig)
            .then(res => {
                this.options = res.data.map(tag => tag.name);
                this.options.sort();
            })
            .catch(err => console.log(err));
        },
        onOptionClick({ option, addTag }) {
            addTag(option);
            this.search_by_tags = '';
        },
        onInput() {
            this.$emit('updated-search', this.search_by_name_or_content, this.selected_tags);
        }
    },
    mounted() {
        this.getTags();
    }
}
</script>
