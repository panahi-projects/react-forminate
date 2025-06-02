import { useContext, useEffect, useState } from "react";
import { FormFieldType, FormProviderType, SelectFieldType } from "../types";
import { isSelectField } from "../utils";
import { findFieldById, getInitialDependencies } from "./fieldDependency";
import { FormContext } from "./formContext";
import { useDynamicOptions } from "./useDynamicOptions";
import {
  shouldShowField,
  validateField as validateFieldOriginal,
  validateForm,
} from "./validation";

export const FormProvider: React.FC<FormProviderType> = ({
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
  const getFieldSchemaById = (fieldId: string) => {
    const field = findFieldById(
      fieldId,
      formSchema.fields,
      values,
      formSchema
    ) as FormFieldType | null;
    console.log("[Field Schema By ID]", fieldId, field);
    return field;
  };

  const handleVisibility = (field: FormFieldType) => {
    return shouldShowField(field, values);
  };

  const setValue = (field: string, value: any) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    validateField(field, value);

    Object.entries(dependencies).forEach(([key, val]) => {
      if (val === field || (Array.isArray(val) && val.includes(field))) {
        fetchDynamicOptions(key, newValues);
      }
    });
  };

  const traverseAndFetch = (fields: FormFieldType[]) => {
    for (const field of fields) {
      if (
        isSelectField(field) &&
        (field as SelectFieldType).dynamicOptions?.fetchOnInit
      ) {
        fetchDynamicOptions(field.fieldId, values);
      }
      if (field.fields && field.fields.length > 0) {
        traverseAndFetch(field.fields);
      }
    }
  };

  useEffect(() => {
    traverseAndFetch(formSchema.fields);
  }, []);

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
        getFieldSchema: getFieldSchemaById,
        formSchema,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
