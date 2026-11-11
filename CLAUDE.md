# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start dev server (Vite, --host flag, http://localhost:5173)
yarn build      # Type check (vue-tsc) + production build
yarn typecheck  # vue-tsc --noEmit only
yarn lint       # ESLint with --fix
yarn preview    # Preview production build
```

No test framework is configured.

## Architecture

**Hallow** is a Vue 3 SPA for security professionals, pairing with a Django backend (`django-hallow-ethical-hacking`). It has four modules: **Soup** (knowledge base), **Watch** (RSS/news feeds), **Pentest** (task/target/credential management), **Writeup** (report generation).

### Routing

Hash-based routing (`createWebHashHistory`). Each route has a `title` meta field used in `router.afterEach()` to update `document.title`.

```
/soup  → articles (list / :slug / new)
/watch → feeds and content (list / new)
/pentest → tasks, targets, credentials (list / :id / new)
/writeup → reports (list / :slug / new)
```

### State Management

Pinia, one options-style store per module in `src/stores/*.ts`: `useSoupStore`, `useWatchStore`, `usePentestStore`, `useWriteupStore`. All API calls go through store actions (no mutations: actions assign state directly). The `pentest` store is the most complex — it manages attackers, targets, target_services, credentials, parameters, phases, vulnerabilities, tools, actions, and tasks with multi-parameter getter filters like `getActionsByPhaseAndServiceAndVulnerabilityAndTool`.

### API Integration

- Base: `PROTO://API_HOST/api/{module}/{resource}/`
- Default host: `127.0.0.1`, configured in `src/storage/service.ts`
- HTTPS in production, HTTP in dev (keyed on `import.meta.env.MODE`)
- Auth: `Authorization: Token <user-token>`, token stored in `localStorage`
- `src/storage/service.ts` exports `TokenService` (get/set/remove) and `AxiosConfig` (auth header)

### Component Patterns

Written in **TypeScript** (`strict`). All components use `<script setup lang="ts">` (Composition API).

- Store access: `const pentestStore = usePentestStore()` from `@/stores/pentest`; state, getters and actions are fully typed (`pentestStore.targets`, `pentestStore.getTargetById(id)`, `pentestStore.createTarget(data)`). Create/update payloads are typed `ApiPayload` (`src/types/index.ts`) since they use serializer write fields (e.g. `source_id`).
- Shared API types live in `src/types/index.ts`; mirror the Django serializer field names exactly (dates are `create_date` / `write_date`). Untyped third-party libs are shimmed in `src/types/shims.d.ts`.
- No global side effects at the top level of `<script setup>` (e.g. `marked.use(...)`): that code runs on every component instance. Put one-time setup in a module under `src/utils/` (see `renderMarkdown` in `@/utils/markdown`).
- Read form fields with `formValue(form, name)` from `@/utils/form`, not `form.<name>` (collides with built-in `HTMLFormElement` properties).

- **List components**: Vueginate for pagination, AbortController to cancel in-flight requests on new searches, emit updated-search events upward
- **Create/edit components**: `@submit.prevent`, VueTagsInput for tags, MarkdownEditor for content, slugify for URL slugs, redirect to detail on success
- **Open/detail components**: receive route param (`:slug` or `:id`), use a store getter to locate item
- **Search resets pagination**: any filter change resets `selected_page` to 1

### Authentication

Modal-based login (LoginModal.vue). Token stored in localStorage. `router.go(0)` triggers a full page refresh on login/logout.

### Styling

Bootstrap 5 with dark theme (`data-bs-theme="dark"` on `<html>`). Custom accent colors (`#f55151`, `#f5b351`) and vue-tags-input overrides are in `App.vue` global styles. Path alias `@` → `./src`.

### Key Libraries

| Library | Use |
|---|---|
| `marked` + `marked-gfm-heading-id` | Markdown parsing with GFM heading anchors |
| `highlight.js` | Code block syntax highlighting |
| `ansi-to-html` + `strip-ansi` | Terminal output rendering |
| `vue-timeago3` | Relative timestamps with auto-update |
| `v-hotkey3` | Keyboard shortcuts |
| `slugify` | URL slug generation |
| `vueginate` | Pagination component |

<!-- rtk-instructions v2 -->
# Command output

Command output here is condensed to save tokens, keeping every signal and
dropping costly noise. Treat it as the complete result: run commands
normally, and batch related commands into one call to avoid extra turns.
Truncated results state their recovery path in their own output. Re-run a
command as `rtk bypass <cmd>` only when its result is unusable: empty when
output was clearly expected, contradicting its exit code, or garbled.
<!-- /rtk-instructions -->