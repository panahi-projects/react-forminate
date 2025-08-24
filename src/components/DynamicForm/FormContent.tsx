import { useFormActions, useFormValues, useFormErrors } from "@/hooks";
import { DynamicFormType } from "@/types";
import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
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
    const [isValidating, setIsValidating] = useState(false);
    const formDataRef = useRef(formData);
    const errorsRef = useRef(errors);

    // Update errors ref when errors change
    useEffect(() => {
      errorsRef.current = errors;
    }, [errors]);

    // Use ref to avoid dependency changes in useCallback/useMemo
    formDataRef.current = formData;

    // Memoize form options to prevent unnecessary recalculations
    const { submit, loading, skeleton, scrollOnErrorValidation } =
      formData.options || {};
    const SubmitCustomComponent = submit?.component;
    const CustomLoadingComponent = loading?.component;

    // Auto-scroll to first error when errors appear and scrollOnErrorValidation is enabled
    useEffect(() => {
      if (
        scrollOnErrorValidation &&
        errors &&
        Object.keys(errors).length > 0 &&
        isValidating
      ) {
        // Wait for DOM to update with error messages
        setTimeout(() => {
          scrollToFirstError(errors);
        }, 100);
      }
    }, [errors, scrollOnErrorValidation, isValidating, values]);

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
        setIsValidating(true);

        try {
          const isValid = await validateForm(formDataRef.current);
          onSubmit?.(values, isValid);
        } finally {
          setIsValidating(false);
        }
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
