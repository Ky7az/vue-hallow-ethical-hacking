<template>
    <div class="watch">
        <div class="container-fluid">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWatchStore } from '@/stores/watch';
import { TokenService } from '@/storage/service';

const watchStore = useWatchStore();

if (TokenService.getToken()) {
    watchStore.loadSources();
    watchStore.loadFeeds();
    watchStore.loadContents();
}
</script>
