<template>
    <div class="writeup">
        <div class="container-fluid">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWriteupStore } from '@/stores/writeup';
import { TokenService } from '@/storage/service';

const writeupStore = useWriteupStore();

if (TokenService.getToken()) {
    writeupStore.loadWebsites();
    writeupStore.loadReports();
}
</script>
