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
  DependencyMap,
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
import { DependencyManager } from "../utils/dependencyManager";

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
  dependencyManager: DependencyManager;
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
  skeleton?: ChildrenType;
  showSkeletonLoading?: ShowSkeletonLoadingType;
}

export interface FieldPropContext {
  fieldId: FieldIdType;
  values: Record<string, SupportedTypes>;
  fieldSchema: FormFieldType;
  formSchema: FormDataCollectionType;
}
