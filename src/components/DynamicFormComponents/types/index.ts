import React, { HTMLAttributes } from "react";

type fieldIdType = string;
export interface FormDataCollection {
  formId: string;
  title: string;
  fields: FormField[];
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
  dynamicOptions: Record<string, any[]>; // Store dynamic options for fields
  setValue: (field: string, value: any) => void;
  validateField: (
    field: string,
    value: any,
    formSchema: FormDataCollection,
    values: Record<string, any>,
    setErrors: (
      update:
        | Record<string, string>
        | ((prev: Record<string, string>) => Record<string, string>)
    ) => void
  ) => void;
  validateForm: (form: FormDataCollection) => boolean;
  shouldShowField: (field: FormField) => boolean;
  fetchDynamicOptions: (
    fieldId: fieldIdType,
    allValues?: Record<string, any>,
    pagination?: { page?: number; limit?: number }
  ) => Promise<void>; // Function to fetch dynamic options
  getFieldSchema: (fieldId: fieldIdType) => FormField; // Get Field schema for the current field
  formSchema: FormDataCollection; // Form schema for the current form
}

export interface FormProviderProps {
  formId?: string;
  formSchema: FormDataCollection;
  children: React.ReactNode;
}

export interface DynamicFormProps {
  formId?: string;
  formData: FormDataCollection;
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
  customProvider?: React.FC<FormProviderProps>;
  skeleton?: React.ReactNode;
  showSkeletonLoading?: boolean;
}

type FormEventHandler<E> = (
  e: E,
  fieldId: fieldIdType,
  values: Record<string, any>,
  fieldSchema?: FormField,
  formSchema?: FormDataCollection
) => void;

type CustomChangeEventTypes =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

type CustomEventHandlers = {
  events?: {
    onCustomChange?: FormEventHandler<
      React.ChangeEvent<CustomChangeEventTypes>
    >;
    onCustomBlur?: FormEventHandler<React.FocusEvent<CustomChangeEventTypes>>;
    onCustomFocus?: FormEventHandler<React.FocusEvent<CustomChangeEventTypes>>;
    onCustomKeyDown?: FormEventHandler<
      React.KeyboardEvent<CustomChangeEventTypes>
    >;
    onCustomKeyUp?: FormEventHandler<
      React.KeyboardEvent<CustomChangeEventTypes>
    >;
    onCustomClick?: FormEventHandler<React.MouseEvent<CustomChangeEventTypes>>;
    onCustomMouseEnter?: FormEventHandler<
      React.MouseEvent<CustomChangeEventTypes>
    >;
    onCustomMouseLeave?: FormEventHandler<
      React.MouseEvent<CustomChangeEventTypes>
    >;
    onCustomMouseDown?: FormEventHandler<
      React.MouseEvent<CustomChangeEventTypes>
    >;
    onCustomContextMenu?: FormEventHandler<
      React.MouseEvent<CustomChangeEventTypes>
    >;
  };
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
    | {
        dependsOn: string;
        condition: string;
        value: string;
      }
    | boolean;
  fields?: FormField[];
  className?: string;
  containerClassName?: string;
  styles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  labelClassName?: string;
  labelStyles?: React.CSSProperties;
  validation?: ValidationRule[];
  disabled?: boolean;
}

export interface TextField
  extends BaseField,
    React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "number" | "email" | "password";
  placeholder?: string;
  autoCorrect?: "on" | "off";
  autoCapitalize?: "on" | "off" | "sentences" | "words" | "characters";
  spellCheck?: boolean;
  // autoComplete?: "on" | "off" | "name" | "email" | "username" | "new-password";
  autoFocus?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  step?: number;
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
  fields?: FormField[];
  className?: string;
  styles?: React.CSSProperties;
  legendClassName?: string;
  legendStyles?: React.CSSProperties;
}

export interface TextareaField
  extends BaseField,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  autoCorrect?: "on" | "off";
  autoCapitalize?: "on" | "off" | "sentences" | "words" | "characters";
  spellCheck?: boolean;
  autoComplete?: "on" | "off" | "name" | "email" | "username" | "new-password";
  autoFocus?: boolean;
  pattern?: string;
}

// ✅ Clean version of ExtractFieldIds
type ExtractFieldIds<T extends { fieldId: string }[]> = T[number]["fieldId"];

// ✅ Updated BaseContainerField
export interface BaseContainerField<T extends FormField[]>
  extends Omit<BaseField, "fields">,
    React.InputHTMLAttributes<HTMLInputElement> {
  type: "container";
  as: "div" | "section" | "article" | "main" | "header" | "footer";
  columns?: number;
  gap?: number;
  fields: T;
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
  containerStyles?: React.CSSProperties;
  containerClassName?: string;
  styles: React.CSSProperties;
  className: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  itemsParentAttributes?: {
    [K in ExtractFieldIds<T>]?: HTMLAttributes<HTMLElement> & {
      colSpan?: number;
      style?: React.CSSProperties;
      [key: string]: any; // Allow any other attributes
    };
  };
}

// ✅ ContainerField specialization
export type ContainerField = BaseContainerField<FormField[]>;

export interface DateField
  extends BaseField,
    React.InputHTMLAttributes<HTMLInputElement> {
  type: "date";
}

export interface SelectField
  extends BaseField,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  type: "select";
  options?: string[] | { label: string; value: any }[];
  dynamicOptions?: dynamicOptionsType;
}

export interface RadioField
  extends BaseField,
    React.InputHTMLAttributes<HTMLInputElement> {
  type: "radio";
  options: string[];
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
}

type InputPropsWithoutType = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export interface CheckboxField extends BaseField, InputPropsWithoutType {
  type: "checkbox";
  options: string[];
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
}

export interface GridViewFieldProps extends BaseField {
  type: "gridview";
  required?: boolean;
  dynamicOptions?: dynamicOptionsType;
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
}

export interface SpacerField extends BaseField {
  as: "div" | "section" | "span" | "p" | "hr" | "br";
  type: "spacer";
  width?: string | number; // default: "100%"
  height?: string | number; // default: 16
  children?: React.ReactNode;
}

export interface VisibilityCondition {
  dependsOn: string;
  condition: "equals";
  value: string;
}

export interface ConditionalField extends BaseField {
  visibility?: VisibilityCondition;
}

export type FormField =
  | BaseField
  | TextField
  | DateField
  | SelectField
  | RadioField
  | CheckboxField
  | GroupFieldType
  | ConditionalField
  | GridViewFieldProps
  | ContainerField
  | TextareaField
  | SpacerField;
