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
import { useEffect } from "react";

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
    setValue,
    getFieldSchema,
    shouldShowField,
    validateForm,
    validateField,
  } = useForm();
  // const hasSetDefault = useRef(false);
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

  const eventHandlers = buildFieldEventHandlers<E>({
    fieldId: fieldProps.fieldId,
    type: fieldProps.type,
    value: fieldValue,
    ...fieldProps.events,
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
    setValue,
    getFieldSchema,
    validateForm,
    validateField,
  };
};
