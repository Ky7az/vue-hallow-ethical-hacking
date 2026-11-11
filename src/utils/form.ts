type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Read a named field's value from a form.
 * Uses `elements.namedItem` because direct property access (e.g. `form.name`)
 * collides with built-in HTMLFormElement properties.
 */
export function formValue(form: HTMLFormElement, name: string): string {
    const field = form.elements.namedItem(name) as FieldElement | null;
    if (!field) {
        throw new Error(`Form field "${name}" not found`);
    }
    return field.value;
}
