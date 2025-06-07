import { useContext, useEffect, useState } from "react";
import {
  FieldIdType,
  FormDataCollectionType,
  FormFieldType,
  FormProviderType,
  SelectFieldType,
  SupportedTypes,
} from "../types";
import { collectFieldDependencies, isSelectField } from "../utils";
import { Observer } from "../utils/observer";
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
  const [schema] = useState<FormDataCollectionType>(formSchema);
  const dependencies = getInitialDependencies(formSchema.fields);
  const { dynamicOptions, fetchDynamicOptions } = useDynamicOptions(formSchema);
  const existingContext = useContext(FormContext);
  const observer = new Observer();
  const dependencyMap = collectFieldDependencies(schema.fields);

  // If context already exists, do NOT create a new one
  if (existingContext) {
    return <>{children}</>;
  }

  const setValue = (fieldId: FieldIdType, value: SupportedTypes) => {
    const newValues = { ...values, [fieldId]: value };
    setValues(newValues);
    const dependents = dependencyMap[fieldId];
    if (dependents?.length) {
      dependents.forEach((dep) => {
        observer.notify(dep);
      });
    }

    validateField(fieldId, value);

    Object.entries(dependencies).forEach(([key, val]) => {
      if (val === fieldId || (Array.isArray(val) && val.includes(fieldId))) {
        fetchDynamicOptions(key, newValues);
      }
    });
  };

  // Wrap validateField to match expected signature (only takes field & value)
  const validateField = (fieldId: FieldIdType, value: SupportedTypes) => {
    validateFieldOriginal(fieldId, value, formSchema, values, setErrors);
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
    return field;
  };

  const handleVisibility = (field: FormFieldType) => {
    return shouldShowField(field, values);
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
        formSchema: schema,
        observer,
        setValue,
        validateField,
        validateForm: validateFormWrapper,
        shouldShowField: handleVisibility,
        fetchDynamicOptions,
        getFieldSchema: getFieldSchemaById,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
