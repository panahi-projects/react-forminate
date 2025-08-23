import { useFormActions, useFormValues, useFormErrors } from "@/hooks";
import { DynamicFormType } from "@/types";
import React, { useCallback, useMemo, useState, useRef } from "react";
import { DynamicFormField } from "../DynamicFormField";
import { scrollToFirstError } from "@/utils/fieldUtils";
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
    const errors = useFormErrors();
    const { validateForm } = useFormActions();
    const [loadedFields, setLoadedFields] = useState<Set<string>>(new Set());
    const formDataRef = useRef(formData);

    // Use ref to avoid dependency changes in useCallback/useMemo
    formDataRef.current = formData;

    // Memoize form options to prevent unnecessary recalculations
    const { submit, loading, skeleton, scrollOnErrorValidation } =
      formData.options || {};
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
        // Early return if already loaded
        if (prev.has(fieldId)) return prev;

        const newSet = new Set(prev);
        newSet.add(fieldId);
        return newSet;
      });
    }, []);

    // Memoized submit handler with stable dependencies
    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await validateForm(formDataRef.current);

        // If form is not valid and scrollOnErrorValidation is enabled, scroll to first error
        if (!isValid && scrollOnErrorValidation) {
          // Use setTimeout to ensure the DOM has been updated with the new errors
          setTimeout(() => {
            scrollToFirstError(errors, formData.fields, values, formData);
          }, 100);
        }

        onSubmit?.(values, isValid);
      },
      [onSubmit, validateForm, values]
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

    // Memoize fields rendering to prevent unnecessary re-renders
    const renderedFields = useMemo(() => {
      return formData.fields.map((field) => (
        <DynamicFormField
          key={field.fieldId}
          {...field}
          skeleton={skeleton?.component}
          showSkeletonLoading={skeleton?.visible}
          onLoadComplete={handleFieldLoad}
        />
      ));
    }, [formData.fields, skeleton, handleFieldLoad]);

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
        <div style={{ opacity: allFieldsLoaded ? 1 : 0 }}>{renderedFields}</div>

        {submitButton}
      </form>
    );
  }
);

FormContent.displayName = "FormContent";
export default FormContent;
