<template>
    <div class="soup">
        <div class="container-fluid">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import Vuex from 'vuex';

import { TokenService } from '../storage/service';

export default {
    name: 'SoupView',
    methods: {
        ...Vuex.mapActions('soup', ['loadArticles']),
    },
    created() {
        if (TokenService.getToken()) {
            this.loadArticles();
        }
    },
};
</script>
