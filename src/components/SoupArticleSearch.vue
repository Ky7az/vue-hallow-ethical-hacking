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
import { useSoupStore, type SearchPayload } from '@/stores/soup';
import { TokenService } from '@/storage/service';

const soupStore = useSoupStore();
const emit = defineEmits<{ 'updated-search': [] }>();

const tags = computed(() => soupStore.tags);
const search_text = computed(() => soupStore.search_text);
const search_tags = computed(() => soupStore.search_tags);
const search_bookmarked = computed(() => soupStore.search_bookmarked);

const onInputSearch = debounce((value: unknown, field: string) => {
    const search: SearchPayload = {
        search_text: search_text.value,
        search_tags: search_tags.value,
        search_bookmarked: search_bookmarked.value,
    };
    Object.assign(search, { [field]: value });
    soupStore.updateSearchParams(search);
    emit('updated-search');
}, 300);

if (TokenService.getToken()) {
    soupStore.loadTags();
}
</script>
