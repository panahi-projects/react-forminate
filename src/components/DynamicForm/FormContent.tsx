import { DynamicFormType, FormFieldType } from "@/types";
import { DynamicFormField } from "../DynamicFormField";
import { StyledSubmitButton } from "./StyledComponents";
import React from "react";
import { useFormActions, useFormValues } from "@/hooks";

interface FormContentProps extends DynamicFormType {
  onSubmit?: (values: any, isValid: boolean) => void;
  isLoading?: boolean;
}

const FormContent: React.FC<FormContentProps> = ({
  formData,
  onSubmit,
  isLoading,
}) => {
  const values = useFormValues();
  const { validateForm } = useFormActions();

  const submitDetails = formData?.options?.submit;
  const SubmitCustomComponent = submitDetails?.component;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm(formData);
    onSubmit?.(values, isValid);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="form"
      aria-busy={isLoading}
      aria-live="polite"
    >
      {isLoading && (
        <div
          role="alert"
          aria-live="assertive"
          style={{ position: "absolute", left: "-10000px" }}
        >
          Form is submitting, please wait...
        </div>
      )}
      {formData.fields.map((field: FormFieldType) => (
        <DynamicFormField
          key={field.fieldId}
          {...field}
          skeleton={formData.options?.skeleton?.component}
          showSkeletonLoading={formData.options?.skeleton?.showSkeletonLoading}
        />
      ))}
      {submitDetails?.visibility !== false && (
        <div>
          {SubmitCustomComponent ?? (
            <div
              className={submitDetails?.containerClassName}
              style={submitDetails?.containerStyles}
            >
              <StyledSubmitButton type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : submitDetails?.text || "Submit"}
              </StyledSubmitButton>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default FormContent;
