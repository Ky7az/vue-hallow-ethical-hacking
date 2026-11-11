<template>
    <div>
        <div class="row">
            <div class="col">
                <router-link class="btn btn-secondary" to="/watch"
                    >Back</router-link
                >
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
                            <td>
                                <timeago
                                    :datetime="feedDetail.write_date"
                                    :auto-update="60"
                                ></timeago>
                            </td>
                            <td>{{ feedDetail.count }}</td>
                            <td>
                                <i
                                    class="bi-x-square orange"
                                    title="Delete"
                                    @click="onClickFeedDelete(feedDetail)"
                                ></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col ml-4">
                <select
                    class="form-select form-select-sm"
                    v-model="form_source"
                >
                    <option
                        v-for="option in optionsSources"
                        :value="option.value"
                        :key="option.value"
                    >
                        {{ option.text }}
                    </option>
                </select>
            </div>
            <div class="col">
                <vue-tags-input
                    v-model="tag"
                    :tags="form_tags"
                    @tags-changed="onFormTagsChanged"
                />
            </div>
            <div class="col" align="left">
                <input
                    class="btn btn-primary btn-sm"
                    value="Create"
                    type="submit"
                    @click="onClickFeedCreate()"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import slugify from 'slugify';
import VueTagsInput from '@wslyhbb/vue3-tags-input';
import { useStore } from '@/store';
import { TokenService } from '@/storage/service';
import type { Feed, TagInputItem } from '@/types';

const store = useStore();

const form_source = ref<number | null>(null);
const tag = ref('');
const form_tags = ref<TagInputItem[]>([]);

const feeds = computed(() => store.state.watch.feeds);
const sources = computed(() => store.state.watch.sources);

const optionsSources = computed(() =>
    sources.value.map((x) => ({ value: x.id, text: x.name })),
);

function onFormTagsChanged(newTags: TagInputItem[]) {
    form_tags.value = newTags;
}

function onClickFeedDelete(feedDetail: Feed) {
    if (confirm('Delete Feed ?')) {
        store.dispatch('watch/deleteFeed', feedDetail);
    }
}

function onClickFeedCreate() {
    const data = {
        source_id: form_source.value,
        tags: form_tags.value.map((t) => ({
            name: t.text,
            slug: slugify(t.text, { replacement: '-', lower: true }),
        })),
    };
    store.dispatch('watch/createFeed', data).then(() => {
        form_source.value = null;
        form_tags.value = [];
    });
}

if (TokenService.getToken()) {
    store.dispatch('watch/loadFeeds');
}
</script>
