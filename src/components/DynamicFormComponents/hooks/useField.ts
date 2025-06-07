import { useEffect } from "react";
import { buildFieldEventHandlers } from "../helpers/buildFieldEventHandlers";
import { useForm } from "../providers/formContext";
import {
  BaseField,
  FieldIdType,
  FormFieldType,
  ProcessedFieldProps,
  SupportedTypes,
} from "../types";
import { initFieldSetup } from "../utils/initFieldSetup";
import { useDefaultFieldValue } from "./useDefaultFieldValue";
import { useFieldProcessor } from "./useFieldProcessor";

const fallbackValue: { [key: string]: unknown } = {
  checkbox: [],
  number: 0,
  tel: "",
  text: "",
  email: "",
  url: "",
  password: "",
  search: "",
  date: "",
  radio: "",
  select: "",
  textarea: "",
  gridview: [],
  container: {},
  spacer: "",
  group: [],
  // Add other field types as needed
};

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
