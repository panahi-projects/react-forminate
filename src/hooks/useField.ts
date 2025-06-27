//Global internal imports
import { useForm } from "@/context";
import { buildFieldEventHandlers, initFieldSetup } from "@/helpers";
import {
  BaseField,
  FieldIdType,
  FormFieldType,
  ProcessedFieldProps,
  SupportedTypes,
} from "@/types";
import { fallbackValue } from "@/utils";

//Relative internal import
import { useDefaultFieldValue } from "./useDefaultFieldValue";
import { useFieldProcessor } from "./useFieldProcessor";

//External libraries & tools import
import { useEffect, useState } from "react";

export const useField = <
  T extends BaseField,
  E extends HTMLElement = HTMLInputElement,
>(
  fieldProps: T
) => {
  //single call to useForm
  const {
    values,
    errors,
    formSchema,
    dynamicOptions,
    observer,
    formOptions = {},
    setValue,
    getFieldSchema,
    shouldShowField,
    validateForm,
    validateField,
    touched,
    setTouched,
  } = useForm();
  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  const fieldId: FieldIdType = fieldProps?.fieldId;
  const fieldValue = values[fieldId] || fallbackValue[fieldProps.type]; // Get the current value of the field from form values
  useDefaultFieldValue(fieldId, fieldProps._defaultValue as SupportedTypes);
  let processedProps: ProcessedFieldProps<T>; // Process props by evaluating functions or using default values
  processedProps = useFieldProcessor(fieldProps);

  useEffect(() => {
    const unsubscribe = observer.subscribe(fieldId, () => {
      console.log(`[${fieldId}] Observer triggered!`);
    });

    return () => unsubscribe();
  }, [fieldId, observer]);

  const handleFocus = (e: React.FocusEvent<E>) => {
    setHasBeenFocused(true);
    if (fieldProps.events?.onCustomFocus) {
      fieldProps.events.onCustomFocus(
        e,
        fieldId,
        values,
        fieldProps,
        formSchema
      );
    }
  };

  const handleBlur = (e: React.FocusEvent<E>) => {
    setTouched(fieldProps.fieldId, true);
    if (hasBeenFocused && formOptions.validateFieldsOnBlur !== false) {
      validateField(fieldProps.fieldId, values[fieldProps.fieldId]);
    }
    if (fieldProps.events?.onCustomBlur) {
      fieldProps.events.onCustomBlur(
        e,
        fieldId,
        values,
        fieldProps,
        formSchema
      );
    }
  };

  const eventHandlers = buildFieldEventHandlers<E>({
    fieldId: fieldProps.fieldId,
    type: fieldProps.type,
    value: fieldValue,
    ...fieldProps.events,
    onCustomBlur: handleBlur, // Override the blur handler
    onCustomFocus: handleFocus, // Override the focus handler
  }); // Build event handlers for the field

  const fieldParams = initFieldSetup(fieldProps.type, processedProps); // Initialize field setup based on type and processed props
  const isVisible = shouldShowField(processedProps as FormFieldType);
  const isDisable = processedProps.disabled || false; // Determine if the field is disabled

  return {
    fieldId,
    processedProps,
    fieldParams,
    fieldValue,
    values,
    errors,
    formSchema,
    dynamicOptions,
    eventHandlers,
    isVisible,
    isDisable,
    observer,
    isTouched: touched[fieldProps.fieldId] || false,
    hasBeenFocused,
    setValue,
    getFieldSchema,
    validateForm,
    validateField,
  };
};
