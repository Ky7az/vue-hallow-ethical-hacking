<template>
    <vue-tags-input
        v-model="search_by_tags"
        :tags="search_tags"
        :autocomplete-items="filteredItems"
        :add-only-from-autocomplete="true"
        @tags-changed="onChangeTags"
        placeholder=""
    />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import VueTagsInput from '@wslyhbb/vue3-tags-input';
import type { TagInputItem } from '@/types';

interface AnyTag {
    name: string;
    count?: number;
}

const props = defineProps<{
    all_tags: AnyTag[];
    search_tags: TagInputItem[];
}>();

const emit = defineEmits<{
    'updated-tag-search': [tags: TagInputItem[]];
}>();

const search_by_tags = ref('');

const getCriteria = computed(() => search_by_tags.value.trim().toLowerCase());

const autocompleteItems = computed(() =>
    props.all_tags.map((tag) => ({ text: tag.name, count: tag.count })),
);

const filteredItems = computed(() => {
    const criteria = getCriteria.value;
    const options = autocompleteItems.value;
    if (criteria) {
        return options.filter(
            (opt) => opt.text.toLowerCase().indexOf(criteria) > -1,
        );
    }
    return options;
});

function onChangeTags(newTags: TagInputItem[]) {
    emit('updated-tag-search', newTags);
}
</script>
