<template>
    <div class="watch">
        <b-container fluid>
            <router-view></router-view>
        </b-container>
    </div>
</template>

<script>
import Vuex from 'vuex'

import { TokenService } from '../storage/service'

export default {
    name: 'Watch',
    methods: {
        ...Vuex.mapActions('watch', [
            'loadSources',
            'loadFeeds',
            'loadContents'
        ])
    },
    created() {
        if (TokenService.getToken()) {
            this.loadSources();
            this.loadFeeds();
            this.loadContents();
        }
    }
}
</script>

<style>
</style>