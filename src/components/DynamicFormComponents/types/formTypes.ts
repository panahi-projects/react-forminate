import React from "react";
import { FormFieldType } from "./fieldTypes";
import {
  FetchDynamicOptionsType,
  GetFieldSchemaType,
  IsLoadingType,
  OnSubmitType,
  SetValueType,
  ShouldShowFieldType,
  ValidateFieldType,
  ValidateFormType,
} from "./functionTypes";
import {
  BaseUrlType,
  ChildrenType,
  DescriptionType,
  FieldClassNameType,
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

export interface FormDataCollectionType {
  formId: FormIdType;
  title: TitleType;
  fields: FormFieldType[];
  baseUrl?: BaseUrlType;
  description?: DescriptionType;
}

export interface FormContextType {
  values: FormValuesType;
  errors: FormErrorsType;
  dynamicOptions: FieldDynamicOptionsType;
  formSchema: FormDataCollectionType;
  setValue: SetValueType;
  validateField: ValidateFieldType;
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
  skeleton?: ChildrenType;
  showSkeletonLoading?: ShowSkeletonLoadingType;
}

export interface FieldPropContext {
  fieldId: FieldIdType;
  values: Record<string, SupportedTypes>;
  fieldSchema: FormFieldType;
  formSchema: FormDataCollectionType;
}
