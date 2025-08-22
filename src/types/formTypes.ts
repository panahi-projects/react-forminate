import { Observer } from "@/helpers";
import { ComponentType, ReactElement } from "react";
import { FormFieldType } from "./fieldTypes";
import {
  FetchDynamicOptionsType,
  GetFieldSchemaType,
  IsLoadingType,
  OnSubmitType,
  SetValueType,
  ShouldShowFieldType,
  ValidateFieldParams,
  ValidateFormType,
} from "./functionTypes";
import {
  BaseUrlType,
  ChildrenType,
  DescriptionType,
  FieldClassNameType,
  FieldDisableDefaultStyling,
  FieldDynamicOptionsType,
  FieldIdType,
  FieldStyleType,
  FormErrorsType,
  FormIdType,
  FormValuesType,
  ShowSkeletonLoadingType,
  SupportedTypes,
  TitleType,
} from "./primitiveTypes";

export type SubmitDetailsType = {
  visible?: boolean;
  text?: string;
  className?: FieldClassNameType;
  styles?: FieldStyleType;
  containerClassName?: FieldClassNameType;
  containerStyles?: FieldStyleType;
  component?: React.ReactNode;
};
export type CustomProviderType = React.FC<FormProviderType>;

export interface FormOptions {
  validateFieldsOnBlur?: boolean;
  disableDefaultStyling?: FieldDisableDefaultStyling;
  skeleton?: {
    visible?: ShowSkeletonLoadingType;
    component?: ChildrenType;
  };
  submit?: SubmitDetailsType;
  loading?: {
    visible?: boolean;
    component?: ReactElement | ComponentType<{}>;
  };
}

export interface FormDataCollectionType {
  formId: FormIdType;
  title?: TitleType;
  fields: FormFieldType[];
  baseUrl?: BaseUrlType;
  description?: DescriptionType;
  options?: FormOptions;
}

export interface FormContextType {
  values: FormValuesType;
  errors: FormErrorsType;
  dynamicOptions: FieldDynamicOptionsType;
  formSchema: FormDataCollectionType;
  observer: Observer;
  formOptions?: FormOptions;
  touched: Record<FieldIdType, boolean>;
  setTouched: (fieldId: FieldIdType, isTouched: boolean) => void;
  blurred: Record<FieldIdType, boolean>;
  setBlurred: (fieldId: FieldIdType, isTouched: boolean) => void;
  setValue: SetValueType;
  validateField: ValidateFieldParams;
  validateForm: ValidateFormType;
  shouldShowField: ShouldShowFieldType;
  fetchDynamicOptions: FetchDynamicOptionsType;
  getFieldSchema: GetFieldSchemaType;
  resetForm: () => void;
}

export interface FormProviderType {
  formId?: FormIdType;
  formSchema: FormDataCollectionType;
  children: ChildrenType;
}

export interface DynamicFormType {
  formId?: FormIdType;
  formData: FormDataCollectionType;
  onSubmit?: OnSubmitType;
  isLoading?: IsLoadingType;
  customProvider?: CustomProviderType;
}

export interface FieldPropContext {
  fieldId: FieldIdType;
  values: Record<string, SupportedTypes>;
  fieldSchema: FormFieldType;
  formSchema: FormDataCollectionType;
}

export interface CustomChangeEvent<T = any> {
  target: {
    value: T;
    name: string;
    type: string;
  };
  currentTarget: {
    value: T;
    name: string;
  };
  nativeEvent: Event;
  preventDefault: () => void;
  stopPropagation: () => void;
  isDefaultPrevented: () => boolean;
  isPropagationStopped: () => boolean;
  persist: () => void;
  type: string;
  timeStamp: number;
}
