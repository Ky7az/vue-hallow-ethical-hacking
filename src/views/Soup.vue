<template>
    <div class="soup">
        <b-container fluid>
            <router-view></router-view>
        </b-container>
    </div>
</template>

<script>
import Vuex from 'vuex'

export default {
    name: 'Soup',
    methods: {
        ...Vuex.mapActions('soup', [
            'loadArticles'
        ])
    },
    created() {
        this.loadArticles();
    }
}
</script>

<style>
.orange {
    color: #f55151;
}
</style>