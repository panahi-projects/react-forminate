import {
  FormDataCollectionType,
  FormFieldType,
  SupportedTypes,
} from "../types";
import { processFieldProps } from "../utils";

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
export const getInitialDependencies = (
  fields: FormFieldType[]
): Record<string, string> => {
  const dependencies: Record<string, string> = {};

  const traverseFields = (fields: any[]) => {
    if (!fields || fields.length === 0) return;
    fields.forEach((field) => {
      if (field.dynamicOptions?.dependsOn) {
        dependencies[field.fieldId] = field.dynamicOptions.dependsOn;
      }
      if (field.fields && field.fields.length > 0) {
        traverseFields(field.fields);
      }
    });
  };

  traverseFields(fields);
  return dependencies;
};
