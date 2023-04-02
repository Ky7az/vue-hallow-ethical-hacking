<template>
    <div>
        <b-row>
            <b-col class="mb-3">
                <b-input-group size="sm" class="mb-2">
                    <b-input-group-prepend is-text>
                        <b-icon icon="search" class="orange"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input type="search" size="sm" :value="search_text" @input="onInputSearch($event, 'search_text')"></b-form-input>
                </b-input-group>
                <TagSearch :tags="tags" :search_tags="search_tags" @updated-tag-search="onInputSearch($event, 'search_tags')"/>
            </b-col>
            <b-col>
                <b-form-checkbox-group
                    size="sm"
                    :value="search_websites"
                    @input="onInputSearch($event, 'search_websites')"
                    :options="optionsWebsites"
                    class="mb-2"
                    value-field="value"
                    text-field="text">
                </b-form-checkbox-group>
                <b-form-checkbox-group
                    size="sm"
                    :value="search_task_types"
                    @input="onInputSearch($event, 'search_task_types')"
                    :options="optionsTaskTypes"
                    class="mb-2"
                    value-field="value"
                    text-field="text">
                </b-form-checkbox-group>
                <b-form-checkbox-group
                    size="sm"
                    :value="search_task_platforms"
                    @input="onInputSearch($event, 'search_task_platforms')"
                    :options="optionsTaskPlatforms"
                    value-field="value"
                    text-field="text">
                </b-form-checkbox-group>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'

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
            ]
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
        onInputSearch: _.debounce(function(event, field) {
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