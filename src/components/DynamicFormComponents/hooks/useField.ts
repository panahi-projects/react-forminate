import { buildFieldEventHandlers } from "../helpers/buildFieldEventHandlers";
import { useForm } from "../providers/formContext";
import {
  BaseField,
  FieldIdType,
  FormDataCollectionType,
  FormFieldType,
  SupportedTypes,
} from "../types";
import { initFieldSetup } from "../utils/initFieldSetup";
import { useDefaultFieldValue } from "./useDefaultFieldValue";

interface FieldPropFunction<P> {
  (params: {
    fieldId: FieldIdType;
    values: Record<string, string | number | unknown[] | boolean | null>;
    fieldSchema: FormFieldType;
    formSchema: FormDataCollectionType;
  }): P;
}

type FieldPropValue<T> = T | FieldPropFunction<T>;

type ProcessedFieldProps<T extends BaseField> = {
  [K in keyof T]: T[K] extends FieldPropFunction<infer U>
    ? U
    : T[K] extends FieldPropValue<infer V>
      ? V
      : T[K];
};

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

  const getPropValue = <P>(prop: FieldPropValue<P>, defaultValue?: P): P => {
    if (typeof prop === "function") {
      try {
        return (prop as FieldPropFunction<P>)({
          fieldId,
          values,
          fieldSchema: getFieldSchema(fieldId),
          formSchema,
        });
      } catch (error) {
        console.error("Error in field prop function:", error);
        return defaultValue as P;
      }
    }
    return prop !== undefined ? prop : (defaultValue as P);
  }; // Function to evaluate field prop values, handling functions and defaults

  const processedProps: ProcessedFieldProps<T> = Object.entries(
    fieldProps
  ).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: getPropValue(value as FieldPropValue<any>),
    };
  }, {} as ProcessedFieldProps<T>); // Process props by evaluating functions or using default values

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
