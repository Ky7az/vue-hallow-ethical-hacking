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
            <div class="col">
                <div
                    class="form-check form-check-inline"
                    v-for="option in optionsSourceTypes"
                    :key="option.value"
                >
                    <input
                        :id="option.value"
                        class="form-check-input"
                        type="radio"
                        name="source_type"
                        :value="option.value"
                        v-model="checked_source_type"
                    />
                    <label :for="option.value" class="form-check-label">{{
                        option.text
                    }}</label>
                </div>
            </div>
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
                <div class="row">
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col">
                        <div class="form-check form-switch form-check-inline">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :checked="search_viewed"
                                @input="
                                    onInputSearch(
                                        ($event.target as HTMLInputElement)
                                            .checked,
                                        'search_viewed',
                                    )
                                "
                            />
                            <label class="form-check-label">Viewed</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-check form-switch form-check-inline">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :checked="search_bookmarked"
                                @input="
                                    onInputSearch(
                                        ($event.target as HTMLInputElement)
                                            .checked,
                                        'search_bookmarked',
                                    )
                                "
                            />
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import TagSearch from '@/components/TagSearch.vue';
import { useWatchStore, type SearchPayload } from '@/stores/watch';
import { TokenService } from '@/storage/service';

const watchStore = useWatchStore();
const emit = defineEmits<{ 'updated-search': [] }>();

const optionsSourceTypes = [
    { value: 'exploit', text: 'Exploit' },
    { value: 'security', text: 'Security' },
    { value: 'technology', text: 'Technology' },
    { value: 'vulnerability', text: 'Vulnerability' },
];
const checked_source_type = ref('');

const tags = computed(() => watchStore.tags);
const search_text = computed(() => watchStore.search_text);
const search_tags = computed(() => watchStore.search_tags);
const search_source_type = computed(() => watchStore.search_source_type);
const search_viewed = computed(() => watchStore.search_viewed);
const search_bookmarked = computed(() => watchStore.search_bookmarked);

const onInputSearch = debounce((value: unknown, field: string) => {
    const search: SearchPayload = {
        search_text: search_text.value,
        search_tags: search_tags.value,
        search_source_type: search_source_type.value,
        search_viewed: search_viewed.value,
        search_bookmarked: search_bookmarked.value,
    };
    Object.assign(search, { [field]: value });
    watchStore.updateSearchParams(search);
    emit('updated-search');
}, 300);

watch(checked_source_type, (val) => {
    onInputSearch(val, 'search_source_type');
});

if (TokenService.getToken()) {
    watchStore.loadTags();
}
</script>
