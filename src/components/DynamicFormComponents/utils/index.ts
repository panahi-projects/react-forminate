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

export const getFieldDependencies = (field: FormFieldType): FieldIdType[] => {
  if (!field || typeof field !== "object" || !("fieldId" in field)) return [];

  const dependsOnSet = new Set<FieldIdType>();

  Object.values(field).forEach((propValue) => {
    if (propValue && typeof propValue === "object") {
      // ✅ Add from propValue.dependsOn
      if ("dependsOn" in propValue && Array.isArray(propValue.dependsOn)) {
        propValue.dependsOn.forEach((dep: FieldIdType) =>
          dependsOnSet.add(dep)
        );
      }

      // ✅ Add from legacy dependents (your custom logic)
      const legacy = getLegacyDependencies(propValue);
      legacy.forEach((dep: FieldIdType) => dependsOnSet.add(dep));
    }
  });

  return Array.from(dependsOnSet);
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

export const collectFieldDependencies = (
  formFields: FormFieldType[],
  parentMap: Record<string, Set<string>> = {}
): Record<string, string[]> => {
  function extractDependsOn(field: any): string[] {
    const deps: string[] = [];
    for (const key in field) {
      if (
        typeof field[key] === "object" &&
        field[key] !== null &&
        Array.isArray(field[key]?.dependsOn)
      ) {
        deps.push(...field[key].dependsOn);
      }
    }
    return deps;
  }

  function traverse(fields: FormFieldType[]) {
    for (const field of fields) {
      if (!field.fieldId) continue;

      const dependencies = extractDependsOn(field);
      for (const dep of dependencies) {
        if (!parentMap[dep]) {
          parentMap[dep] = new Set();
        }
        parentMap[dep].add(field.fieldId);
      }

      if (Array.isArray(field.fields)) {
        traverse(field.fields);
      }
    }
  }

  traverse(formFields);

  // Convert sets to arrays
  const result: Record<string, string[]> = {};
  for (const key in parentMap) {
    result[key] = Array.from(parentMap[key]);
  }

  return result;
};
