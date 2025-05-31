import React, {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

// Primitive types
export type FieldIdType = string;
export type FieldTypeType = string;
export type FieldLabelType = string;
export type FieldRequiredType = boolean;
export type FieldRequiredMessageType = string;
export type VisibilityConditionType = "equals" | "not_equals";
export type FieldVisibilityType =
  | boolean
  | {
      dependsOn: FieldIdType;
      condition: VisibilityConditionType;
      value: string | number;
    };
export type FieldClassNameType = string;
export type FieldStyleType = React.CSSProperties;
export type FieldDisabledType = boolean;
export type FieldDefaultValueType = unknown;
export type FieldInputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "url"
  | "tel"
  | "search";
export type FieldPlaceholderType = string;
export type FieldAutoCorrectType = "on" | "off";
export type FieldAutoCapitalizeType =
  | "on"
  | "off"
  | "sentences"
  | "words"
  | "characters";
export type FieldSpellCheckType = boolean;
export type FieldAutoFocusType = boolean;
export type FieldStepType = number;
export type FieldDatepickerType = "date";
export type FieldSelectType = "select";
export type FieldRadioType = "radio";
export type FieldCheckboxType = "checkbox";
export type FieldTextareaType = "textarea";
export type FieldGroupType = "group";
export type FieldGridViewType = "gridview";
export type FieldSpacerType = "spacer";
export type FieldContainerType = "container";
export type FieldTextareaRowsType = number;
export type FieldTextareaColsType = number;
export type FieldAsHTMLTagType =
  | "fieldset"
  | "div"
  | "section"
  | "article"
  | "main"
  | "header"
  | "footer"
  | "span"
  | "P"
  | "hr"
  | "br";
export type WidthType = string | number;
export type HeightType = string | number;

export type OptionsType =
  | string
  | {
      value: string | number;
      label: string | number;
    };
export type ExtractFieldIds<T extends { fieldId: string }[]> =
  T[number]["fieldId"];

// -------------------------------------------
export type FormIdType = string;
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
export type ShowSkeletonLoadingType = boolean;

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

export type SubmitDetailsType = {
  visibility?: boolean;
  text?: string;
  className?: string;
  styles?: React.CSSProperties;
  containerClassName?: string;
  containerStyles?: React.CSSProperties;
};
export type CustomProviderType = React.FC<FormProviderType>;

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
export type ValidationPatternType = string;
export type MessageType = string;
export type MinType = number;
export type MaxType = number;
export type MinLengthType = number;
export type MaxLengthType = number;
export type ValidationCustomRuleType = (value: any) => boolean;
export type ColumnsType = number;
export type GapType = number;
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
  customProvider?: CustomProviderType;
  skeleton?: ChildrenType;
  showSkeletonLoading?: ShowSkeletonLoadingType;
}

export interface ValidationRule {
  pattern?: ValidationPatternType;
  message?: MessageType;
  min?: MinType;
  max?: MaxType;
  minLength?: MinLengthType;
  maxLength?: MaxLengthType;
  custom?: ValidationCustomRuleType;
}

export interface BaseField extends CustomEventHandlers {
  fieldId: FieldIdType;
  type: FieldTypeType;
  label?: FieldLabelType;
  required?: FieldRequiredType;
  requiredMessage?: FieldRequiredMessageType;
  visibility?: FieldVisibilityType;
  fields?: FormFieldType[];
  className?: FieldClassNameType;
  containerClassName?: FieldClassNameType;
  styles?: FieldStyleType;
  containerStyles?: FieldStyleType;
  labelClassName?: FieldClassNameType;
  labelStyles?: FieldStyleType;
  validation?: ValidationRule[];
  disabled?: FieldDisabledType;
  _defaultValue?: FieldDefaultValueType;
}

export interface TextFieldType
  extends BaseField,
    InputHTMLAttributes<HTMLInputElement> {
  type: FieldInputType;
  placeholder?: FieldPlaceholderType;
  autoCorrect?: FieldAutoCorrectType;
  autoCapitalize?: FieldAutoCapitalizeType;
  spellCheck?: FieldSpellCheckType;
  autoFocus?: FieldAutoFocusType;
  step?: FieldStepType;
}

export interface DateFieldType
  extends BaseField,
    InputHTMLAttributes<HTMLInputElement> {
  type: FieldDatepickerType;
}
export interface SelectFieldType
  extends BaseField,
    SelectHTMLAttributes<HTMLSelectElement> {
  type: FieldSelectType;
  options?: OptionsType[];
  dynamicOptions?: dynamicOptionsType;
  placeholder?: FieldPlaceholderType;
}

export interface RadioFieldType extends BaseField {
  type: FieldRadioType;
  options: OptionsType[];
  itemsClassName: FieldClassNameType;
  itemsStyles: FieldStyleType;
}

export interface CheckboxFieldType
  extends BaseField,
    Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type: FieldCheckboxType;
  options: OptionsType[];
  itemsClassName: FieldClassNameType;
  itemsStyles: FieldStyleType;
}

export interface TextareaFieldType
  extends BaseField,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: FieldTextareaType;
  placeholder?: FieldPlaceholderType;
  rows?: FieldTextareaRowsType;
  cols?: FieldTextareaColsType;
  autoCorrect?: FieldAutoCorrectType;
  autoCapitalize?: FieldAutoCapitalizeType;
  spellCheck?: FieldSpellCheckType;
  autoFocus?: FieldAutoFocusType;
}

export interface GroupFieldType extends BaseField {
  type: FieldGroupType;
  as?: FieldAsHTMLTagType;
  label: FieldLabelType;
  legendClassName?: FieldClassNameType;
  legendStyles?: FieldStyleType;
}

export interface GridViewFieldType extends BaseField {
  type: FieldGridViewType;
  required?: FieldRequiredType;
  dynamicOptions?: dynamicOptionsType;
  itemsClassName?: FieldClassNameType;
  itemsStyles?: FieldStyleType;
}

export interface SpacerFieldType extends BaseField {
  type: FieldSpacerType;
  as: FieldAsHTMLTagType;
  width?: WidthType;
  height?: HeightType;
  children?: ChildrenType;
}

export interface BaseContainerField<T extends FormFieldType[]>
  extends Omit<BaseField, "fields"> {
  type: FieldContainerType;
  as: FieldAsHTMLTagType;
  columns?: ColumnsType;
  gap?: GapType;
  fields: T;
  itemsStyles?: FieldStyleType;
  itemsClassName?: FieldClassNameType;
  children?: ChildrenType;
  header?: ChildrenType;
  footer?: ChildrenType;
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
  | GridViewFieldType
  | ContainerFieldType
  | TextareaFieldType
  | SpacerFieldType;

export interface FieldPropContext {
  fieldId: FieldIdType;
  values: any;
  fieldSchema: FormFieldType;
  formSchema: FormDataCollectionType;
}
