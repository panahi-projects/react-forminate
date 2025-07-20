// formContext.ts
import { createContext, useContext } from "react";
import { FormContextType, SupportedTypes } from "@/types";

// Split contexts
export const FormActionsContext = createContext<
  Pick<
    FormContextType,
    | "setValue"
    | "validateField"
    | "validateForm"
    | "setTouched"
    | "setBlurred"
    | "fetchDynamicOptions"
    | "getFieldSchema"
    | "shouldShowField"
    | "observer"
  >
>(null!);

export const FormValuesContext = createContext<Record<string, SupportedTypes>>(
  {}
);
export const FormErrorsContext = createContext<Record<string, string>>({});
export const FormMetaContext = createContext<
  Pick<
    FormContextType,
    "dynamicOptions" | "formSchema" | "formOptions" | "touched" | "blurred"
  >
>(null!);

// Legacy context (for backwards compatibility)
export const FormContext = createContext<FormContextType | undefined>(
  undefined
);

// New optimized hooks
export const useFormActions = () => {
  const context = useContext(FormActionsContext);
  if (!context) throw new Error("Must be used within FormProvider");
  return context;
};

export const useFormValues = () => useContext(FormValuesContext);
export const useFormValue = (fieldId: string) => useFormValues()[fieldId];

export const useFormErrors = () => useContext(FormErrorsContext);
export const useFormError = (fieldId: string) => useFormErrors()[fieldId];

export const useFormMeta = () => {
  const context = useContext(FormMetaContext);
  if (!context) throw new Error("Must be used within FormProvider");
  return context;
};

// Legacy hook (backwards compatibility)
export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
