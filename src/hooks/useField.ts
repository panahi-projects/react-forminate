//Global internal imports
import { buildFieldEventHandlers, initFieldSetup } from "@/helpers";
import { BaseField, FieldIdType } from "@/types";
import { fallbackValue } from "@/utils";

//Relative internal import

//External libraries & tools import
import { useEffect, useMemo, useState } from "react";
import {
  useFormActions,
  useFormErrors,
  useFormMeta,
  useFormValues,
} from "./formHooks";

export const useField = <
  T extends BaseField,
  E extends HTMLElement = HTMLInputElement,
>(
  fieldProps: T
) => {
  const values = useFormValues();
  const errors = useFormErrors();
  const { setValue, validateField, setTouched, observer } = useFormActions();
  const {
    formSchema,
    dynamicOptions,
    formOptions = {},
    touched,
  } = useFormMeta();

  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  const fieldId: FieldIdType = fieldProps?.fieldId;
  const fieldValue = useMemo(
    () => values[fieldId] || fallbackValue[fieldProps.type],
    [values]
  ); // Get the current value of the field from form values

  const fieldErrors = errors[fieldId];

  useEffect(() => {
    const unsubscribe = observer.subscribe(fieldId, () => {
      console.log(`[${fieldId}] Observer triggered!`);
    });

    return () => unsubscribe();
  }, [fieldId, observer]);

  const handleFocus = (e: React.FocusEvent<E>) => {
    setHasBeenFocused(true);
    if (fieldProps.events?.onCustomFocus) {
      fieldProps.events.onCustomFocus(
        e,
        fieldId,
        values,
        fieldProps,
        formSchema
      );
    }
  };

  const handleBlur = (e: React.FocusEvent<E>) => {
    setTouched(fieldProps.fieldId, true);
    if (hasBeenFocused && formOptions.validateFieldsOnBlur !== false) {
      validateField(fieldProps.fieldId, values[fieldProps.fieldId]);
    }
    if (fieldProps.events?.onCustomBlur) {
      fieldProps.events.onCustomBlur(
        e,
        fieldId,
        values,
        fieldProps,
        formSchema
      );
    }
  };

  const eventHandlers = buildFieldEventHandlers<E>({
    fieldId: fieldProps.fieldId,
    type: fieldProps.type,
    value: fieldValue,
    ...fieldProps.events,
    onCustomBlur: handleBlur, // Override the blur handler
    onCustomFocus: handleFocus, // Override the focus handler
    onCustomUpload: fieldProps.events?.onCustomUpload as
      | ((
          files: File[],
          fieldId: string,
          event?: React.SyntheticEvent<E>,
          ...args: any[]
        ) => void)
      | undefined,
  }); // Build event handlers for the field

  const fieldParams = initFieldSetup(
    fieldProps.type,
    fieldProps,
    touched[fieldId],
    !!fieldErrors
  ); // Initialize field setup based on type and processed props

  //Automatically adds a default and empty className to the field if the field has validation error
  if (fieldErrors) {
    fieldParams.className = `${fieldParams.className ? `${fieldParams.className} ` : ""}field-validation-error`;
  }
  const isDisable = fieldProps.disabled || false; // Determine if the field is disabled

  return {
    fieldId,
    processedProps: fieldProps,
    fieldParams,
    fieldValue,
    values,
    fieldErrors,
    errors,
    formSchema,
    dynamicOptions,
    eventHandlers,
    isDisable,
    observer,
    isTouched: touched[fieldProps.fieldId] || false,
    hasBeenFocused,
    hasDefaultStyling: !fieldProps.disableDefaultStyling,
    setValue,
    validateField,
  };
};
