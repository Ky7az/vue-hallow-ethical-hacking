<template>
    <div class="row justify-content-center" v-hotkey="mapKeys">
        <div class="col-6">
            <div class="btn-toolbar mb-3">
                <div class="mx-auto btn-group">
                    <button
                        title="Preview"
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="onClickTogglePreview"
                    >
                        <i class="bi-eye"></i>
                    </button>
                </div>
            </div>
            <div
                class="editor"
                v-html="processedMarkdown"
                v-if="preview == true"
            ></div>
            <slot class="editor" v-if="preview == false"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';
import { renderMarkdown } from '@/utils/markdown';

const props = defineProps<{ markdown?: string }>();
const preview = ref(true);

const mapKeys = computed(() => ({ 'ctrl+e': onClickTogglePreview }));

const processedMarkdown = computed(() => {
    return props.markdown ? renderMarkdown(props.markdown) : '';
});

async function onClickTogglePreview() {
    preview.value = !preview.value;
    if (!preview.value) {
        await nextTick();
        document.getElementById('textarea-md-editor')?.focus();
    }
}

onMounted(() => {
    hljs.highlightAll();
});

onUpdated(() => {
    nextTick(() => {
        hljs.highlightAll();
    });
});
</script>

<style scoped>
.editor {
    text-align: left;
    font-size: 13px;
}
</style>
