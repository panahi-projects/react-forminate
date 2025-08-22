import { useFormActions, useFormValues } from "@/hooks";
import { DynamicFormType } from "@/types";
import React, { useCallback, useMemo, useState } from "react";
import { DynamicFormField } from "../DynamicFormField";
import "./FormStyle.css";
import "./SubmitStyle.css";

const DefaultLoadingSpinner = React.memo(() => (
  <div className="form-loading-spinner">
    <div className="spinner" />
  </div>
));

interface FormContentProps extends DynamicFormType {
  onSubmit?: (values: any, isValid: boolean) => void;
  isLoading?: boolean;
}

/**
 * FormContent component - Renders a dynamic form with fields, loading states, and submission handling
 * Optimized for performance with memoization and reduced re-renders
 */
const FormContent: React.FC<FormContentProps> = React.memo(
  ({ formData, onSubmit, isLoading }) => {
    const values = useFormValues();
    const { validateForm } = useFormActions();
    const [loadedFields, setLoadedFields] = useState<Set<string>>(new Set());

    // Memoize form options to prevent unnecessary recalculations
    const { submit, loading, skeleton } = formData.options || {};
    const SubmitCustomComponent = submit?.component;
    const CustomLoadingComponent = loading?.component;

    // Calculate visible fields count (simplified as per requirements)
    const allFieldsLoaded = useMemo(() => {
      return (
        loadedFields.size >= formData.fields.filter((f) => !f.visibility).length
      );
    }, [loadedFields, formData.fields]);

    // Stable callback for field load
    const handleFieldLoad = useCallback((fieldId: string) => {
      setLoadedFields((prev) => {
        const newSet = new Set(prev);
        newSet.add(fieldId);
        return newSet;
      });
    }, []);

    // Memoized submit handler
    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await validateForm(formData);
        onSubmit?.(values, isValid);
      },
      [formData, onSubmit, validateForm, values]
    );

    // Memoized loading overlay
    const loadingOverlay = useMemo(() => {
      if (loading?.visible === false || allFieldsLoaded) return null;

      return (
        <div className="form-loading-overlay">
          {CustomLoadingComponent ? (
            React.isValidElement(CustomLoadingComponent) ? (
              CustomLoadingComponent
            ) : (
              <CustomLoadingComponent />
            )
          ) : (
            <DefaultLoadingSpinner />
          )}
        </div>
      );
    }, [loading?.visible, allFieldsLoaded, CustomLoadingComponent]);

    // Memoized submit button
    const submitButton = useMemo(() => {
      if (submit?.visible === false || !allFieldsLoaded) return null;

      return (
        <div className="form-submit-container">
          {SubmitCustomComponent ?? (
            <div
              className={`submit-button-container ${submit?.containerClassName || ""}`}
              style={submit?.containerStyles}
            >
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isLoading ? "Submitting..." : submit?.text || "Submit"}
              </button>
            </div>
          )}
        </div>
      );
    }, [submit, allFieldsLoaded, isLoading, SubmitCustomComponent]);

    return (
      <form
        onSubmit={handleSubmit}
        role="form"
        aria-busy={isLoading || !allFieldsLoaded}
        aria-live="polite"
        className={`form-content ${allFieldsLoaded ? "loaded" : ""}`}
      >
        {/* Accessibility announcements */}
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

        {loadingOverlay}

        {/* Render form fields with opacity control */}
        <div style={{ opacity: allFieldsLoaded ? 1 : 0 }}>
          {formData.fields.map((field) => (
            <DynamicFormField
              key={field.fieldId}
              {...field}
              skeleton={skeleton?.component}
              showSkeletonLoading={skeleton?.visible}
              onLoadComplete={handleFieldLoad}
            />
          ))}
        </div>

        {submitButton}
      </form>
    );
  }
);

FormContent.displayName = "FormContent";
export default FormContent;
