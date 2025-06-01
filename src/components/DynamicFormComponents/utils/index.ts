import { JSX_ATTRIBUTES, TAG_TO_ELEMENT_TAG } from "../constants";
import { FormFieldType, SelectFieldType } from "../types";

export function isSelectField(field: FormFieldType): field is SelectFieldType {
  return field.type === "select";
}

export function getValidJSXProps<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props: Record<string, any>,
  excludeKeys: string[] = [] // ← new parameter to blacklist certain keys
): Partial<Record<string, any>> {
  const el = document.createElement(TAG_TO_ELEMENT_TAG[tagName] || "div");
  const validAttributes = new Set<string>();

  for (const key in el) {
    validAttributes.add(key);
  }

  JSX_ATTRIBUTES?.forEach((attr) => validAttributes.add(attr));

  const isValidAttr = (attr: string) =>
    !excludeKeys.includes(attr) &&
    (validAttributes.has(attr) ||
      attr.startsWith("data-") ||
      attr.startsWith("aria-"));

  return Object.fromEntries(
    Object.entries(props).filter(([key]) => isValidAttr(key))
  );
}
