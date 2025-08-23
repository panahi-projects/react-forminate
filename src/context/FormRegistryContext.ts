import { FormContextType, SupportedTypes } from "@/types";
import { createContext, useContext } from "react";

// Create a map of form contexts keyed by formId
export type FormContextMap = {
  [formId: string]: {
    actions: Pick<
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
      | "resetForm"
    >;
    values: Record<string, SupportedTypes>;
    errors: Record<string, string>;
    meta: Pick<
      FormContextType,
      "dynamicOptions" | "formSchema" | "formOptions" | "touched" | "blurred"
    >;
  };
};

export const FormRegistryContext = createContext<{
  forms: FormContextMap;
  registerForm: (formId: string, context: FormContextMap[string]) => void;
  unregisterForm: (formId: string) => void;
}>({
  forms: {},
  registerForm: () => {},
  unregisterForm: () => {},
});

export const useFormReg = () => {
  const context = useContext(FormRegistryContext);
  if (!context) {
    throw new Error("useFormReg must be used within a FormRegistryProvider");
  }
  return context.forms;
};

// Keep existing contexts for backwards compatibility
export const FormActionsContext = createContext<
  FormContextMap[string]["actions"]
>(null!);
export const FormValuesContext = createContext<Record<string, SupportedTypes>>(
  {}
);
export const FormErrorsContext = createContext<Record<string, string>>({});
export const FormMetaContext = createContext<FormContextMap[string]["meta"]>(
  null!
);
export const FormContext = createContext<FormContextType | undefined>(
  undefined
);
