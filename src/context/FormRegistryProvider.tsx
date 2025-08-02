import { useCallback, useState } from "react";
import { FormContextMap, FormRegistryContext } from "./FormRegistryContext";

export const FormRegistryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [forms, setForms] = useState<FormContextMap>({});

  const registerForm = useCallback(
    (formId: string, context: FormContextMap[string]) => {
      setForms((prev) => ({ ...prev, [formId]: context }));
    },
    []
  );
  const unregisterForm = useCallback((formId: string) => {
    setForms((prev) => {
      const newForms = { ...prev };
      delete newForms[formId];
      return newForms;
    });
  }, []);
  return (
    <FormRegistryContext.Provider
      value={{ forms, registerForm, unregisterForm }}
    >
      {children}
    </FormRegistryContext.Provider>
  );
};
