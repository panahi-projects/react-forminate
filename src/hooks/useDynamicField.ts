import { BaseField, FormFieldType, ProcessedFieldProps } from "@/types";
import { useFieldProcessor } from "./useFieldProcessor";
import { useFormActions, useFormError } from "./formHooks";

export const useDynamicField = <T extends BaseField>(fieldProps: T) => {
  const fieldErrors = useFormError(fieldProps.fieldId);
  const { shouldShowField } = useFormActions();

  let processedProps: ProcessedFieldProps<T>; // Process props by evaluating functions or using default values
  processedProps = useFieldProcessor(fieldProps);

  const isVisible = shouldShowField(processedProps as FormFieldType);

  return {
    processedProps,
    fieldErrors,
    isVisible,
  };
};
