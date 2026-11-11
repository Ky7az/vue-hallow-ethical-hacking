<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <div class="input-group input-group-sm">
                    <div class="input-group-text">
                        <i class="bi-search orange"></i>
                    </div>
                    <input
                        type="search"
                        class="form-control form-control-sm"
                        :value="search_text"
                        @input="
                            onInputSearch(
                                ($event.target as HTMLInputElement).value,
                                'search_text',
                            )
                        "
                    />
                </div>
            </div>
            <div class="col"></div>
        </div>
        <div class="row mb-4">
            <div class="col">
                <div class="input-group input-group-sm">
                    <div class="input-group-text">
                        <i class="bi-tag-fill orange"></i>
                    </div>
                    <TagSearch
                        :all_tags="tags"
                        :search_tags="search_tags"
                        @updated-tag-search="
                            onInputSearch($event, 'search_tags')
                        "
                    />
                </div>
            </div>
            <div class="col">
                <div class="col">
                    <div class="form-check form-switch form-check-inline">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :checked="search_bookmarked ?? false"
                            @input="
                                onInputSearch(
                                    ($event.target as HTMLInputElement).checked,
                                    'search_bookmarked',
                                )
                            "
                        />
                        <label class="form-check-label">Bookmarked</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { debounce } from 'lodash-es';
import TagSearch from '@/components/TagSearch.vue';
import { useStore } from '@/store';
import { TokenService } from '@/storage/service';

const store = useStore();
const emit = defineEmits<{ 'updated-search': [] }>();

const tags = computed(() => store.state.soup.tags);
const search_text = computed(() => store.state.soup.search_text);
const search_tags = computed(() => store.state.soup.search_tags);
const search_bookmarked = computed(() => store.state.soup.search_bookmarked);

const onInputSearch = debounce((value: unknown, field: string) => {
    const search: Record<string, unknown> = {
        search_text: search_text.value,
        search_tags: search_tags.value,
        search_bookmarked: search_bookmarked.value,
    };
    search[field] = value;
    store.dispatch('soup/updateSearchParams', search);
    emit('updated-search');
}, 300);

if (TokenService.getToken()) {
    store.dispatch('soup/loadTags');
}
</script>
