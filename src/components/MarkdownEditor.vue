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

<script>
import { nextTick } from 'vue';
import { marked } from 'marked';
import { gfmHeadingId, getHeadingList } from 'marked-gfm-heading-id';
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';

marked.use({
    pedantic: false,
    gfm: true,
    breaks: false,
});

marked.use(gfmHeadingId({ prefix: 'heading-' }), {
    hooks: {
        postprocess(html) {
            const headings = getHeadingList();
            const stack = [document.createElement('ul')];
            for (const heading of headings) {
                if (heading.level < stack.length) {
                    stack.length = heading.level;
                } else {
                    while (heading.level > stack.length) {
                        const ul = document.createElement('ul');
                        stack.at(-1).append(ul);
                        stack.push(ul);
                    }
                }
                stack
                    .at(-1)
                    .insertAdjacentHTML(
                        'beforeend',
                        `<li><a href="javascript:document.getElementById('${heading.id}').scrollIntoView()">${heading.raw}</a></li>`,
                    );
            }
            return `<div class="toc">${stack[0].outerHTML}</div><div class="editor">${html}</div>`;
        },
    },
});

export default {
    name: 'MarkdownEditor',
    props: {
        markdown: String,
    },
    data() {
        return {
            preview: true,
        };
    },
    computed: {
        mapKeys() {
            return {
                'ctrl+e': this.onClickTogglePreview,
            };
        },
        processedMarkdown() {
            if (this.markdown) {
                return marked.parse(this.markdown, {
                    highlight(md) {
                        return hljs.highlightAuto(md).value;
                    },
                });
            }
            return '';
        },
    },
    methods: {
        async onClickTogglePreview() {
            this.preview = !this.preview;
            if (this.preview == false) {
                await nextTick();
                document.getElementById('textarea-md-editor').focus();
            }
        },
    },
    mounted() {
        hljs.highlightAll();
    },
    updated() {
        nextTick(function () {
            hljs.highlightAll();
        });
    },
};
</script>

<style scoped>
.editor {
    text-align: left;
    font-size: 13px;
}
</style>
