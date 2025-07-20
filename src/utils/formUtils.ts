import {
  BaseField,
  FieldIdType,
  FieldPropFunction,
  FieldPropValue,
  FormDataCollectionType,
  FormFieldType,
  ProcessedFieldProps,
  SupportedTypes,
} from "@/types";
import { getPropValue } from "./fieldUtils";

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
  if (!field || typeof field !== "object") return [];

  const dependencies = new Set<FieldIdType>();

  // Check dynamicOptions first
  if ("dynamicOptions" in field) {
    if (field.dynamicOptions?.dependsOn) {
      const deps = Array.isArray(field.dynamicOptions.dependsOn)
        ? field.dynamicOptions.dependsOn
        : [field.dynamicOptions.dependsOn];
      deps.forEach((dep) => dependencies.add(dep));
    }
  }

  // Recursively check all object properties
  const checkObject = (obj: any) => {
    if (!obj || typeof obj !== "object") return;

    // Check for explicit dependsOn
    if (Array.isArray(obj.dependsOn)) {
      obj.dependsOn.forEach((dep: FieldIdType) => dependencies.add(dep));
    }

    // Check for function dependencies
    if (typeof obj === "function") {
      const funcStr = obj.toString();
      const matches = funcStr.match(/(?:values|formValues)\.([a-zA-Z0-9_]+)/g);
      if (matches) {
        matches.forEach((match: string) => {
          const dep = match.split(".")[1];
          dependencies.add(dep);
        });
      }
    }

    // Recurse into nested objects
    Object.values(obj).forEach((val) => {
      if (val && typeof val === "object") {
        checkObject(val);
      }
    });
  };

  checkObject(field);
  return Array.from(dependencies);
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
