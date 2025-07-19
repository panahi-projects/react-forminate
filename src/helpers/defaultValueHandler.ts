import { FormFieldType } from "@/types";

export const setDefaultsRecursively = (
  fields: FormFieldType[],
  initialValues: Record<string, any> = {}
) => {
  fields.forEach((field) => {
    if (
      field._defaultValue !== undefined &&
      initialValues[field.fieldId] === undefined
    ) {
      initialValues[field.fieldId] = field._defaultValue;
    }

    if (field.fields) {
      setDefaultsRecursively(field.fields, initialValues);
    }
  });
  return initialValues;
};
