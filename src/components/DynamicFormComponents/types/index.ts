import React, {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type fieldIdType = string;

export interface FormDataCollectionType {
  formId: string;
  title: string;
  fields: FormFieldType[];
  baseUrl?: string;
}

export interface dynamicOptionsType {
  endpoint: string; // can contain placeholders like {{albumId}}
  method?: "GET" | "POST"; // default to GET
  dependsOn?: string | string[]; // support multiple dependencies
  params?: Record<string, string>; // query params as fieldId references
  headers?: Record<string, string>; // optional headers
  transformResponse?: (
    response: any
  ) => { label: string; value: any }[] | string[];
  resultPath?: string; // e.g., 'data.results' to extract nested result
  fetchOnInit?: boolean; // to fetch options on mount
  pagination?: {
    limit?: number;
    maxPage?: number;
    pageKey?: string; // default: "page"
    limitKey?: string; // default: "limit"
    skipKey?: string; // optional, if using skip
    pageMode?: "page" | "skip"; // determines if using page or skip
    startPage?: number; // e.g., 0 or 1
    metadataPath?: string; // path to access metadata like total pages
  };
}

export interface FormContextType {
  values: Record<string, any>;
  errors: Record<string, string>;
  dynamicOptions: Record<string, any[]>;
  setValue: (field: string, value: any) => void;
  validateField: (
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
  validateForm: (form: FormDataCollectionType) => boolean;
  shouldShowField: (field: FormFieldType) => boolean;
  fetchDynamicOptions: (
    fieldId: fieldIdType,
    allValues?: Record<string, any>,
    pagination?: { page?: number; limit?: number }
  ) => Promise<void>;
  getFieldSchema: (fieldId: fieldIdType) => FormFieldType;
  formSchema: FormDataCollectionType;
}

export interface FormProviderType {
  formId?: string;
  formSchema: FormDataCollectionType;
  children: React.ReactNode;
}

export interface DynamicFormType {
  formId?: string;
  formData: FormDataCollectionType;
  onSubmit?: (values: any, isValid: boolean) => void;
  isLoading?: boolean;
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
  fieldId: fieldIdType,
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
  fieldId: fieldIdType;
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

export interface SelectFieldType
  extends BaseField,
    SelectHTMLAttributes<HTMLSelectElement> {
  type: "select";
  options?: string[] | { label: string; value: any }[];
  dynamicOptions?: dynamicOptionsType;
}

export interface RadioFieldType extends BaseField {
  type: "radio";
  options: string[];
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
}

export interface CheckboxFieldType
  extends BaseField,
    Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type: "checkbox";
  options: string[];
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
  dependsOn: string;
  condition: "equals";
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
