import { useFormActions, useFormValues } from "@/hooks";
import { DynamicFormType } from "@/types";
import React, { useCallback, useMemo, useState } from "react";
import { DynamicFormField } from "../DynamicFormField";
import "./FormStyle.css";
import "./SubmitStyle.css";

// Default loading spinner component
const DefaultLoadingSpinner = React.memo(() => (
  <div className="form-loading-spinner">
    <div className="spinner" />
  </div>
));

interface FormContentProps extends DynamicFormType {
  onSubmit?: (values: any, isValid: boolean) => void;
  isLoading?: boolean;
}

// Type guard to check if a value is a valid React component
const isValidComponent = (component: any): component is React.ComponentType => {
  return (
    typeof component === "function" ||
    (typeof component === "object" &&
      component !== null &&
      !Array.isArray(component))
  );
};

/**
 * FormContent component - Renders a dynamic form with fields, loading states, and submission handling
 * Optimized for performance with memoization and reduced re-renders
 */
const FormContent: React.FC<FormContentProps> = React.memo(
  ({ formData, onSubmit, isLoading }) => {
    const values = useFormValues();
    const { validateForm } = useFormActions();
    const [loadedFields, setLoadedFields] = useState<Set<string>>(new Set());

    // Extract options with defaults to avoid repeated access
    const { submit = {}, loading = {}, skeleton = {} } = formData.options || {};
    const {
      component: SubmitCustomComponent,
      visible: submitVisible = true,
      text: submitText = "Submit",
      containerClassName = "",
      containerStyles = {},
    } = submit;

    const {
      component: CustomLoadingComponent,
      visible: loadingVisible = true,
    } = loading;

    const { component: skeletonComponent } = skeleton;

    // Calculate if all fields are loaded
    const allFieldsLoaded = useMemo(() => {
      // Count only fields that don't have visibility restrictions
      const totalVisibleFields = formData.fields.filter(
        (f) => !f.visibility
      ).length;
      return loadedFields.size >= totalVisibleFields;
    }, [loadedFields, formData.fields]);

    // Stable callback for field load using functional update
    const handleFieldLoad = useCallback((fieldId: string) => {
      setLoadedFields((prev) => {
        // Only update if the fieldId is not already in the set
        if (prev.has(fieldId)) return prev;

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
      if (loadingVisible === false || allFieldsLoaded) return null;

      // Handle different types of loading components
      if (CustomLoadingComponent) {
        if (React.isValidElement(CustomLoadingComponent)) {
          return (
            <div className="form-loading-overlay">{CustomLoadingComponent}</div>
          );
        } else if (isValidComponent(CustomLoadingComponent)) {
          const Component = CustomLoadingComponent as React.ComponentType;
          return (
            <div className="form-loading-overlay">
              <Component />
            </div>
          );
        }
      }

      // Default loading spinner
      return (
        <div className="form-loading-overlay">
          <DefaultLoadingSpinner />
        </div>
      );
    }, [loadingVisible, allFieldsLoaded, CustomLoadingComponent]);

    // Memoized submit button
    const submitButton = useMemo(() => {
      if (submitVisible === false || !allFieldsLoaded) return null;

      // Handle different types of submit components
      if (SubmitCustomComponent) {
        if (React.isValidElement(SubmitCustomComponent)) {
          return (
            <div className="form-submit-container">{SubmitCustomComponent}</div>
          );
        } else if (isValidComponent(SubmitCustomComponent)) {
          const Component = SubmitCustomComponent as React.ComponentType;
          return (
            <div className="form-submit-container">
              <Component />
            </div>
          );
        }
      }

      // Default submit button
      return (
        <div className="form-submit-container">
          <div
            className={`submit-button-container ${containerClassName}`}
            style={containerStyles}
          >
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? "Submitting..." : submitText}
            </button>
          </div>
        </div>
      );
    }, [
      submitVisible,
      allFieldsLoaded,
      isLoading,
      SubmitCustomComponent,
      containerClassName,
      containerStyles,
      submitText,
    ]);

    // Memoize form fields to prevent unnecessary re-renders
    const formFields = useMemo(
      () =>
        formData.fields.map((field) => (
          <DynamicFormField
            key={field.fieldId}
            {...field}
            skeleton={skeletonComponent}
            showSkeletonLoading={skeleton.visible}
            onLoadComplete={handleFieldLoad}
          />
        )),
      [formData.fields, skeletonComponent, skeleton.visible, handleFieldLoad]
    );

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
        <div
          style={{
            opacity: allFieldsLoaded ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
        >
          {formFields}
        </div>

        {submitButton}
      </form>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.formData === nextProps.formData &&
      prevProps.onSubmit === nextProps.onSubmit &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

FormContent.displayName = "FormContent";
export default FormContent;
