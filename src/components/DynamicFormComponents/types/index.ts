import React, {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

// Primitive types
export type FormIdType = string;
export type FieldIdType = string;
export type TitleType = string;
export type BaseUrlType = string;
export type DescriptionType = string;
export type APIEndpointType = string;
export type APIMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type APIDependsOnType = string | string[];
export type APIParamsType = Record<string, string>;
export type APIHeadersType = Record<string, string>;
export type APITransformResponseType = (
  response: any
) => { label: string; value: any }[] | string[];
export type APIResultPathType = string;
export type APIfetchOnInitType = boolean;
export type FormValuesType = Record<FieldIdType, any>;
export type FormErrorsType = Record<FieldIdType, string>;
export type FieldDynamicOptionsType = Record<FieldIdType, any[]>;
export type ChildrenType = React.ReactNode;

// API Pagination
export type APIPaginationType = {
  limit?: number;
  maxPage?: number;
  pageKey?: string; // default: "page"
  limitKey?: string; // default: "limit"
  skipKey?: string; // optional, if using skip
  pageMode?: "page" | "skip"; // determines if using page or skip
  startPage?: number; // e.g., 0 or 1
  metadataPath?: string; // path to access metadata like total pages
};

// Functions
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

//! ______________________________________________________________
export interface FormDataCollectionType {
  formId: FormIdType;
  title: TitleType;
  fields: FormFieldType[];
  baseUrl?: BaseUrlType;
  description?: DescriptionType;
}

export interface dynamicOptionsType {
  endpoint: APIEndpointType; // can contain placeholders like {{albumId}}
  method?: APIMethodType; // default to GET
  dependsOn?: APIDependsOnType; // support multiple dependencies
  params?: APIParamsType; // query params as fieldId references
  headers?: APIHeadersType; // optional headers
  transformResponse?: APITransformResponseType;
  resultPath?: APIResultPathType; // e.g., 'data.results' to extract nested result
  fetchOnInit?: APIfetchOnInitType; // to fetch options on mount
  pagination?: APIPaginationType;
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
  submitDetails?: {
    visibility?: boolean;
    text?: string;
    className?: string;
    styles?: React.CSSProperties;
    containerClassName?: string;
    containerStyles?: React.CSSProperties;
  };
  customProvider?: React.FC<FormProviderType>;
  skeleton?: React.ReactNode;
  showSkeletonLoading?: boolean;
}

type FormEventHandler<E> = (
  e: E,
  fieldId: FieldIdType,
  values: Record<string, any>,
  fieldSchema?: FormFieldType,
  formSchema?: FormDataCollectionType
) => void;

type CustomEventHandlers = {
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

export interface ValidationRule {
  pattern?: string;
  message?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  custom?: (value: any) => boolean;
}

export interface BaseField extends CustomEventHandlers {
  fieldId: FieldIdType;
  type: string;
  label?: string;
  required?: boolean;
  requiredMessage?: string;
  visibility?:
    | boolean
    | {
        dependsOn: string;
        condition: string;
        value: string;
      };
  fields?: FormFieldType[];
  className?: string;
  containerClassName?: string;
  styles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  labelClassName?: string;
  labelStyles?: React.CSSProperties;
  validation?: ValidationRule[];
  disabled?: boolean;
  _defaultValue?: unknown;
}

export interface TextFieldType
  extends BaseField,
    InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "number" | "email" | "password";
  placeholder?: string;
  autoCorrect?: "on" | "off";
  autoCapitalize?: "on" | "off" | "sentences" | "words" | "characters";
  spellCheck?: boolean;
  autoFocus?: boolean;
  step?: number;
}

export interface DateFieldType
  extends BaseField,
    InputHTMLAttributes<HTMLInputElement> {
  type: "date";
}
export type OptionsType =
  | string
  | {
      value: string | number;
      label: string | number;
    };
export interface SelectFieldType
  extends BaseField,
    SelectHTMLAttributes<HTMLSelectElement> {
  type: "select";
  options?: OptionsType[];
  dynamicOptions?: dynamicOptionsType;
  placeholder?: string;
}

export interface RadioFieldType extends BaseField {
  type: "radio";
  options: OptionsType[];
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
}

export interface CheckboxFieldType
  extends BaseField,
    Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type: "checkbox";
  options: OptionsType[];
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
}

export interface TextareaFieldType
  extends BaseField,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  cols?: number;
  autoCorrect?: "on" | "off";
  autoCapitalize?: "on" | "off" | "sentences" | "words" | "characters";
  spellCheck?: boolean;
  autoFocus?: boolean;
}

export interface GroupFieldType extends BaseField {
  type: "group";
  as?:
    | "fieldset"
    | "div"
    | "section"
    | "article"
    | "main"
    | "header"
    | "footer";
  label: string;
  legendClassName?: string;
  legendStyles?: React.CSSProperties;
}

export interface GridViewFieldType extends BaseField {
  type: "gridview";
  required?: boolean;
  dynamicOptions?: dynamicOptionsType;
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
}

export interface SpacerFieldType extends BaseField {
  type: "spacer";
  as: "div" | "section" | "span" | "p" | "hr" | "br";
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
}

export interface VisibilityConditionType {
  dependsOn: FieldIdType;
  condition: "equals" | "not_equals";
  value: string;
}

export interface ConditionalFieldType extends BaseField {
  visibility?: VisibilityConditionType;
}

type ExtractFieldIds<T extends { fieldId: string }[]> = T[number]["fieldId"];

export interface BaseContainerField<T extends FormFieldType[]>
  extends Omit<BaseField, "fields"> {
  type: "container";
  as: "div" | "section" | "article" | "main" | "header" | "footer";
  columns?: number;
  gap?: number;
  fields: T;
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  itemsParentAttributes?: {
    [K in ExtractFieldIds<T>]?: HTMLAttributes<HTMLElement> & {
      colSpan?: number;
      [key: string]: any;
    };
  };
}

export type ContainerFieldType = BaseContainerField<FormFieldType[]>;

export type FormFieldType =
  | BaseField
  | TextFieldType
  | DateFieldType
  | SelectFieldType
  | RadioFieldType
  | CheckboxFieldType
  | GroupFieldType
  | ConditionalFieldType
  | GridViewFieldType
  | ContainerFieldType
  | TextareaFieldType
  | SpacerFieldType;

export interface FieldPropContext {
  fieldId: string;
  values: any;
  fieldSchema: FormFieldType;
  formSchema: FormDataCollectionType;
}
