<template>
    <b-row align-h="center">
        <b-col cols="4">
            <b-button-toolbar class="mb-3">
                <b-button-group class="mx-auto">
                    <b-button title="Preview" variant="outline-secondary" @click="togglePreview()">
                        <b-icon icon="eye" size="sm"></b-icon>
                    </b-button>
                </b-button-group>
            </b-button-toolbar>
            <div class="editor" v-html="processedMarkdown" v-if="preview == true"></div>
            <slot class="editor" v-if="preview == false"></slot>
        </b-col>
    </b-row>
</template>

<script>
import marked from 'marked';
import highlight from 'highlight.js';

import 'highlight.js/styles/solarized-dark.css';

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
        processedMarkdown() {
            if (this.markdown) {
                return marked(this.markdown, {
                    highlight(md) {
                        return highlight.highlightAuto(md).value
                    }
                });
            }
        }
    },
    methods: {
        togglePreview() {
            this.preview = !this.preview;
            this.$emit('previewed-markdown', this.preview);
        },
    }
}
</script>

<style scoped>

.editor {
    font-size: 13px;
    text-align: left;
}

</style>
