import { buildFieldEventHandlers } from "../helpers/buildFieldEventHandlers";
import { useForm } from "../providers/formContext";
import {
  BaseField,
  FieldIdType,
  FieldPropValue,
  ProcessedFieldProps,
  SupportedTypes,
} from "../types";
import { getPropValue, processFieldProps } from "../utils";
import { initFieldSetup } from "../utils/initFieldSetup";
import { useDefaultFieldValue } from "./useDefaultFieldValue";

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
    setValue,
    getFieldSchema,
  } = useForm();
  // const hasSetDefault = useRef(false);
  const fieldId: FieldIdType = fieldProps?.fieldId;
  const fieldValue = values[fieldId] || fallbackValue[fieldProps.type]; // Get the current value of the field from form values

  useDefaultFieldValue(fieldId, fieldProps._defaultValue as SupportedTypes);

  const processedProps: ProcessedFieldProps<T> = processFieldProps(
    fieldProps,
    fieldId,
    values,
    formSchema
  ); // Process props by evaluating functions or using default values

  const eventHandlers = buildFieldEventHandlers<E>({
    fieldId: fieldProps.fieldId,
    type: fieldProps.type,
    value: fieldValue,
    ...fieldProps.events,
  }); // Build event handlers for the field

  const fieldParams = initFieldSetup(fieldProps.type, processedProps); // Initialize field setup based on type and processed props

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
    setValue,
    getFieldSchema,
  };
};
