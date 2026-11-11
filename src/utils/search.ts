import { debounce } from 'lodash-es';

// Debounce search updates while merging every field changed during the wait,
// so quick successive changes on different fields are not lost (a plain
// debounce only keeps the arguments of the last call).
export function debouncedSearch<T extends object>(
    apply: (changes: Partial<T>) => void,
    wait = 300,
) {
    let pending: Partial<T> = {};
    const flush = debounce(() => {
        const changes = pending;
        pending = {};
        apply(changes);
    }, wait);
    return <K extends keyof T>(value: T[K], field: K) => {
        pending[field] = value;
        flush();
    };
}
