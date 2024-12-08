<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <div class="input-group input-group-sm">
                    <div class="input-group-text">
                        <i class="bi-search orange"></i>
                    </div>
                    <input type="search" class="form-control form-control-sm" :value="search_text" @input="onInputSearch($event.target.value, 'search_text')"/>
                </div>
            </div>
            <div class="col">
                <div class="form-check form-check-inline"
                        v-for="option in optionsWebsites"
                        :key="option.value"
                >
                    <input :id="option.value" class="form-check-input" type="checkbox" :value="option.value" v-model="checked_websites"/>
                    <label :for="option.value" class="form-check-label"><span>{{ option.text }}</span></label>
                </div>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col">
                <div class="input-group input-group-sm">
                    <div class="input-group-text">
                        <i class="bi-tag-fill orange"></i>
                    </div>
                    <TagSearch :all_tags="tags" :search_tags="search_tags" @updated-tag-search="onInputSearch($event, 'search_tags')"/>
                </div>
            </div>
            <div class="col">
                <div class="row">
                    <div class="col" align="right">
                        <div class="form-check form-check-inline"
                                v-for="option in optionsTaskTypes"
                                :key="option.value"
                        >
                            <input :id="option.value" class="form-check-input" type="checkbox" :value="option.value" v-model="checked_task_types"/>
                            <label :for="option.value" class="form-check-label">{{ option.text }}</label>
                        </div>
                    </div>
                    <div class="col" align="left">
                        <div class="form-check form-check-inline"
                                v-for="option in optionsTaskPlatforms"
                                :key="option.value"
                        >
                            <input :id="option.value" class="form-check-input" type="checkbox" :value="option.value" v-model="checked_task_platforms"/>
                            <label :for="option.value" class="form-check-label">{{ option.text }}</label>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
</template>

<script>
import Vuex from 'vuex'
import { debounce } from 'lodash-es'

import { TokenService } from '../storage/service'

import TagSearch from '@/components/TagSearch'

export default {
    name: 'WriteupReportSearch',
    components: {
        TagSearch
    },
    data() {
        return {
            optionsTaskTypes: [
                {value: 'bugbounty', text: 'Bug Bounty'},
                {value: 'ctf', text: 'Capture The Flag'}
            ],
            optionsTaskPlatforms: [
                {value: 'linux', text: 'Linux'},
                {value: 'windows', text: 'Windows'}
            ],
            checked_websites: [],
            checked_task_types: [],
            checked_task_platforms: []
        }
    },
    watch: {
        checked_websites: function(val) {
            this.onInputSearch(val, 'search_websites');
        },
        checked_task_types: function(val) {
            this.onInputSearch(val, 'search_task_types');
        },
        checked_task_platforms: function(val) {
            this.onInputSearch(val, 'search_task_platforms');
        }
    },
    computed: {
        ...Vuex.mapState('writeup', [
            'tags',
            'websites',
            'search_text',
            'search_tags',
            'search_websites',
            'search_task_types',
            'search_task_platforms'
        ]),
        optionsWebsites() {
            return this.websites.map(x => ({value: x.slug, text: x.name}));
        }
    },
    methods: {
        ...Vuex.mapActions('writeup', [
            'loadTags',
            'updateSearchParams'
        ]),
        onInputSearch: debounce(function(event, field) {
            let search = {
                search_text: this.search_text, 
                search_tags: this.search_tags,
                search_websites: this.search_websites,
                search_task_types: this.search_task_types,
                search_task_platforms: this.search_task_platforms
            };
            search[field] = event;
            this.updateSearchParams(search);
            this.$emit('updated-search');
        }, 300)
    },
    created() {
        if (TokenService.getToken()) {
            this.loadTags();
        }
    }
}
</script>