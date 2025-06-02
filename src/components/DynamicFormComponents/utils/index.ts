import { JSX_ATTRIBUTES, TAG_TO_ELEMENT_TAG } from "../constants";
import {
  BaseField,
  FieldIdType,
  FieldPropFunction,
  FieldPropFunctionReturnParams,
  FieldPropValue,
  FormDataCollectionType,
  FormFieldType,
  ProcessedFieldProps,
  SelectFieldType,
  SupportedTypes,
} from "../types";

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
  if (typeof prop === "function") {
    try {
      return (prop as FieldPropFunction<P>)({
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
  return prop !== undefined ? prop : (defaultValue as P);
}; // Function to evaluate field prop values, handling functions and defaults

export const processFieldProps = <T extends BaseField>(
  fieldProps: FormFieldType & T,
  fieldId: FieldIdType,
  values: Record<string, SupportedTypes> = {},
  formSchema: FormDataCollectionType
): ProcessedFieldProps<T> => {
  return Object.entries(fieldProps).reduce((acc, [key, value]) => {
    const evaluatedValue = getPropValue(value as FieldPropValue<any>, {
      fieldId,
      values,
      fieldSchema: fieldProps,
      formSchema,
    });

    return {
      ...acc,
      [key]: evaluatedValue,
    };
  }, {} as ProcessedFieldProps<T>);
};
