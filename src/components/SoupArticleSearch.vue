<template>
    <div>
        <b-row class="mb-2">
            <b-col>
                <b-input-group size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="search" class="orange"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input type="search" size="sm" :value="search_text" @input="onInputSearch($event, 'search_text')"></b-form-input>
                </b-input-group>
            </b-col>
            <b-col>
            </b-col>
        </b-row> 
        <b-row class="mb-4">
            <b-col>
                <TagSearch :tags="tags" :search_tags="search_tags" @updated-tag-search="onInputSearch($event, 'search_tags')"/>
            </b-col>
            <b-col>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'
import _ from 'lodash'

import { TokenService } from '../storage/service'

import TagSearch from '@/components/TagSearch'

export default {
    name: 'SoupArticleSearch',
    components: {
        TagSearch
    },
    data() {
        return {
        }
    },
    computed: {
        ...Vuex.mapState('soup', [
            'tags',
            'search_text',
            'search_tags'
        ])
    },
    methods: {
        ...Vuex.mapActions('soup', [
            'loadTags',
            'updateSearchParams'
        ]),
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
        if (TokenService.getToken()) {
            this.loadTags();
        }
    }
}
</script>