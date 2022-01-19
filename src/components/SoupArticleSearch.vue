<template>
    <div>
        <b-row>
            <b-col>
                <b-input-group size="sm" class="mb-2">
                    <b-input-group-prepend is-text>
                        <b-icon icon="search" class="orange"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input type="search" size="sm" :value="search_text" @input="onInputSearch($event, 'search_text')"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col>
            </b-col>
        </b-row> 
        <b-row>
            <b-col class="mb-3">
                <b-form-tags size="sm" :value="search_tags" @input="onInputSearch($event, 'search_tags')" no-outer-focus>
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
                                @click="onClickOption({ option, addTag })">
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
import Vuex from 'vuex'
import _ from 'lodash'

export default {
    name: 'SoupArticleSearch',
    data() {
        return {
            options: [],
            search_by_tags: ''
        }
    },
    computed: {
        ...Vuex.mapState('soup', [
            'tags',
            'search_text',
            'search_tags'
        ]),
        criteria() {
            // Compute the search criteria
            return this.search_by_tags.trim().toLowerCase();
        },
        availableOptions() {
            const criteria = this.criteria;
            // Filter out already selected options
            const options = this.options.filter(opt => this.search_tags.indexOf(opt) === -1);
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
        ...Vuex.mapActions('soup', [
            'loadTags',
            'updateSearchParams'
        ]),
        getOptions() {
            this.options = this.tags.map(tag => tag.name + ' (' + tag.article_count.toString() + ')');
            this.options.sort();
        },
        onClickOption({ option, addTag }) {
            addTag(option.split(' (')[0]);
            this.search_by_tags = '';
        },
        onInputSearch: _.debounce(function(event, field) {
            let search = {
                search_text: this.search_text, 
                search_tags: this.search_tags
            };
            search[field] = event;
            this.updateSearchParams(search);
            this.$emit('updated-search');
        }, 300)
    },
    created() {
        this.loadTags().then(() => this.getOptions());
    }
}
</script>