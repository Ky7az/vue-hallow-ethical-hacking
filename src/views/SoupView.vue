<template>
    <div class="soup">
        <div class="container-fluid">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { TokenService } from '@/storage/service';

const store = useStore();

if (TokenService.getToken()) {
    store.dispatch('soup/loadArticles');
}
</script>
