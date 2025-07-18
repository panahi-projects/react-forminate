import { Observer } from "@/helpers";
import React from "react";
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
  visibility?: boolean;
  text?: string;
  className?: FieldClassNameType;
  styles?: FieldStyleType;
  containerClassName?: FieldClassNameType;
  containerStyles?: FieldStyleType;
};
export type CustomProviderType = React.FC<FormProviderType>;

export interface FormOptions {
  validateFieldsOnBlur?: boolean;
  disableDefaultStyling?: FieldDisableDefaultStyling;
  skeleton?: {
    showSkeletonLoading: ShowSkeletonLoadingType;
    component?: ChildrenType;
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
  submitDetails?: SubmitDetailsType;
  customProvider?: CustomProviderType;
}

export interface FieldPropContext {
  fieldId: FieldIdType;
  values: Record<string, SupportedTypes>;
  fieldSchema: FormFieldType;
  formSchema: FormDataCollectionType;
}
