<template>
    <div>
        <b-row>
            <b-col>
                <b-button to="/watch">Back</b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="m-4">
                <b-table-simple>
                    <b-thead>
                        <b-tr>
                            <b-th>Source</b-th>
                            <b-th>Tags</b-th>
                            <b-th>Updated</b-th>
                            <b-th>Count</b-th>
                            <b-th></b-th>
                        </b-tr>
                    </b-thead>
                    <b-tbody v-if="feeds.length">
                        <b-tr v-for="feedDetail in feeds" :key="feedDetail.id">
                            <b-td>{{ feedDetail.source.name }}</b-td>
                            <b-td>{{ feedDetail.tag_names }}</b-td>
                            <b-td><timeago :datetime="feedDetail.write_date" :auto-update="60"></timeago></b-td>
                            <b-td>{{ feedDetail.count }}</b-td>
                            <b-td>
                                <b-icon icon="x-square" title="Delete" class="orange" @click="onClickFeedDelete(feedDetail)"></b-icon>
                            </b-td>
                        </b-tr>
                    </b-tbody>
                </b-table-simple>
            </b-col>
        </b-row>
        <b-row>
            <b-col class="ml-4">
                <b-form-select v-model="form_source" :options="optionsSources"></b-form-select>
            </b-col>
            <b-col>
                <b-form-tags v-model="form_tags" @tag-state="onTagState"></b-form-tags>
            </b-col>
            <b-col align="left">
                <input class="btn-sm btn-primary" value="Create" type="submit" @click="onClickFeedCreate()"/>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Vuex from 'vuex'
import slugify from 'slugify';

import { TokenService } from '../storage/service'

export default {
    name: 'WatchFeedList',
    data() {
        return {
            form_source: null,
            form_tags: [],
            valid_tags: [],
            invalid_tags: [],
            duplicate_tags: []
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
        onTagState(valid, invalid, duplicate) {
            this.valid_tags = valid;
            this.invalid_tags = invalid;
            this.duplicate_tags = duplicate;
        },
        onClickFeedDelete(feedDetail) {
            var is_ok = confirm("Delete Feed ?");
            if (is_ok) {
                this.deleteFeed(feedDetail);
            };
        },
        onClickFeedCreate() {
            var data = {
                source_id: this.form_source,
                tags: this.form_tags.map(tag => ({name: tag, slug: slugify(tag, {'replacement': '-', 'lower': true})}))
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