<template>
    <div class="writeup">
        <b-container fluid>
            <router-view></router-view>
        </b-container>
    </div>
</template>

<script>
import Vuex from 'vuex'

import { TokenService } from '../storage/service'

export default {
    name: 'Writeup',
    methods: {
        ...Vuex.mapActions('writeup', [
            'loadWebsites',
            'loadReports'
        ])
    },
    created() {
        if (TokenService.getToken()) {
            this.loadWebsites();
            this.loadReports();
        }
    }
}
</script>