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
                <div class="col">
                    <div class="form-check form-switch form-check-inline">
                        <input class="form-check-input" type="checkbox" :checked="search_bookmarked" @input="onInputSearch($event.target.checked, 'search_bookmarked')">
                        <label class="form-check-label">Bookmarked</label>
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
            'search_tags',
            'search_bookmarked'
        ])
    },
    methods: {
        ...Vuex.mapActions('soup', [
            'loadTags',
            'updateSearchParams'
        ]),
        onInputSearch: debounce(function(event, field) {
            let search = {
                search_text: this.search_text, 
                search_tags: this.search_tags,
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