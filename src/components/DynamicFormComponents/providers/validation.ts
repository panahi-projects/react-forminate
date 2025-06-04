import {
  FormDataCollectionType,
  FormFieldType,
  SupportedTypes,
  TFieldDisabled,
  TFieldRequiredMessage,
} from "../types";
import { processFieldProps } from "../utils";
import { findFieldById } from "./fieldDependency";

const isValueEmpty = (value: any): boolean => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0)
  );
};

export const validateField = (
  field: string,
  value: SupportedTypes,
  formSchema: FormDataCollectionType,
  values: Record<string, any>,
  setErrors: (
    update:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
) => {
  let errorMessage = "";

  const fieldSchema: FormFieldType | null = findFieldById(
    field,
    formSchema.fields,
    values,
    formSchema
  );

  if (!fieldSchema) return;

  // Skip validation if field is hidden
  if (
    !shouldShowField(fieldSchema, values) &&
    !isDisableField(fieldSchema, values, formSchema)
  ) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    return;
  }

  if (fieldSchema.required && isValueEmpty(value)) {
    errorMessage =
      (fieldSchema.requiredMessage as TFieldRequiredMessage) ||
      "This field is required.";
  }

  if (!errorMessage && Array.isArray(fieldSchema.validation)) {
    for (const rule of fieldSchema.validation) {
      // Pattern validation
      if (rule.pattern) {
        try {
          const regex = new RegExp(rule.pattern);
          if (!regex.test(value as string)) {
            errorMessage = rule.message || "Invalid format.";
            break;
          }
        } catch (e) {
          console.warn(`Invalid regex for field "${field}":`, e);
        }
      }

      if (
        rule.min !== undefined &&
        typeof +(value as string) === "number" &&
        (value as number) < rule.min
      ) {
        errorMessage = rule.message || `Minimum value is ${rule.min}.`;
        break;
      }

      if (
        rule.max !== undefined &&
        typeof +(value as string) === "number" &&
        (value as number) > rule.max
      ) {
        errorMessage = rule.message || `Maximum value is ${rule.max}.`;
        break;
      }

      if (
        rule.minLength !== undefined &&
        typeof value === "string" &&
        value.length < rule.minLength
      ) {
        errorMessage =
          rule.message || `Minimum length is ${rule.minLength} characters.`;
        break;
      }

      if (
        rule.maxLength !== undefined &&
        typeof value === "string" &&
        value.length > rule.maxLength
      ) {
        errorMessage =
          rule.message || `Maximum length is ${rule.maxLength} characters.`;
        break;
      }

      if (rule.custom && typeof rule.custom === "function") {
        const passed = rule.custom(value);
        if (!passed) {
          errorMessage = rule.message || `Invalid input.`;
          break;
        }
      }
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
  field: FormFieldType,
  values: Record<string, any>
): boolean => {
  const fieldVisibility = field.visibility;
  if (typeof fieldVisibility === "undefined" || fieldVisibility === true)
    return true;
  if (typeof fieldVisibility === "boolean") return fieldVisibility;

  if (
    typeof fieldVisibility === "object" &&
    "dependsOn" in fieldVisibility &&
    "condition" in fieldVisibility &&
    "value" in fieldVisibility
  ) {
    const { dependsOn, condition, value } = fieldVisibility;
    const parentValue = values[dependsOn];

    switch (condition) {
      case "equals":
        return parentValue === value;
      case "not_equals":
        return parentValue !== value;
      default:
        return true;
    }
  }
  return true;
};

export const isDisableField = (
  field: FormFieldType,
  values?: Record<string, SupportedTypes>,
  formSchema?: FormDataCollectionType
): TFieldDisabled => {
  if (typeof field.disabled === "boolean") return field.disabled;
  if (typeof field.disabled === "undefined") return false;
  if (typeof field.disabled === "function") {
    // If disabled is a function, we need to call it with the context
    // Assuming we have a context or values to pass, you can modify this as needed
    const foundField = processFieldProps(
      field,
      field.fieldId,
      values,
      formSchema as FormDataCollectionType
    );
    if (foundField) {
      return (foundField.disabled as TFieldDisabled) || false; // Replace with actual context if available
    }
    return false;
  }
  return field.disabled === true;
};

export const validateForm = (
  form: FormDataCollectionType,
  values: Record<string, SupportedTypes>,
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

  const validateFieldRecursive = (fields: FormFieldType[]) => {
    if (!fields || fields.length === 0) return;
    fields.forEach((field) => {
      if (field.fields && field.fields.length > 0) {
        // Recursively validate nested fields
        validateFieldRecursive(field.fields);
      } else if (
        shouldShowField(field, values) &&
        !isDisableField(field, values, form)
      ) {
        const value = values[field.fieldId];

        const fieldSchema: FormFieldType | null = findFieldById(
          field.fieldId,
          fields,
          values,
          form
        );
        if (!fieldSchema)
          throw new Error(
            "Something is wrong with field schema. It is undefined!"
          );

        if (fieldSchema.required && isValueEmpty(value)) {
          newErrors[fieldSchema.fieldId as string] =
            (fieldSchema.requiredMessage as TFieldRequiredMessage) ||
            "This field is required.";
          isValid = false;
        } else if (Array.isArray(fieldSchema.validation)) {
          for (const rule of fieldSchema.validation) {
            if (rule.pattern) {
              try {
                const regex = new RegExp(rule.pattern);
                if (!regex.test(value as string)) {
                  // If the value does not match the regex pattern
                  newErrors[fieldSchema.fieldId] =
                    rule.message || "Invalid format.";
                  isValid = false;
                  break;
                }
              } catch (e) {
                console.warn(
                  `Invalid regex in validateForm for ${field.fieldId}:`,
                  e
                );
              }
            }

            if (
              rule.min !== undefined &&
              typeof value === "number" &&
              value < rule.min
            ) {
              newErrors[fieldSchema.fieldId] =
                rule.message || `Minimum value is ${rule.min}.`;
              isValid = false;
              break;
            }

            if (
              rule.max !== undefined &&
              typeof value === "number" &&
              value > rule.max
            ) {
              newErrors[fieldSchema.fieldId] =
                rule.message || `Maximum value is ${rule.max}.`;
              isValid = false;
              break;
            }

            if (
              rule.minLength !== undefined &&
              typeof value === "string" &&
              value.length < rule.minLength
            ) {
              newErrors[fieldSchema.fieldId] =
                rule.message || `Minimum length is ${rule.minLength}.`;
              isValid = false;
              break;
            }

            if (
              rule.maxLength !== undefined &&
              typeof value === "string" &&
              value.length > rule.maxLength
            ) {
              newErrors[fieldSchema.fieldId] =
                rule.message || `Maximum length is ${rule.maxLength}.`;
              isValid = false;
              break;
            }

            if (rule.custom && typeof rule.custom === "function") {
              const passed = rule.custom(value);
              if (!passed) {
                newErrors[fieldSchema.fieldId] =
                  rule.message || "Custom validation failed.";
                isValid = false;
                break;
              }
            }
          }
        }
      }
    });
  };

  validateFieldRecursive(form.fields);
  setErrors(newErrors);
  return isValid;
};
