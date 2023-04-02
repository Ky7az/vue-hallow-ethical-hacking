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
                <b-form-radio-group size="sm" :value="search_source_type" @input="onInputSearch($event, 'search_source_type')" :options="optionsSourceTypes"></b-form-radio-group>
            </b-col>
        </b-row> 
        <b-row>
            <b-col class="mb-3">
                <TagSearch :tags="tags" :search_tags="search_tags" @updated-tag-search="onInputSearch($event, 'search_tags')"/>
            </b-col>
            <b-col>
                <b-row>
                    <b-col></b-col>
                    <b-col></b-col>
                    <b-col></b-col>
                    <b-col>
                        <b-form-checkbox switch size="sm" :checked="search_viewed" @input="onInputSearch($event, 'search_viewed')">Viewed</b-form-checkbox>
                    </b-col>
                    <b-col>
                        <b-form-checkbox switch size="sm" :checked="search_bookmarked" @input="onInputSearch($event, 'search_bookmarked')">Bookmarked</b-form-checkbox>
                    </b-col>
                    <b-col></b-col>
                    <b-col></b-col>
                    <b-col></b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'

import { TokenService } from '../storage/service'

import TagSearch from '@/components/TagSearch'

export default {
    name: 'WatchContentSearch',
    components: {
        TagSearch
    },
    data() {
        return {
            optionsSourceTypes: [
                {value: 'exploit', text: 'Exploit'},
                {value: 'security', text: 'Security'},
                {value: 'technology', text: 'Technology'},
                {value: 'vulnerability', text: 'Vulnerability'}
            ]
        }
    },
    computed: {
        ...Vuex.mapState('watch', [
            'tags',
            'sources',
            'search_text',
            'search_tags',
            'search_source_type',
            'search_viewed',
            'search_bookmarked'
        ]),
        ...Vuex.mapGetters('watch', [
            'getSourcesBySourceType'
        ]),
        optionsSources() {
            return this.getSourcesBySourceType(this.search_source_type).map(x => ({value: x.slug, text: x.name}));
        }
    },
    methods: {
        ...Vuex.mapActions('watch', [
            'loadTags',
            'updateSearchParams'
        ]),
        onInputSearch: _.debounce(function(event, field) {
            let search = {
                search_text: this.search_text, 
                search_tags: this.search_tags,
                search_source_type: this.search_source_type,
                search_viewed: this.search_viewed,
                search_bookmarked: this.search_bookmarked
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