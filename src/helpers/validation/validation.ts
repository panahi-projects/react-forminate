import { validationEngine } from "@/helpers";
import {
  FieldIdType,
  FormDataCollectionType,
  FormFieldType,
  SetErrorsFn,
  SupportedTypes,
  TFieldRequiredMessage,
  ValidationContext,
  ValidationRule,
} from "@/types";
import { ARRAY_FIELD_TYPES } from "@/constants";
import { FieldProcessor, findFieldById } from "@/utils";

// Helper functions
const shouldSkipValidation = (
  field: FormFieldType,
  value: SupportedTypes,
  context: ValidationContext,
  processedField: FormFieldType,
  formSchema: FormDataCollectionType
): boolean => {
  const { touchedFields, forceValidate, validateFieldsOnBlur } = context;

  // Skip if not touched and not forcing validation
  if (
    validateFieldsOnBlur !== false &&
    !forceValidate &&
    touchedFields &&
    !touchedFields[field.fieldId]
  ) {
    return true;
  }

  // Skip if hidden or disabled
  if (
    !shouldShowField(field, context.values, formSchema) ||
    isDisableField(field, context.values, formSchema)
  ) {
    return true;
  }

  // Skip empty non-required fields
  const isEmptyArray =
    ARRAY_FIELD_TYPES.includes(field.type) &&
    Array.isArray(value) &&
    value.length === 0;
  const isEmpty = (!value && value !== 0 && value !== false) || isEmptyArray;
  return isEmpty && !processedField.required;
};

const prepareValidationRules = (
  field: FormFieldType,
  values: Record<string, any>
): ValidationRule[] => {
  const rules: ValidationRule[] = [];

  if (field.required) {
    rules.push({
      type: "required",
      message:
        (field.requiredMessage as TFieldRequiredMessage) ||
        "This field is required",
    });
  }

  if (field.validation?.length) {
    rules.push(
      ...field.validation.map((rule) =>
        rule.type === "equalTo" &&
        typeof rule.equalTo === "string" &&
        rule.equalTo.startsWith("{{")
          ? { ...rule, equalTo: values[rule.equalTo.replace(/[{}]/g, "")] }
          : rule
      )
    );
  }

  return rules;
};

// Main validation functions
export const validateField = async (
  fieldId: FieldIdType,
  value: SupportedTypes,
  formSchema: FormDataCollectionType,
  values: Record<string, any>,
  setErrors: SetErrorsFn,
  touchedFields?: Record<string, boolean>,
  forceValidate: boolean = false
) => {
  const field = findFieldById(fieldId, formSchema.fields, values, formSchema);
  if (!field) return;

  const context: ValidationContext = {
    values,
    touchedFields,
    forceValidate,
    validateFieldsOnBlur: formSchema.options?.validateFieldsOnBlur,
  };

  const processedField = FieldProcessor.getInstance().process(
    field,
    values,
    formSchema
  );

  if (shouldSkipValidation(field, value, context, processedField, formSchema)) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
    return;
  }

  const rules = prepareValidationRules(processedField, values);
  if (!rules.length) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
    return;
  }

  const { isValid, message } = await validationEngine.validate(
    value,
    rules,
    values
  );
  setErrors((prev) => {
    const newErrors = { ...prev };
    if (isValid) {
      delete newErrors[fieldId];
    } else {
      newErrors[fieldId] = message || "Invalid value";
    }
    return newErrors;
  });
};

export const validateForm = async (
  formSchema: FormDataCollectionType,
  values: Record<string, SupportedTypes>,
  setErrors: (errors: Record<string, string>) => void,
  touchedFields?: Record<string, boolean>,
  forceValidateAll: boolean = false
) => {
  const errors: Record<string, string> = {};
  const processor = FieldProcessor.getInstance();
  const context: ValidationContext = {
    values,
    touchedFields,
    forceValidate: forceValidateAll,
    validateFieldsOnBlur: formSchema.options?.validateFieldsOnBlur,
  };

  const validateFields = async (fields: FormFieldType[]): Promise<boolean> => {
    let isValid = true;

    for (const field of fields) {
      if (field.fields?.length) {
        isValid = (await validateFields(field.fields)) && isValid;
        continue;
      }

      const processedField = processor.process(field, values, formSchema);
      const value = values[field.fieldId];

      if (
        shouldSkipValidation(field, value, context, processedField, formSchema)
      ) {
        continue;
      }

      const rules = prepareValidationRules(processedField, values);
      if (!rules.length) continue;

      const { isValid: fieldValid, message } = await validationEngine.validate(
        value,
        rules,
        values
      );
      if (!fieldValid) {
        errors[field.fieldId] = message || "Invalid value";
        isValid = false;
      }
    }

    return isValid;
  };

  await validateFields(formSchema.fields);
  setErrors(errors);
  return Object.keys(errors).length === 0;
};

// Field visibility and state utilities
// Update your shouldShowField function with proper type guards
export const shouldShowField = (
  field: FormFieldType,
  values: Record<string, any>,
  formSchema: FormDataCollectionType
): boolean => {
  const fieldVisibility = field.visibility;

  // Handle boolean case
  if (typeof fieldVisibility === "boolean") return fieldVisibility;

  // Handle undefined case
  if (typeof fieldVisibility === "undefined") return true;

  // Handle function case
  if (typeof fieldVisibility === "function") {
    return fieldVisibility({
      fieldId: field.fieldId,
      values,
      fieldSchema: field,
      formSchema,
    }) as boolean;
  }

  // Handle ComputedValue case
  if (
    fieldVisibility &&
    typeof fieldVisibility === "object" &&
    "fn" in fieldVisibility
  ) {
    return fieldVisibility.fn({
      fieldId: field.fieldId,
      values,
      fieldSchema: field,
      formSchema,
    }) as boolean;
  }

  // Handle object case with proper type guard
  if (
    fieldVisibility &&
    typeof fieldVisibility === "object" &&
    "dependsOn" in fieldVisibility &&
    "condition" in fieldVisibility &&
    "value" in fieldVisibility
  ) {
    const { dependsOn, condition, value } = fieldVisibility;
    const parentValue = Array.isArray(dependsOn)
      ? dependsOn.map((dep) => values[dep])
      : values[dependsOn];

    switch (condition) {
      case "equals":
        return Array.isArray(parentValue)
          ? parentValue.some((val) => val === value)
          : parentValue === value;
      case "not_equals":
        return Array.isArray(parentValue)
          ? parentValue.every((val) => val !== value)
          : parentValue !== value;
      default:
        return true;
    }
  }

  return true;
};

export const isDisableField = (
  field: FormFieldType,
  values: Record<string, SupportedTypes>,
  formSchema: FormDataCollectionType
): boolean => {
  if (typeof field.disabled === "boolean") return field.disabled;
  if (
    typeof field.disabled === "object" &&
    "fn" in field.disabled &&
    typeof field.disabled?.fn === "function"
  ) {
    return field.disabled.fn({
      fieldId: field.fieldId,
      values: values || {},
      fieldSchema: field,
      formSchema: formSchema,
    });
  }
  return false;
};
