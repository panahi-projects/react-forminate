import React, {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import {
  FormIdType,
  TitleType,
  BaseUrlType,
  DescriptionType,
  FormValuesType,
  FormErrorsType,
  FieldDynamicOptionsType,
  ChildrenType,
  ShowSkeletonLoadingType,
  FieldClassNameType,
  FieldStyleType,
} from "./primitiveTypes";
import {
  SetValueType,
  ValidateFieldType,
  ValidateFormType,
  ShouldShowFieldType,
  FetchDynamicOptionsType,
  GetFieldSchemaType,
  OnSubmitType,
  IsLoadingType,
} from "./functionTypes";
import { FormFieldType } from "./fieldTypes";

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
  fieldId: string;
  values: any;
  fieldSchema: FormFieldType;
  formSchema: FormDataCollectionType;
}
