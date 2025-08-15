import { useFormActions, useFormValues } from "@/hooks";
import { DynamicFormType, FormFieldType } from "@/types";
import React, { useState } from "react";
import { DynamicFormField } from "../DynamicFormField";
import "./FormStyle.css";
import "./SubmitStyle.css";

interface FormContentProps extends DynamicFormType {
  onSubmit?: (values: any, isValid: boolean) => void;
  isLoading?: boolean;
}

const DefaultLoadingSpinner = () => (
  <div className="form-loading-spinner">
    <div className="spinner" /> {/* Style this in your CSS */}
  </div>
);

const FormContent: React.FC<FormContentProps> = ({
  formData,
  onSubmit,
  isLoading,
}) => {
  const values = useFormValues();
  const { validateForm } = useFormActions();
  const [loadedFields, setLoadedFields] = useState<Set<string>>(new Set());

  const submitDetails = formData?.options?.submit;
  const SubmitCustomComponent = submitDetails?.component;
  const CustomLoadingComponent = formData?.options?.loading?.component;

  const allFieldsLoaded =
    loadedFields.size >= formData.fields.filter((f) => !f.visibility).length;

  const handleFieldLoad = (fieldId: string) => {
    setLoadedFields((prev) => new Set(prev.add(fieldId)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm(formData);
    onSubmit?.(values, isValid);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="form"
      aria-busy={isLoading || !allFieldsLoaded}
      aria-live="polite"
      className={`form-content ${allFieldsLoaded ? "loaded" : ""}`}
    >
      {/* Accessibility-only loading announcement (hidden visually) */}
      {!allFieldsLoaded && (
        <div role="status" aria-live="polite" className="sr-only">
          Loading form fields...
        </div>
      )}
      {isLoading && (
        <div role="status" aria-live="assertive" className="sr-only">
          Form is submitting...
        </div>
      )}

      {/* Show loading spinner in center while fields load */}
      {formData.options?.loading?.visible !== false && !allFieldsLoaded && (
        <div className="form-loading-overlay">
          {CustomLoadingComponent ? (
            React.isValidElement(CustomLoadingComponent) ? (
              CustomLoadingComponent // JSX case
            ) : (
              <CustomLoadingComponent /> // ComponentType case
            )
          ) : (
            <DefaultLoadingSpinner />
          )}
        </div>
      )}

      {/* Render form fields (hidden if not fully loaded) */}
      <div style={{ opacity: allFieldsLoaded ? 1 : 0 }}>
        {formData.fields.map((field: FormFieldType) => (
          <DynamicFormField
            key={field.fieldId}
            {...field}
            skeleton={formData.options?.skeleton?.component}
            showSkeletonLoading={formData.options?.skeleton?.visible}
            onLoadComplete={() => handleFieldLoad(field.fieldId)}
          />
        ))}
      </div>

      {/* Submit button (only when fully loaded) */}
      {submitDetails?.visible !== false && allFieldsLoaded && (
        <div className="form-submit-container">
          {SubmitCustomComponent ?? (
            <div
              className={`submit-button-container ${submitDetails?.containerClassName || ""}`}
              style={submitDetails?.containerStyles}
            >
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isLoading ? "Submitting..." : submitDetails?.text || "Submit"}
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default FormContent;
