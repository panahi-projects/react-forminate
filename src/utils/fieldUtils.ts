import { JSX_ATTRIBUTES, TAG_TO_ELEMENT_TAG } from "@/constants";
import {
  FieldPropFunction,
  FieldPropFunctionReturnParams,
  FieldPropValue,
  FieldTypes,
  FormDataCollectionType,
  FormFieldType,
  SelectFieldType,
  SupportedTypes,
} from "@/types";
import { processFieldProps } from "./formUtils";

export const fallbackValue: { [key: string]: unknown } = {
  checkbox: [],
  number: 0,
  tel: "",
  text: "",
  email: "",
  url: "",
  password: "",
  search: "",
  date: "",
  radio: "",
  select: "",
  textarea: "",
  gridview: [],
  container: {},
  spacer: "",
  group: [],
  // Add other field types as needed
};

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

export const getPropValue = <P>(
  prop: FieldPropValue<P>,
  functionParams: FieldPropFunctionReturnParams,
  defaultValue?: P
): P => {
  if (
    prop &&
    typeof prop === "object" &&
    "fn" in prop &&
    typeof prop.fn === "function"
  ) {
    try {
      return (prop.fn as FieldPropFunction<P>)({
        fieldId: functionParams?.fieldId,
        values: functionParams?.values,
        fieldSchema: functionParams.fieldSchema, //getFieldSchema(functionParams?.fieldId),
        formSchema: functionParams?.formSchema,
      });
    } catch (error) {
      console.error("Error in field prop function:", error);
      return defaultValue as P;
    }
  }
  // If prop is a function, call it with the provided parameters
  if (typeof prop === "function") {
    try {
      return (prop as FieldPropFunction<P>)({ ...functionParams });
    } catch (error) {
      console.error("Error in field prop function:", error);
      return defaultValue as P;
    }
  }
  return prop !== undefined ? (prop as P) : (defaultValue as P);
}; // Function to evaluate field prop values, handling functions and defaults

export const findFieldById = (
  fieldId: string,
  fields: FormFieldType[] = [],
  values: Record<string, SupportedTypes> = {},
  formSchema?: FormDataCollectionType
): FormFieldType | null => {
  for (const field of fields) {
    if (field.fieldId === fieldId) {
      return field;
    }
    if (field.fields && field.fields.length > 0) {
      const found = findFieldById(fieldId, field.fields, values, formSchema);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

export const findProcessedFieldById = (
  fieldId: string,
  fields: FormFieldType[] = [],
  values: Record<string, SupportedTypes> = {},
  formSchema?: FormDataCollectionType
): FormFieldType | null => {
  for (const field of fields) {
    if (field.fieldId === fieldId) {
      const processedField = processFieldProps(
        field,
        fieldId,
        values,
        formSchema as FormDataCollectionType
      );
      if (processedField) return processedField;
    }
    if (field.fields && field.fields.length > 0) {
      const found = findProcessedFieldById(
        fieldId,
        field.fields,
        values,
        formSchema
      );
      if (found) {
        return found;
      }
    }
  }
  return null;
};

export const extractFieldTypes = (
  formSchema: FormDataCollectionType
): FieldTypes[] => {
  if (!formSchema?.fields) return []; // Handle undefined/null

  const types = new Set<FieldTypes>();

  // Iterative stack-based approach avoids recursion limits
  const stack = [...formSchema.fields];

  while (stack.length) {
    const field = stack.pop()!;

    if (typeof field?.type === "string") {
      // Validate field shape
      types.add(field.type);
      if (Array.isArray(field.fields)) {
        stack.push(...field.fields);
      }
    }
  }

  return Array.from(types);
};
