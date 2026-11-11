<template>
    <div class="soup">
        <div class="container-fluid">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSoupStore } from '@/stores/soup';
import { TokenService } from '@/storage/service';

const soupStore = useSoupStore();

if (TokenService.getToken()) {
    soupStore.loadArticles();
}
</script>
