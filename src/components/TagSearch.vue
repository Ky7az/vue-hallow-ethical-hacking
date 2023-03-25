<template>
    <b-form-tags size="sm" :value="search_tags" @input="onInputTagSearch($event)" no-outer-focus>
    <template v-slot="{ tags, disabled, addTag, removeTag }">
        <ul v-if="tags.length > 0" class="list-inline d-inline-block">
            <li v-for="tag in tags" :key="tag" class="list-inline-item">
            <b-form-tag
                @remove="removeTag(tag)"
                :title="tag"
                :disabled="disabled"
                variant="danger">
            {{ tag }}</b-form-tag>
            </li>
        </ul>
        <b-dropdown size="sm" variant="outline-secondary" block menu-class="w-100">
            <template #button-content>
                <b-icon icon="tag-fill" class="orange"></b-icon>
            </template>
            <b-dropdown-form @submit.stop.prevent="() => {}">
                <b-form-group
                    label=""
                    label-for="tag-search-input"
                    label-cols-md="auto"
                    class="mb-0"
                    label-size="sm"
                    :description="searchDesc"
                    :disabled="disabled">
                    <b-form-input v-model="search_by_tags" id="tag-search-input" type="search" size="sm" autocomplete="off"></b-form-input>
                </b-form-group>
            </b-dropdown-form>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button
                v-for="option in availableOptions"
                :key="option"
                @click="onClickOption({ option, addTag })">
                {{ option }}
            </b-dropdown-item-button>
            <b-dropdown-text v-if="availableOptions.length === 0">
            There are no tags available to select
            </b-dropdown-text>
        </b-dropdown>
    </template>
</b-form-tags>
</template>

<script>

export default {
    name: 'TagSearch',
    props: {
        tags: Array,
        search_tags: Array
    },
    data() {
        return {
            search_by_tags: ''
        }
    },
    computed: {
        options() {
            const options = this.tags.map(tag => tag.name + ' (' + tag.count.toString() + ')');
            options.sort();
            return options;
        },
        criteria() {
            // Compute the search criteria
            return this.search_by_tags.trim().toLowerCase();
        },
        availableOptions() {
            const criteria = this.criteria;
            // Filter out already selected options
            const options = this.options.filter(opt => this.search_tags.indexOf(opt) === -1);
            if (criteria) {
            // Show only options that match criteria
            return options.filter(opt => opt.toLowerCase().indexOf(criteria) > -1);
            }
            // Show all options available
            return options;
        },
        searchDesc() {
            if (this.criteria && this.availableOptions.length === 0) {
                return 'There are no tags matching your search criteria';
            }
            return '';
        }
    },
    methods: {
        onClickOption({ option, addTag }) {
            addTag(option.split(' (')[0]);
            this.search_by_tags = '';
        },
        onInputTagSearch(event) {
            this.$emit('updated-tag-search', event);
        }
    }
}
</script>