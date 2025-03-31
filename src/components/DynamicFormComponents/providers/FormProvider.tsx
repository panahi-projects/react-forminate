import { useContext, useState } from "react";
import { FormField, FormProviderProps } from "../types";
import { getInitialDependencies } from "./fieldDependency";
import { FormContext } from "./formContext";
import { useDynamicOptions } from "./useDynamicOptions";
import {
  shouldShowField,
  validateField as validateFieldOriginal,
  validateForm,
} from "./validation";

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  formSchema,
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dependencies = getInitialDependencies(formSchema.fields);
  const { dynamicOptions, fetchDynamicOptions } = useDynamicOptions(formSchema);

  const existingContext = useContext(FormContext);

  // If context already exists, do NOT create a new one
  if (existingContext) {
    return <>{children}</>;
  }

  // Wrap validateField to match expected signature (only takes field & value)
  const validateField = (field: string, value: any) => {
    validateFieldOriginal(field, value, formSchema, values, setErrors);
  };

  // Wrapped validateForm so it takes zero arguments in the context
  const validateFormWrapper = () => {
    return validateForm(formSchema, values, setErrors);
  };

  const handleVisibility = (field: FormField) => {
    return shouldShowField(field, values);
  };

  const setValue = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);

    Object.entries(dependencies).forEach(([key, val]) => {
      if (val === field) {
        fetchDynamicOptions(key, value);
      }
    });
  };

  // useEffect(() => {
  //   console.log("dependencies:", dependencies);
  // }, [dependencies]);

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        dynamicOptions,
        setValue,
        validateField,
        validateForm: validateFormWrapper,
        shouldShowField: handleVisibility,
        fetchDynamicOptions,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
