<template>
    <b-row align-h="center" v-hotkey="keymap">
        <b-col cols="6">
            <b-button-toolbar class="mb-3">
                <b-button-group class="mx-auto">
                    <b-button title="Preview" variant="outline-secondary" @click="onClickTogglePreview">
                        <b-icon icon="eye" size="sm"></b-icon>
                    </b-button>
                </b-button-group>
            </b-button-toolbar>
            <div class="toc" v-html="tableOfContents" v-if="preview == true"></div>
            <div class="editor" v-html="processedMarkdown" v-if="preview == true"></div>
            <slot class="editor" v-if="preview == false"></slot>
        </b-col>
    </b-row>
</template>

<script>
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';

export default {
    name: 'MarkdownEditor',
    props: {
        markdown: String
    },
    data() {
        return {
            preview: true
        }
    },
    computed: {
        keymap() {
            return {
                "ctrl+e": this.onClickTogglePreview
            };
        },
        processedMarkdown() {
            if (this.markdown) {
                return marked(this.markdown, {
                    highlight(md) {
                        return hljs.highlightAuto(md).value
                    }
                });
            }
        },
        tableOfContents() {
            const stack = [document.createElement('ul')];
            for (const heading of marked.lexer(this.markdown).filter(x => x.type === 'heading')) {
                if (heading.depth < stack.length) {
                    stack.length = heading.depth;
                } else {
                    while (heading.depth > stack.length) {
                        const ul = document.createElement('ul');
                        stack.at(-1).append(ul);
                        stack.push(ul);
                    }
                }
                const prefix = marked.getDefaults().headerPrefix || '';
                const anchor = prefix + heading.text.toLowerCase().replaceAll(' ', '-').replace(/[^a-z0-9 -]/g, '');
                stack.at(-1).insertAdjacentHTML('beforeend', `<li><a href="#${anchor}">${heading.text}</a></li>`);
            }
            return stack[0].outerHTML;
        }
    },
    methods: {
        onClickTogglePreview() {
            this.preview = !this.preview;
        }
    },
    mounted() {
        hljs.highlightAll();
    },
    updated() {
        this.$nextTick(function() {
            hljs.highlightAll();
        })
    }
}
</script>

<style scoped>

.toc {
    font-size: 13px;
    text-align: left;
}
.editor {
    font-size: 13px;
    text-align: left;
}

</style>