import { buildFieldEventHandlers, initFieldSetup } from "@/helpers";
import { BaseField, SupportedTypes } from "@/types";
import { fallbackValue } from "@/utils";
import { useMemo, useState, useCallback } from "react";
import {
  useForm,
  useFormActions,
  useFormError,
  useFormMeta,
  useFormValue,
} from "./formHooks";

export const useOptimizedField = <
  T extends BaseField,
  E extends HTMLElement = HTMLInputElement,
>(
  fieldProps: T
) => {
  // 1. All hooks called at the top level (no conditionals)
  const value = useFormValue(fieldProps.fieldId);
  const fieldError = useFormError(fieldProps.fieldId);
  const { validateField, setTouched } = useFormActions();
  const { touched, blurred, formSchema, formOptions } = useFormMeta();
  const formContext = useForm();
  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  // 2. Derived value
  const fieldValue = useMemo(
    () => value ?? fallbackValue[fieldProps.type],
    [value, fieldProps.type]
  );

  // 3. Stable callbacks (don't call hooks inside them!)
  const handleBlur = useCallback(
    (e: React.FocusEvent<E>) => {
      setTouched(fieldProps.fieldId, true);

      if (hasBeenFocused && formOptions?.validateFieldsOnBlur !== false) {
        validateField(fieldProps.fieldId, fieldValue as SupportedTypes);
      }

      fieldProps.events?.onCustomBlur?.(
        e,
        fieldProps.fieldId,
        formContext.values,
        fieldProps,
        formSchema
      );
    },
    [
      setTouched,
      fieldProps,
      hasBeenFocused,
      formOptions?.validateFieldsOnBlur,
      validateField,
      fieldValue,
      formContext.values,
      formSchema,
    ]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<E>) => {
      setHasBeenFocused(true);
      fieldProps.events?.onCustomFocus?.(
        e,
        fieldProps.fieldId,
        formContext.values,
        fieldProps,
        formSchema
      );
    },
    [fieldProps, formContext.values, formSchema]
  );

  // 4. Build event handlers (ensure this function doesn't use hooks internally!)
  const eventHandlers = buildFieldEventHandlers<E>({
    fieldId: fieldProps.fieldId,
    type: fieldProps.type,
    value: fieldValue,
    ...fieldProps.events,
    onCustomBlur: handleBlur,
    onCustomFocus: handleFocus,
    onCustomUpload: fieldProps.events?.onCustomUpload as any,
  });

  // 5. Calculate field parameters
  const fieldParams = useMemo(() => {
    const params = initFieldSetup(
      fieldProps.type,
      fieldProps,
      touched[fieldProps.fieldId],
      !!fieldError
    );

    if (fieldError) {
      params.className = `${params.className || ""} field-validation-error`;
    }

    return params;
  }, [fieldProps, touched, fieldError]);

  // 6. Final memoized return value
  return useMemo(
    () => ({
      value: fieldValue,
      error: fieldError,
      touched: touched[fieldProps.fieldId],
      blurred: blurred[fieldProps.fieldId],
      props: fieldProps,
      fieldParams,
      eventHandlers,
      formContext,
    }),
    [
      fieldValue,
      fieldError,
      touched,
      blurred,
      fieldProps,
      fieldParams,
      eventHandlers,
      formContext,
    ]
  );
};
