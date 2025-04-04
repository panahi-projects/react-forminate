import React from "react";

export interface FormDataCollection {
  formId: string;
  title: string;
  fields: FormField[];
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
  fetchDynamicOptions: (fieldId: string, value: string) => void; // Function to fetch dynamic options
  getFieldSchema: (fieldId: string) => FormField; // Get Field schema for the current field
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
  fieldId: string,
  values: Record<string, any>,
  fieldSchema?: FormField,
  formSchema?: FormDataCollection
) => void;

type CustomEventHandlers = {
  onCustomChange?: FormEventHandler<
    React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomBlur?: FormEventHandler<
    React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomFocus?: FormEventHandler<
    React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomKeyDown?: FormEventHandler<
    React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomKeyUp?: FormEventHandler<
    React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomClick?: FormEventHandler<
    React.MouseEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomMouseEnter?: FormEventHandler<
    React.MouseEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomMouseLeave?: FormEventHandler<
    React.MouseEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomMouseDown?: FormEventHandler<
    React.MouseEvent<HTMLInputElement | HTMLSelectElement>
  >;
  onCustomContextMenu?: FormEventHandler<
    React.MouseEvent<HTMLInputElement | HTMLSelectElement>
  >;
};
export interface BaseField extends CustomEventHandlers {
  fieldId: string;
  label: string;
  type: string;
  required?: boolean;
  visibility?:
    | {
        dependsOn: string;
        condition: string;
        value: string;
      }
    | boolean;
  fields?: any[];
  className?: string;
  containerClassName?: string;
  styles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  labelClassName?: string;
  labelStyles?: React.CSSProperties;
  validation?: {
    pattern?: string;
    message?: string;
    min?: number;
    max?: number;
  };
}

export interface TextField
  extends BaseField,
    React.InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "number" | "email" | "password";
  placeholder?: string;
}

export interface DateField
  extends BaseField,
    React.InputHTMLAttributes<HTMLDataElement> {
  type: "date";
}

export interface SelectField
  extends BaseField,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  type: "select";
  options: string[];
  dynamicOptions?: {
    dependsOn: string;
    endpoint: string;
    method: string;
  };
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

export interface GroupField extends BaseField {
  type: "group";
  fields: FormField[];
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
  | GroupField
  | ConditionalField;
