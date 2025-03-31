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
  validateField: (field: string, value: any) => void;
  validateForm: (form: FormDataCollection) => boolean;
  shouldShowField: (field: any) => boolean;
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
}

export interface BaseField {
  id: string;
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
  defaultValue?: any;
  styles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  labelClassName?: string;
  labelStyles?: React.CSSProperties;
}

export interface TextField extends BaseField {
  type: "text" | "number" | "email" | "password";
  validation?: {
    min?: number;
    max?: number;
  };
  placeholder?: string;
}

export interface DateField extends BaseField {
  type: "date";
}

export interface SelectField extends BaseField {
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
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
  options: string[];
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
  | TextField
  | DateField
  | SelectField
  | RadioField
  | CheckboxField
  | GroupField
  | ConditionalField;
