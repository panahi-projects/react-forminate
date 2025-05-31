import { FormFieldType } from "./fieldTypes";
import { FormDataCollectionType } from "./formTypes";
import { FieldIdType } from "./primitiveTypes";

export type SetValueType = (field: string, value: any) => void;
export type ValidateFieldType = (
  field: string,
  value: any,
  formSchema: FormDataCollectionType,
  values: Record<string, any>,
  setErrors: (
    update:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
) => void;
export type ValidateFormType = (form: FormDataCollectionType) => boolean;
export type ShouldShowFieldType = (field: FormFieldType) => boolean;
export type FetchDynamicOptionsType = (
  fieldId: FieldIdType,
  allValues?: Record<string, any>,
  pagination?: { page?: number; limit?: number }
) => Promise<void>;
export type GetFieldSchemaType = (fieldId: FieldIdType) => FormFieldType;
export type OnSubmitType = (values: any, isValid: boolean) => void;
export type IsLoadingType = boolean;

export type FormEventHandler<E> = (
  e: E,
  fieldId: FieldIdType,
  values: Record<string, any>,
  fieldSchema?: FormFieldType,
  formSchema?: FormDataCollectionType
) => void;

export type CustomEventHandlers = {
  events?: Partial<{
    [K in
      | "onCustomChange"
      | "onCustomBlur"
      | "onCustomFocus"
      | "onCustomKeyDown"
      | "onCustomKeyUp"
      | "onCustomClick"
      | "onCustomMouseEnter"
      | "onCustomMouseLeave"
      | "onCustomMouseDown"
      | "onCustomContextMenu"]: FormEventHandler<any>;
  }>;
};
