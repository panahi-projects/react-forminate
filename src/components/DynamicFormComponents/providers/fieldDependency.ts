import { FormField } from "../types";

export const findFieldById = (
  fieldId: string,
  fields: FormField[]
): any | null => {
  for (const field of fields) {
    if (field.fieldId === fieldId) return field;
    if (field.fields && field.fields.length > 0) {
      const found = findFieldById(fieldId, field.fields);
      if (found) return found;
    }
  }
  return null;
};

export const getInitialDependencies = (
  fields: FormField[]
): Record<string, string> => {
  const dependencies: Record<string, string> = {};

  const traverseFields = (fields: any[]) => {
    if (!fields || fields.length === 0) return;
    fields.forEach((field) => {
      if (field.dynamicOptions?.dependsOn) {
        dependencies[field.fieldId] = field.dynamicOptions.dependsOn;
      }
      if (field.type === "group" && field.fields) {
        traverseFields(field.fields);
      }
    });
  };

  traverseFields(fields);
  return dependencies;
};
