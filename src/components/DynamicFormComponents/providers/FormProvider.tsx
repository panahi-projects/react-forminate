import { createContext, useContext, useEffect, useState } from "react";
import { FormContextType } from "../types";

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{
  children: React.ReactNode;
  formSchema: any;
}> = ({ children, formSchema }) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );

  // Store dependencies for dynamic fields
  const initialDependencies = (fields: any[]): Record<string, string> => {
    const dependencies: Record<string, string> = {};

    const traverseFields = (fields: any[]) => {
      fields.forEach((field) => {
        // Check if the current field has a dependency
        if (field.dynamicOptions && field.dynamicOptions.dependsOn) {
          dependencies[field.id] = field.dynamicOptions.dependsOn;
        }

        // If the field is a group or has nested fields, recursively traverse them
        if (field.type === "group" || field.fields) {
          traverseFields(field.fields);
        }
      });
    };

    traverseFields(fields); // Start the traversal
    return dependencies;
  };

  const [dependencies, setDependencies] = useState<Record<string, string>>(
    initialDependencies(formSchema.fields)
  );

  const findFieldById = (fieldId: string, fields: any[]): any | null => {
    for (const field of fields) {
      if (field.id === fieldId) return field;
      if (field.type === "group" && field.fields) {
        const found = findFieldById(fieldId, field.fields);
        if (found) return found;
      }
    }
    return null;
  };

  const fetchDynamicOptions = async (fieldId: string, value: string) => {
    const field = findFieldById(fieldId, formSchema.fields);
    if (!field || !field.dynamicOptions) return;

    const { dependsOn, endpoint } = field.dynamicOptions;
    if (!dependsOn) return;

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          endpoint +
          `?${dependsOn}=${value}`
      );
      if (response.ok && response !== undefined) {
        const data = await response.json();
        setDynamicOptions((prev) => ({
          ...prev,
          [fieldId]: data,
        }));
      } else {
        console.log("An unknown error occurred");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.log("Failed to fetch data.");
      }
    }
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

  const validateField = (field: string, value: any) => {
    let errorMessage = "";

    const fieldSchema = findFieldById(field, formSchema.fields);
    if (fieldSchema && !shouldShowField(fieldSchema)) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return;
    }

    if (typeof value === "string" && value.trim() === "") {
      errorMessage = "This field is required.";
    } else if (Array.isArray(value) && value.length === 0) {
      errorMessage = "At least one option must be selected.";
    }

    setErrors((prev) => {
      if (errorMessage) {
        return { ...prev, [field]: errorMessage };
      } else {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
    });
  };

  const validateForm = (formFields: any[]) => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    const validateFieldRecursive = (fields: any[]) => {
      fields.forEach((field) => {
        if (field.type === "group" && field.fields) {
          validateFieldRecursive(field.fields);
        } else if (
          field.required &&
          (!values[field.id] || values[field.id].length === 0) &&
          shouldShowField(field)
        ) {
          newErrors[field.id] = "This field is required.";
          isValid = false;
        }
      });
    };

    validateFieldRecursive(formFields);

    setErrors(newErrors);
    return isValid;
  };

  const shouldShowField = (field: any) => {
    if (!field.visibility) return true;

    const { dependsOn, condition, value } = field.visibility;
    const parentValue = values[dependsOn];

    switch (condition) {
      case "equals":
        return parentValue === value;
      case "not_equals":
        return parentValue !== value;
      default:
        return true;
    }
  };

  useEffect(() => {
    console.log("dependencies ===", dependencies);
  }, [dependencies]);

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        dynamicOptions,
        setValue,
        validateField,
        validateForm,
        shouldShowField,
        fetchDynamicOptions,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
