import {
  Observer,
  shouldShowField,
  validateField as validateFieldOriginal,
  validateForm,
} from "@/helpers";
import { useDebouncedCallback, useDynamicOptions } from "@/hooks";
import {
  FieldIdType,
  FormDataCollectionType,
  FormFieldType,
  FormProviderType,
  SelectFieldType,
  SupportedTypes,
} from "@/types";
import {
  collectFieldDependencies,
  extractFieldTypes,
  findFieldById,
  getInitialDependencies,
  isSelectField,
} from "@/utils";
import { useContext, useEffect, useMemo, useState } from "react";
import { FormContext } from "./formContext";
import { preloadFields } from "@/utils/preload";

export const FormProvider: React.FC<FormProviderType> = ({
  children,
  formSchema,
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [schema] = useState<FormDataCollectionType>(formSchema);
  const [touched, setTouchedState] = useState<Record<FieldIdType, boolean>>({});
  const [blurred, setBlurredState] = useState<Record<FieldIdType, boolean>>({});

  const { dynamicOptions, fetchDynamicOptions } = useDynamicOptions(formSchema);
  const existingContext = useContext(FormContext);
  const observer = new Observer();
  const { options } = formSchema;

  const dependencies = useMemo(
    () => getInitialDependencies(formSchema.fields),
    [formSchema.fields]
  );

  // Memoize expensive computations
  const dependencyMap = useMemo(
    () => collectFieldDependencies(formSchema.fields),
    [formSchema.fields]
  );

  // If context already exists, do NOT create a new one
  if (existingContext) {
    return <>{children}</>;
  }

  useEffect(() => {
    // Extract unique field types from schema
    const fieldTypes = extractFieldTypes(formSchema);

    // Preload when idle to avoid blocking render
    requestIdleCallback(() => {
      preloadFields(fieldTypes);
    });
  }, [formSchema]);

  const setTouched = (fieldId: string, isTouched: boolean) => {
    setTouchedState((prev) => ({ ...prev, [fieldId]: isTouched }));
  };

  const setBlurred = (fieldId: string, isBlurred: boolean) => {
    setBlurredState((prev) => ({ ...prev, [fieldId]: isBlurred }));
  };

  // Immediate state update
  const setValueImmediate = (fieldId: FieldIdType, value: SupportedTypes) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Debounced validation and side effects only
  const debouncedValidation = useDebouncedCallback(
    (fieldId: FieldIdType, value: SupportedTypes) => {
      const dependents = dependencyMap[fieldId];
      if (dependents?.length) {
        dependents.forEach((dep) => observer.notify(dep));
      }
      if (options?.validateFieldsOnBlur === false || blurred[fieldId]) {
        validateField(fieldId, value);
      }
      Object.entries(dependencies).forEach(([key, val]) => {
        if (val === fieldId || (Array.isArray(val) && val.includes(fieldId))) {
          fetchDynamicOptions(key, values);
        }
      });
    },
    500 // Slightly longer delay for validation
  );

  // Combined setValue handler
  const setValue = (fieldId: FieldIdType, value: SupportedTypes) => {
    setValueImmediate(fieldId, value); // Immediate UI update
    debouncedValidation(fieldId, value); // Debounced heavy operations
  };

  // Wrap validateField to match expected signature (only takes field & value)
  const validateField = (fieldId: FieldIdType, value: SupportedTypes) => {
    validateFieldOriginal(
      fieldId,
      value,
      formSchema,
      values,
      setErrors,
      touched,
      false
    );
  };

  // Wrapped validateForm so it takes zero arguments in the context
  const validateFormWrapper = async () => {
    return await validateForm(formSchema, values, setErrors, touched, true);
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
        formOptions: options,
        touched,
        blurred,
        setTouched,
        setBlurred,
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
