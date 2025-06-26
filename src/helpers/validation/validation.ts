import { validationEngine } from "@/helpers";
import {
  FieldIdType,
  FormDataCollectionType,
  FormFieldType,
  SupportedTypes,
  TFieldDisabled,
  TFieldRequiredMessage,
  ValidationRule,
} from "@/types";
import { findFieldById, processFieldProps } from "@/utils";
import { FieldProcessor } from "../../utils/fieldProcessorUtils";

export const validateField = (
  fieldId: FieldIdType,
  value: SupportedTypes,
  formSchema: FormDataCollectionType,
  values: Record<string, any>,
  setErrors: (
    update:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void,
  touchedFields?: Record<string, boolean>, // Add this parameter
  validateUntouched: boolean = false // Add this parameter
) => {
  const processor = FieldProcessor.getInstance();
  const fieldSchema: FormFieldType | null = findFieldById(
    fieldId,
    formSchema.fields,
    values,
    formSchema
  );

  if (!fieldSchema) return;

  // Skip validation if field is hidden or disabled
  const isVisible = shouldShowField(fieldSchema, values);
  const isDisabled = isDisableField(fieldSchema, values, formSchema);

  if (!isVisible || isDisabled) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
    return;
  }

  // Skip validation if field hasn't been touched and we're not forcing validation
  if (!validateUntouched && touchedFields && !touchedFields[fieldId]) {
    return;
  }

  // Process the field to resolve any dynamic properties
  const processedField = processor.process(fieldSchema, values, formSchema);

  // Skip validation for empty non-required fields
  const isEmpty = value === "" || value === null || value === undefined;
  if (isEmpty && !processedField.required) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
    return;
  }

  // Prepare validation rules
  const validationRules: ValidationRule[] = [];

  // Add required rule if needed
  if (processedField.required) {
    validationRules.push({
      type: "required",
      message:
        (processedField.requiredMessage as TFieldRequiredMessage) ||
        "This field is required.",
    });
  }

  // Add other validation rules
  if (!isEmpty && Array.isArray(processedField.validation)) {
    validationRules.push(...processedField.validation);
  }

  // Skip validation if there are no rules
  if (validationRules.length === 0) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
    return;
  }

  // Validate using the engine
  const { isValid, message } = validationEngine.validate(
    value,
    validationRules
  );

  setErrors((prev) => {
    if (!isValid) {
      return { ...prev, [fieldId]: message || "Validation failed" };
    }
    const newErrors = { ...prev };
    delete newErrors[fieldId];
    return newErrors;
  });
};

export const validateForm = (
  form: FormDataCollectionType,
  values: Record<string, SupportedTypes>,
  setErrors: (
    update:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void,
  touchedFields?: Record<string, boolean>,
  forceValidateAll: boolean = false // Add this parameter
) => {
  const processor = FieldProcessor.getInstance();
  let isValid = true;
  const newErrors: Record<string, string> = {};

  const validateFieldRecursive = (fields: FormFieldType[]) => {
    if (!fields || fields.length === 0) return;

    fields.forEach((field) => {
      if (field.fields && field.fields.length > 0) {
        if (!field.fieldId) {
          throw new Error("`fieldId` is not provided for the field");
        }
        // Recursively validate nested fields
        validateFieldRecursive(field.fields);
        return;
      }

      // Skip validation for hidden or disabled fields
      const isVisible = shouldShowField(field, values);
      const isDisabled = isDisableField(field, values, form);

      if (!isVisible || isDisabled) {
        return;
      }

      // Skip validation if field hasn't been touched and we're not forcing validation
      if (!forceValidateAll && touchedFields && !touchedFields[field.fieldId]) {
        return;
      }

      const processedField = processor.process(field, values, form);
      const value = values[field.fieldId];

      // Skip validation for empty non-required fields
      const isEmpty = value === "" || value === null || value === undefined;
      if (isEmpty && !processedField.required) {
        return;
      }

      // Prepare validation rules
      const validationRules: ValidationRule[] = [];

      if (processedField.required) {
        validationRules.push({
          type: "required",
          message:
            (processedField.requiredMessage as TFieldRequiredMessage) ||
            "This field is required.",
        });
      }

      if (!isEmpty && Array.isArray(processedField.validation)) {
        validationRules.push(...processedField.validation);
      }

      // Skip if no validation rules
      if (validationRules.length === 0) {
        return;
      }

      const { isValid: fieldIsValid, message } = validationEngine.validate(
        value,
        validationRules
      );

      if (!fieldIsValid) {
        newErrors[field.fieldId] = message || "Validation failed";
        isValid = false;
      }
    });
  };

  // Clear previous errors before validation
  setErrors({});
  validateFieldRecursive(form.fields);
  setErrors(newErrors);
  return isValid;
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
    const parentValue = values[dependsOn as FieldIdType];

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
  if (
    typeof field.disabled === "object" &&
    "fn" in field.disabled &&
    typeof field.disabled.fn === "function"
  ) {
    const result = field.disabled.fn({
      fieldId: field?.fieldId,
      values: values as Record<string, SupportedTypes>,
      fieldSchema: field,
      formSchema: formSchema as FormDataCollectionType,
    });
    return result;
  }
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
  return !!field.disabled;
};
