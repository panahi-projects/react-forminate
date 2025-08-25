import { Button } from "@/components/StyledElements";
import {
  useOptimizedField,
  useFormValues,
  useFormErrors,
  useFormActions,
} from "@/hooks";
import { ButtonFieldType } from "@/types";
import React, { useCallback } from "react";

const ButtonField: React.FC<ButtonFieldType> = (props) => {
  const {
    props: fieldProps,
    fieldParams,
    formContext,
  } = useOptimizedField(props);

  const formValues = useFormValues();
  const { validateForm } = useFormActions();

  // Handle submit button functionality
  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      // If this is a submit button, handle form submission
      if (fieldProps.buttonType === "submit") {
        // Call the original onClick handler if provided
        if (props.onClick) {
          // Create a custom event with form values attached
          const isValid = await validateForm(formContext?.formSchema);

          props.onClick(event, formValues, isValid);
        }
      } else {
        if (props.onClick) {
          props.onClick(event, formValues);
        }
      }
    },
    [fieldProps.buttonType, props.onClick, formValues, props.fieldId]
  );

  // Create button props without conflicting event handlers
  const buttonProps = {
    ...fieldParams,
    type: fieldProps.buttonType || "button",
    // hasError: !!fieldErrors,
  };

  // Handle click separately to avoid type conflicts
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleClick(e);
  };
  return !fieldProps.disableDefaultStyling ? (
    <Button {...buttonProps} onClick={handleButtonClick}>
      {props.text as string}
    </Button>
  ) : (
    <button {...buttonProps} onClick={handleButtonClick}>
      {props.text as string}
    </button>
  );
  // return !fieldProps.disableDefaultStyling ? (
  //   <Button
  //     {...buttonProps}
  //     onClick={handleButtonClick}
  //     text={fieldParams.text}
  //     {...(eventHandlers.htmlHandlers as any)}
  //   />
  // ) : (
  //   <button {...buttonProps} onClick={handleButtonClick}>
  //     {fieldParams.text}
  //   </button>
  // );
};

export default React.memo(ButtonField);
