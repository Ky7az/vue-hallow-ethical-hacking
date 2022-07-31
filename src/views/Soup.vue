<template>
    <div class="soup">
        <b-container fluid>
            <router-view></router-view>
        </b-container>
    </div>
</template>

<script>
import Vuex from 'vuex'

import { TokenService } from '../storage/service'

export default {
    name: 'Soup',
    methods: {
        ...Vuex.mapActions('soup', [
            'loadArticles'
        ])
    },
    created() {
        if (TokenService.getToken()) {
            this.loadArticles();
        }
    }
}
</script>