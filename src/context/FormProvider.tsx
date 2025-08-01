import {
  Observer,
  setDefaultsRecursively,
  shouldShowField,
  validateField as validateFieldOriginal,
  validateForm,
} from "@/helpers";
import { shouldRefetchOptions, updateFieldCache } from "@/helpers";
import { useDebouncedCallback, useDynamicOptions } from "@/hooks";
import {
  FieldIdType,
  FormFieldType,
  FormProviderType,
  SupportedTypes,
} from "@/types";
import {
  collectFieldDependencies,
  extractFieldTypes,
  findFieldById,
  isSelectField,
} from "@/utils";
import { preloadFields } from "@/utils/preload";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  FormActionsContext,
  FormContext,
  FormErrorsContext,
  FormMetaContext,
  FormValuesContext,
} from "./formContext";

export const FormProvider: React.FC<FormProviderType> = ({
  children,
  formSchema,
}) => {
  // Split state into smaller chunks
  const [values, setValues] = useState<Record<string, any>>(() => {
    return setDefaultsRecursively(formSchema.fields);
  });

  // Use separate state for errors, touched, blurred
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<FieldIdType, boolean>>({});
  const [blurred, setBlurredState] = useState<Record<FieldIdType, boolean>>({});

  // Memoize all callbacks
  const setValueImmediate = (fieldId: FieldIdType, value: SupportedTypes) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const { dynamicOptions, fetchDynamicOptions } = useDynamicOptions(formSchema);

  const existingContext = useContext(FormContext);
  const observer = useMemo(() => new Observer(), []);
  const { options } = formSchema;

  // Stable reference for fetch function
  const stableFetchDynamicOptions = useCallback(
    async (fieldId: string, currentValues: Record<string, any>) => {
      const field = findFieldById(fieldId, formSchema.fields, currentValues);
      if (!field || !isSelectField(field) || !field.dynamicOptions) return;

      if (!shouldRefetchOptions(field, currentValues)) {
        return;
      }

      try {
        await fetchDynamicOptions(fieldId, currentValues);
        updateFieldCache(field, currentValues);
      } catch (error) {
        console.error(`Failed to fetch options for ${fieldId}`, error);
      }
    },
    [formSchema.fields, fetchDynamicOptions, values]
  );

  const dependencyMap = useMemo(
    () => collectFieldDependencies(formSchema.fields),
    [formSchema.fields]
  );

  if (existingContext) {
    return <>{children}</>;
  }

  useEffect(() => {
    const fieldTypes = extractFieldTypes(formSchema);
    requestIdleCallback(() => {
      preloadFields(fieldTypes);
    });
  }, [formSchema]);

  const setTouched = useMemo(
    () => (fieldId: string, isTouched: boolean) => {
      setTouchedState((prev) => ({ ...prev, [fieldId]: isTouched }));
    },
    []
  );

  const setBlurred = useMemo(
    () => (fieldId: string, isBlurred: boolean) => {
      setBlurredState((prev) => ({ ...prev, [fieldId]: isBlurred }));
    },
    []
  );

  const debouncedValidation = useDebouncedCallback(
    useCallback(
      (fieldId: FieldIdType, value: SupportedTypes) => {
        const dependents = dependencyMap[fieldId];
        if (dependents?.length) {
          dependents.forEach((dep) => observer.notify(dep));
        }

        if (options?.validateFieldsOnBlur === false || blurred[fieldId]) {
          validateField(fieldId, value);
        }

        // Only fetch for dependent fields
        if (dependencyMap[fieldId]) {
          dependencyMap[fieldId].forEach(async (dependentFieldId) => {
            await stableFetchDynamicOptions(dependentFieldId, values);
          });
        }
      },
      [formSchema, values]
    ),
    500
  );

  const setValue = useMemo(
    () => (fieldId: FieldIdType, value: SupportedTypes) => {
      setValueImmediate(fieldId, value);
      debouncedValidation(fieldId, value);
    },
    [debouncedValidation]
  );

  const validateField = useMemo(
    () => (fieldId: FieldIdType, value: SupportedTypes) => {
      validateFieldOriginal(
        fieldId,
        value,
        formSchema,
        values,
        setErrors,
        touched,
        false
      );
    },
    [formSchema, touched, values]
  );

  const validateFormWrapper = useMemo(
    () => async () => {
      return await validateForm(formSchema, values, setErrors, touched, true);
    },
    [formSchema, touched, values]
  );

  const getFieldSchemaById = useMemo(
    () => (fieldId: string) => {
      return findFieldById(
        fieldId,
        formSchema.fields,
        values,
        formSchema
      ) as FormFieldType | null;
    },
    [formSchema, values]
  );

  const handleVisibility = useMemo(
    () => (field: FormFieldType) => {
      return shouldShowField(field, values, formSchema);
    },
    [formSchema, values]
  );

  // Memoized actions
  const actions = useMemo(
    () => ({
      setValue,
      validateField,
      validateForm: validateFormWrapper,
      setTouched,
      setBlurred,
      fetchDynamicOptions,
      getFieldSchema: getFieldSchemaById,
      shouldShowField: handleVisibility,
      observer,
    }),
    [
      setValue,
      validateField,
      validateFormWrapper,
      setTouched,
      setBlurred,
      fetchDynamicOptions,
      getFieldSchemaById,
      handleVisibility,
      observer,
    ]
  );

  // Memoized meta
  const meta = useMemo(
    () => ({
      dynamicOptions,
      formSchema,
      formOptions: options,
      touched,
      blurred,
    }),
    [dynamicOptions, formSchema, options, touched, blurred]
  );

  // Initialize dynamic options (only once on mount)
  useEffect(() => {
    const traverseAndFetch = async (fields: FormFieldType[]) => {
      for (const field of fields) {
        if (isSelectField(field)) {
          if (field.dynamicOptions?.fetchOnInit) {
            await stableFetchDynamicOptions(field.fieldId, values);
          }
        }
        if (field.fields?.length) {
          await traverseAndFetch(field.fields);
        }
      }
    };

    traverseAndFetch(formSchema.fields);
  }, [formSchema.fields, stableFetchDynamicOptions]);

  return (
    <FormActionsContext.Provider value={actions}>
      <FormValuesContext.Provider value={values}>
        <FormErrorsContext.Provider value={errors}>
          <FormMetaContext.Provider value={meta}>
            {/* Legacy context provider for backwards compatibility */}
            <FormContext.Provider
              value={{
                values,
                errors,
                dynamicOptions,
                formSchema,
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
          </FormMetaContext.Provider>
        </FormErrorsContext.Provider>
      </FormValuesContext.Provider>
    </FormActionsContext.Provider>
  );
};
