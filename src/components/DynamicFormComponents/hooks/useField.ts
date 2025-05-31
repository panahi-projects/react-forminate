import { useForm } from "../providers/formContext";
import {
  BaseField,
  FieldIdType,
  FormDataCollectionType,
  FormFieldType,
} from "../types";

interface FieldPropFunction<P> {
  (params: {
    fieldId: FieldIdType;
    values: Record<string, string | number | unknown[] | boolean | null>;
    fieldSchema: FormFieldType;
    formSchema: FormDataCollectionType;
  }): P;
}

type SupportedTypes =
  | string
  | number
  | boolean
  | null
  | { [key: string]: SupportedTypes } // Object with SupportedTypes values
  | SupportedTypes[] // Array of any SupportedTypes (including nested arrays)
  | Array<string>
  | Array<number>
  | Array<boolean>
  | Array<{ [key: string]: SupportedTypes }>;

export const useField = <T extends BaseField>(fieldProps: T) => {
  //single call to useForm
  const {
    values,
    errors,
    formSchema,
    dynamicOptions,
    setValue,
    getFieldSchema,
  } = useForm();

  const fieldId: FieldIdType = fieldProps.fieldId;
  const fieldValue = values[fieldId] ?? "";

  const getPropValue = <P>(
    prop: FieldPropFunction<P> | SupportedTypes,
    defaultValue?: P
  ): P => {
    if (typeof prop === "function") {
      try {
        return prop({
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
    return prop !== undefined ? (prop as P) : (defaultValue as P);
  };

  const processedProps: T = Object.entries(fieldProps).reduce(
    (acc, [key, value]) => {
      return { ...acc, [key]: getPropValue<string>(value) };
    },
    {} as T
  );

  return {
    values,
    errors,
    formSchema,
    dynamicOptions,
    setValue,
    getFieldSchema,
  };
};
