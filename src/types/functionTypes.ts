import { BaseField, FormFieldType } from "./fieldTypes";
import { FormDataCollectionType } from "./formTypes";
import { FieldIdType, SupportedTypes } from "./primitiveTypes";

export type SetValueType = (field: string, value: any) => void;
export type ValidateFieldType = (
  field: FieldIdType,
  value: SupportedTypes,
  formSchema: FormDataCollectionType,
  values: Record<string, SupportedTypes>,
  setErrors: (
    update:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
) => void;
export type ValidateFieldParams = (
  fieldId: FieldIdType,
  value: SupportedTypes
) => void;
export type ValidateFormType = (
  form: FormDataCollectionType
) => Promise<boolean>;
export type ShouldShowFieldType = (field: FormFieldType) => boolean;
export type FetchDynamicOptionsType = (
  fieldId: FieldIdType,
  allValues?: Record<string, any>,
  pagination?: { page?: number; limit?: number }
) => Promise<void>;
export type GetFieldSchemaType = (fieldId: FieldIdType) => FormFieldType | null;
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
      | "onCustomContextMenu"
      | "onCustomUpload"
      | "onCustomRemove"]: FormEventHandler<any>;
  }>;
};

export type FieldPropFunctionReturnParams = {
  fieldId: FieldIdType;
  values: Record<string, SupportedTypes>;
  fieldSchema: FormFieldType;
  formSchema: FormDataCollectionType;
};

export interface FieldPropFunction<P> {
  (params: FieldPropFunctionReturnParams): P;
}

export type FieldPropValue<T> =
  | T
  | {
      fn: FieldPropFunction<T>;
      dependsOn?: string[];
      defaultValue?: T;
      isAsync?: boolean;
    };

export type ProcessedFieldProps<T extends BaseField> = {
  [K in keyof T]: T[K] extends FieldPropFunction<infer U>
    ? U
    : T[K] extends FieldPropValue<infer V>
      ? V
      : T[K];
};
