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
                        v-for="option in optionsSourceTypes"
                        :key="option.value"
                >
                    <input :id="option.value" class="form-check-input" type="radio" name="source_type" :value="option.value" v-model="checked_source_type">
                    <label :for="option.value" class="form-check-label">{{option.text}}</label>
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
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col">
                        <div class="form-check form-switch form-check-inline">
                            <input class="form-check-input" type="checkbox" :checked="search_viewed" @input="onInputSearch($event.target.checked, 'search_viewed')">
                            <label class="form-check-label">Viewed</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-check form-switch form-check-inline">
                            <input class="form-check-input" type="checkbox" :checked="search_bookmarked" @input="onInputSearch($event.target.checked, 'search_bookmarked')">
                            <label class="form-check-label">Bookmarked</label>
                        </div>
                    </div>
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col"></div>
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
            ],
            checked_source_type: ""
        }
    },
    watch: {
        checked_source_type: function(val) {
            this.onInputSearch(val, 'search_source_type');
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
        onInputSearch: debounce(function(event, field) {
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