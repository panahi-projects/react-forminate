// formHooks.ts
import { useContext } from "react";
import type { SupportedTypes, FieldIdType, FormContextType } from "@/types";
import {
  FormActionsContext,
  FormContext,
  FormErrorsContext,
  FormMetaContext,
  FormRegistryContext,
  FormValuesContext,
} from "@/context";

// Values hooks
export const useFormValues = (
  formId?: string
): Record<string, SupportedTypes> => {
  if (formId) {
    const context = useContext(FormRegistryContext);
    if (!context) {
      throw new Error(
        "useFormValues must be used within a FormRegistryProvider"
      );
    }
    return context?.forms?.[formId]?.values || {};
  }
  return useContext(FormValuesContext);
};

export const useFormValue = (
  fieldId: string,
  formId?: string
): SupportedTypes => {
  const values = useFormValues(formId);
  return values[fieldId];
};

// Actions hooks
export const useFormActions = (formId?: string) => {
  if (formId) {
    const context = useContext(FormRegistryContext);
    if (!context) {
      throw new Error(
        "useFormActions must be used within a FormRegistryProvider"
      );
    }
    return context?.forms?.[formId]?.actions || {};
  }
  return useContext(FormActionsContext);
};

// Errors hooks
export const useFormErrors = (formId?: string): Record<string, string> => {
  if (formId) {
    const context = useContext(FormRegistryContext);
    if (!context) {
      throw new Error(
        "useFormErrors must be used within a FormRegistryProvider"
      );
    }
    return context?.forms?.[formId]?.errors || {};
  }
  return useContext(FormErrorsContext);
};

export const useFormError = (fieldId: string, formId?: string): string => {
  const errors = useFormErrors(formId);
  return errors[fieldId] || "";
};

// Meta hooks
export const useFormMeta = (formId?: string) => {
  if (formId) {
    const context = useContext(FormRegistryContext);
    if (!context) {
      throw new Error("useFormMeta must be used within a FormRegistryProvider");
    }
    return context?.forms?.[formId]?.meta || {};
  }
  return useContext(FormMetaContext);
};

// Legacy hook (backwards compatibility)
export const useForm = (formId?: string): FormContextType => {
  if (formId) {
    const registeredContext = useContext(FormRegistryContext);
    const ctx = registeredContext?.forms[formId];
    if (ctx) {
      return {
        values: ctx.values,
        errors: ctx.errors,
        dynamicOptions: ctx.meta.dynamicOptions,
        formSchema: ctx.meta.formSchema,
        observer: ctx.actions.observer,
        formOptions: ctx.meta.formOptions,
        touched: ctx.meta.touched,
        blurred: ctx.meta.blurred,
        setTouched: ctx.actions.setTouched,
        setBlurred: ctx.actions.setBlurred,
        setValue: ctx.actions.setValue,
        validateField: ctx.actions.validateField,
        validateForm: ctx.actions.validateForm,
        shouldShowField: ctx.actions.shouldShowField,
        fetchDynamicOptions: ctx.actions.fetchDynamicOptions,
        getFieldSchema: ctx.actions.getFieldSchema,
      };
    }
  }
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};

// Convenience hooks
export const useFormTouched = (
  formId?: string
): Record<FieldIdType, boolean> => {
  const meta = useFormMeta(formId);
  return meta.touched;
};

export const useFormBlurred = (
  formId?: string
): Record<FieldIdType, boolean> => {
  const meta = useFormMeta(formId);
  return meta.blurred;
};

export const useFormSchema = (formId?: string) => {
  const meta = useFormMeta(formId);
  return meta.formSchema;
};

export const useFormOptions = (formId?: string) => {
  const meta = useFormMeta(formId);
  return meta.formOptions;
};

export const useFormDynamicOptions = (formId?: string) => {
  const meta = useFormMeta(formId);
  return meta.dynamicOptions;
};

export const useFormObserver = (formId?: string) => {
  const actions = useFormActions(formId);
  return actions.observer;
};

export const useFormFieldSchema = (fieldId: string, formId?: string) => {
  const actions = useFormActions(formId);
  return actions.getFieldSchema(fieldId);
};

export const useShouldShowField = (fieldId: string, formId?: string) => {
  const actions = useFormActions(formId);
  const fieldSchema = actions.getFieldSchema(fieldId);
  return fieldSchema ? actions.shouldShowField(fieldSchema) : false;
};
