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
import { marked } from 'marked';
import { gfmHeadingId, getHeadingList } from 'marked-gfm-heading-id';
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';

marked.use({ pedantic: false, gfm: true, breaks: false });

marked.use(gfmHeadingId({ prefix: 'heading-' }), {
    hooks: {
        postprocess(html: string) {
            const headings = getHeadingList();
            const stack: HTMLUListElement[] = [document.createElement('ul')];
            for (const heading of headings) {
                if (heading.level < stack.length) {
                    stack.length = heading.level;
                } else {
                    while (heading.level > stack.length) {
                        const ul = document.createElement('ul');
                        stack.at(-1)!.append(ul);
                        stack.push(ul);
                    }
                }
                stack
                    .at(-1)!
                    .insertAdjacentHTML(
                        'beforeend',
                        `<li><a href="javascript:document.getElementById('${heading.id}').scrollIntoView()">${heading.raw}</a></li>`,
                    );
            }
            return `<div class="toc">${stack[0].outerHTML}</div><div class="editor">${html}</div>`;
        },
    },
});

const props = defineProps<{ markdown?: string }>();
const preview = ref(true);

const mapKeys = computed(() => ({ 'ctrl+e': onClickTogglePreview }));

const processedMarkdown = computed(() => {
    if (props.markdown) {
        return marked.parse(props.markdown) as string;
    }
    return '';
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
