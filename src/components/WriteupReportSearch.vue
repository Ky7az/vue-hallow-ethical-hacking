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
                    v-for="option in optionsWebsites"
                    :key="option.value"
                >
                    <input
                        :id="option.value"
                        class="form-check-input"
                        type="checkbox"
                        :value="option.value"
                        v-model="checked_websites"
                    />
                    <label :for="option.value" class="form-check-label"
                        ><span>{{ option.text }}</span></label
                    >
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
                    <div class="col" align="right">
                        <div
                            class="form-check form-check-inline"
                            v-for="option in optionsTaskTypes"
                            :key="option.value"
                        >
                            <input
                                :id="option.value"
                                class="form-check-input"
                                type="checkbox"
                                :value="option.value"
                                v-model="checked_task_types"
                            />
                            <label
                                :for="option.value"
                                class="form-check-label"
                                >{{ option.text }}</label
                            >
                        </div>
                    </div>
                    <div class="col" align="left">
                        <div
                            class="form-check form-check-inline"
                            v-for="option in optionsTaskPlatforms"
                            :key="option.value"
                        >
                            <input
                                :id="option.value"
                                class="form-check-input"
                                type="checkbox"
                                :value="option.value"
                                v-model="checked_task_platforms"
                            />
                            <label
                                :for="option.value"
                                class="form-check-label"
                                >{{ option.text }}</label
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import TagSearch from '@/components/TagSearch.vue';
import { useStore } from '@/store';
import { TokenService } from '@/storage/service';

const store = useStore();
const emit = defineEmits<{ 'updated-search': [] }>();

const optionsTaskTypes = [
    { value: 'bugbounty', text: 'Bug Bounty' },
    { value: 'ctf', text: 'Capture The Flag' },
];
const optionsTaskPlatforms = [
    { value: 'linux', text: 'Linux' },
    { value: 'windows', text: 'Windows' },
];
const checked_websites = ref<string[]>([]);
const checked_task_types = ref<string[]>([]);
const checked_task_platforms = ref<string[]>([]);

const tags = computed(() => store.state.writeup.tags);
const websites = computed(() => store.state.writeup.websites);
const search_text = computed(() => store.state.writeup.search_text);
const search_tags = computed(() => store.state.writeup.search_tags);
const search_websites = computed(() => store.state.writeup.search_websites);
const search_task_types = computed(() => store.state.writeup.search_task_types);
const search_task_platforms = computed(
    () => store.state.writeup.search_task_platforms,
);

const optionsWebsites = computed(() =>
    websites.value.map((x) => ({
        value: x.slug ?? String(x.id),
        text: x.name,
    })),
);

const onInputSearch = debounce((value: unknown, field: string) => {
    const search: Record<string, unknown> = {
        search_text: search_text.value,
        search_tags: search_tags.value,
        search_websites: search_websites.value,
        search_task_types: search_task_types.value,
        search_task_platforms: search_task_platforms.value,
    };
    search[field] = value;
    store.dispatch('writeup/updateSearchParams', search);
    emit('updated-search');
}, 300);

watch(checked_websites, (val) => onInputSearch(val, 'search_websites'));
watch(checked_task_types, (val) => onInputSearch(val, 'search_task_types'));
watch(checked_task_platforms, (val) =>
    onInputSearch(val, 'search_task_platforms'),
);

if (TokenService.getToken()) {
    store.dispatch('writeup/loadTags');
}
</script>
