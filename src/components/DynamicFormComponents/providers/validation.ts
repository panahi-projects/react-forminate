import { FormDataCollection, FormField } from "../types";
import { findFieldById } from "./fieldDependency";

export const validateField = (
  field: string,
  value: any,
  formSchema: FormDataCollection,
  values: Record<string, any>,
  setErrors: (
    update:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
) => {
  let errorMessage = "";

  const fieldSchema: FormField = findFieldById(field, formSchema.fields);
  if (!fieldSchema) return;

  // Skip validation if field is hidden
  if (!shouldShowField(fieldSchema, values)) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    return;
  }

  // if (typeof value === "string" && value.trim() === "") {
  //   errorMessage = "This field is required.";
  // } else if (Array.isArray(value) && value.length === 0) {
  //   errorMessage = "At least one option must be selected.";
  // }
  const isEmpty =
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0);

  if (fieldSchema.required && isEmpty) {
    errorMessage = "This field is required.";
  }

  // Pattern validation
  if (!errorMessage && fieldSchema.validation?.pattern) {
    try {
      const regex = new RegExp(fieldSchema.validation.pattern);
      if (!regex.test(value)) {
        errorMessage = fieldSchema.validation.message || "Invalid format.";
      }
    } catch (e) {
      console.warn(`Invalid regex pattern for field ${field}:`, e);
    }
  }

  setErrors((prev) => {
    if (errorMessage) {
      return { ...prev, [field]: errorMessage };
    } else {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    }
  });
};

export const shouldShowField = (
  field: FormField,
  values: Record<string, any>
) => {
  if (!field.visibility) return true;

  const { dependsOn, condition, value } = field.visibility;
  const parentValue = values[dependsOn];

  switch (condition) {
    case "equals":
      return parentValue === value;
    case "not_equals":
      return parentValue !== value;
    default:
      return true;
  }
};

export const validateForm = (
  form: FormDataCollection,
  values: Record<string, any>,
  setErrors: (
    update:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
) => {
  let isValid = true;
  const newErrors: Record<string, string> = {};

  // Clear previous errors
  setErrors({});

  const validateFieldRecursive = (fields: FormField[]) => {
    if (!fields || fields.length === 0) return;
    fields.forEach((field) => {
      if (field.type === "group" && field.fields) {
        validateFieldRecursive(field.fields);
      } else if (shouldShowField(field, values)) {
        if (
          field.required &&
          (!values[field.id] || values[field.id].length === 0)
        ) {
          newErrors[field.id] = "This field is required.";
          isValid = false;
        } else if (field.validation?.pattern) {
          try {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(values[field.id] || "")) {
              newErrors[field.id] =
                field.validation.message || "Invalid format.";
              isValid = false;
            }
          } catch (e) {
            console.warn(`Invalid regex in validateForm for ${field.id}:`, e);
          }
        }
      }
    });
  };

  validateFieldRecursive(form.fields);
  setErrors(newErrors);
  return isValid;
};
