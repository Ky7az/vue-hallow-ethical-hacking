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

<script>
import VueTagsInput from '@wslyhbb/vue3-tags-input'

export default {
    name: 'TagSearch',
    components: {
        VueTagsInput
    },
    props: {
        all_tags: Array,
        search_tags: Array
    },
    data() {
        return {
            search_by_tags: ''
        }
    },
    computed: {
        getCriteria() {
            return this.search_by_tags.trim().toLowerCase();
        },
        autocompleteItems() {
            const options = this.all_tags.map(tag => ({text: tag.name, count: tag.count}));
            return options;
        },
        filteredItems() {
            const criteria = this.getCriteria;
            const options = this.autocompleteItems;
            if (criteria) {
                return options.filter(opt => opt.text.toLowerCase().indexOf(criteria) > -1);
            }
            return options;
        }
    },
    methods: {
        onChangeTags(newTags) {
            this.tags = newTags;
            this.$emit('updated-tag-search', newTags);
        }
    }
}
</script>