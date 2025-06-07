import { JSX_ATTRIBUTES, TAG_TO_ELEMENT_TAG } from "../constants";
import {
  BaseField,
  DependencyMap,
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

export const processFieldProps = <T extends BaseField>(
  fieldProps: FormFieldType & T,
  fieldId: FieldIdType,
  values: Record<string, SupportedTypes> = {},
  formSchema: FormDataCollectionType
): ProcessedFieldProps<T> => {
  return Object.entries(fieldProps).reduce((acc, [key, prop]) => {
    const evaluatedValue = getPropValue(prop as FieldPropValue<any>, {
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

export function flattenSchema(fields: FormFieldType[]): {
  fieldIds: FieldIdType[];
  fields: FormFieldType[];
} {
  const fieldIds: FieldIdType[] = [];
  const flatFields: FormFieldType[] = [];

  const traverse = (fieldList: FormFieldType[]) => {
    for (const field of fieldList) {
      fieldIds.push(field.fieldId);

      if (Array.isArray(field.fields) && field.fields.length > 0) {
        traverse(field.fields); // Recurse into nested group fields
      } else {
        flatFields.push(field); // Only push non-group fields
      }
    }
  };

  traverse(fields);

  return { fieldIds, fields: flatFields };
}

export const isDependencyMapEmpty = (map: DependencyMap): boolean => {
  return Object.values(map).some((set) => set.size === 0);
};

export const isConvertableToNumber = (value: number | string) => {
  if (typeof value === "number") return true;
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    //@ts-ignore
    return !isNaN(trimmedValue) && !isNaN(parseFloat(trimmedValue));
  }
  return false;
};

export const getLegacyDependencies = (prop: unknown): string[] => {
  const dependsOn: string[] = [];
  // Legacy format - enhanced detection
  const funcStr = (prop as any).toString();

  // Detect values.xxx and formValues.xxx and values?.xxx patterns
  const matches = funcStr.match(
    /(values|formValues|values\?)\.([a-zA-Z0-9_]+)/g
  );
  if (matches) {
    matches.forEach((match: string) => {
      const dep: FieldIdType = match.split(".")[1]; // Extract the field name
      dependsOn.push(dep);
    });
  }
  return dependsOn;
};

export const convertLegacyFieldToNew = <T>(
  prop: FieldPropFunction<T>
): FieldPropValue<T> | null => {
  if (typeof prop === "function") {
    return {
      fn: prop,
      dependsOn: [...getLegacyDependencies(prop)],
    } as FieldPropValue<T>;
  }
  return prop;
};
