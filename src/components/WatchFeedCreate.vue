<template>
    <div>
        <div class="row">
            <div class="col">
                <router-link class="btn btn-secondary" to="/watch">Back</router-link>
            </div>
        </div>
        <div class="row">
            <div class="col m-4">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Tags</th>
                            <th>Updated</th>
                            <th>Count</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody v-if="feeds.length">
                        <tr v-for="feedDetail in feeds" :key="feedDetail.id">
                            <td>{{ feedDetail.source.name }}</td>
                            <td>{{ feedDetail.tag_names }}</td>
                            <td><timeago :datetime="feedDetail.write_date" :auto-update="60"></timeago></td>
                            <td>{{ feedDetail.count }}</td>
                            <td>
                                <i class="bi-x-square orange" title="Delete" @click="onClickFeedDelete(feedDetail)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col ml-4">
                <select class="form-select form-select-sm" v-model="form_source">
                    <option v-for="option in optionsSources" :value="option.value" :key="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>
            <div class="col">
                <vue-tags-input
                    v-model="tag"
                    :tags="form_tags"
                    @tags-changed="newTags => form_tags = newTags"
                />
            </div>
            <div class="col" align="left">
                <input class="btn btn-primary btn-sm" value="Create" type="submit" @click="onClickFeedCreate()"/>
            </div>
        </div>
    </div>
</template>

<script>
import Vuex from 'vuex'
import slugify from 'slugify'

import { TokenService } from '../storage/service'
import VueTagsInput from '@wslyhbb/vue3-tags-input'

export default {
    name: 'WatchFeedList',
    components: {
        VueTagsInput
    },
    data() {
        return {
            form_source: null,
            tag: "",
            form_tags: []
        }
    },
    computed: {
        ...Vuex.mapState('watch', [
            'feeds',
            'sources'
        ]),
        optionsSources() {
            return this.sources.map(x => ({value: x.id, text: x.name}));
        }
    },
    methods: {
        ...Vuex.mapActions('watch', [
            'loadFeeds',
            'createFeed',
            'deleteFeed'
        ]),
        onClickFeedDelete(feedDetail) {
            var is_ok = confirm("Delete Feed ?");
            if (is_ok) {
                this.deleteFeed(feedDetail);
            };
        },
        onClickFeedCreate() {
            var data = {
                source_id: this.form_source,
                tags: this.form_tags.map(tag => ({name: tag.text, slug: slugify(tag.text, {'replacement': '-', 'lower': true})}))
            }
            this.createFeed(data).then(() => {
                this.form_source = null;
                this.form_tags = [];
            });
        }
    },
    created() {
        if (TokenService.getToken()) {
            this.loadFeeds();
        }
    }
}
</script>