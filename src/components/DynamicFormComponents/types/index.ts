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

export interface BaseField {
  fieldId: string;
  label: string;
  type: string;
  required?: boolean;
  visibility?: {
    dependsOn: string;
    condition: string;
    value: string;
  };
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

export interface DateField extends BaseField {
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

export interface RadioField extends BaseField {
  type: "radio";
  options: string[];
  itemsStyles?: React.CSSProperties;
  itemsClassName?: string;
}

export interface CheckboxField extends BaseField {
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
