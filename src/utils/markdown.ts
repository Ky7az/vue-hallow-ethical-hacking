import { Marked } from 'marked';
import { gfmHeadingId, getHeadingList } from 'marked-gfm-heading-id';

/**
 * Dedicated Marked instance, configured once at module load.
 * Do not configure it from a component's <script setup>: that code runs on
 * every component instance and would stack extensions/hooks (duplicated TOC).
 */
const markdown = new Marked(
    { pedantic: false, gfm: true, breaks: true },
    gfmHeadingId({ prefix: 'heading-' }),
    {
        hooks: {
            postprocess(html: string) {
                const headings = getHeadingList();
                const stack: HTMLUListElement[] = [
                    document.createElement('ul'),
                ];
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
    },
);

export function renderMarkdown(md: string): string {
    return markdown.parse(md) as string;
}
