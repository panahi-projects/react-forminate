import { FieldDescriptionType, FieldTypeType } from "@/types";
import React, { ReactNode, memo, useMemo } from "react";
import styles from "./FieldWrapper.module.css";

interface FieldWrapperProps {
  id: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
  styles?: React.CSSProperties;
  labelClassName?: string;
  labelStyles?: React.CSSProperties;
  type?: FieldTypeType;
  description?: FieldDescriptionType;

  // Accessibility additions
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  ariaInvalid?: boolean | "true" | "false" | "grammar" | "spelling";
  ariaRequired?: boolean | "true" | "false";
  ariaDisabled?: boolean | "true" | "false";
  ariaHidden?: boolean | "true" | "false";
  ariaLive?: "off" | "assertive" | "polite";
  role?: string;

  // Customizable error and description props
  errorClassName?: string;
  errorStyles?: React.CSSProperties;
  descriptionClassName?: string;
  descriptionStyles?: React.CSSProperties;
  errorComponent?: React.ComponentType<{ error: string }>;
  descriptionComponent?: React.ComponentType<{
    description: FieldDescriptionType;
  }>;
}

/**
 * FieldWrapper component - Provides consistent styling, labeling, error handling,
 * and accessibility features for form fields.
 *
 * Optimized with:
 * - Memoized expensive computations
 * - Reduced unnecessary re-renders
 * - Efficient conditional rendering
 * - CSS Modules for scoped styling
 */
const FieldWrapper: React.FC<FieldWrapperProps> = memo(
  ({
    id,
    label,
    required,
    error,
    className = "",
    children,
    styles: inlineStyles = {},
    labelClassName = "",
    labelStyles = {},
    type,
    description,
    errorClassName = "",
    errorStyles = {},
    descriptionClassName = "",
    descriptionStyles = {},
    errorComponent: ErrorComponent,
    descriptionComponent: DescriptionComponent,
    ariaDescribedby,
    ariaLabel,
    ariaDisabled,
    ariaInvalid,
    ariaRequired,
    ariaHidden,
    ariaLive,
    role,
    ariaLabelledby,
  }) => {
    // Memoize computed values to avoid recalculation on every render
    const shouldAddHtmlFor = useMemo(
      () => type !== "radio" && type !== "checkbox",
      [type]
    );

    const descriptionId = useMemo(() => `${id}-description`, [id]);
    const errorId = useMemo(() => `${id}-error`, [id]);

    // Memoize aria props object to prevent unnecessary re-renders of child components
    const ariaProps = useMemo(
      () => ({
        "aria-describedby": ariaDescribedby,
        "aria-errormessage": error ? errorId : undefined,
        "aria-invalid": ariaInvalid !== undefined ? ariaInvalid : !!error,
        "aria-required": ariaRequired !== undefined ? ariaRequired : required,
        "aria-disabled": ariaDisabled,
        "aria-label": ariaLabel,
        "aria-hidden": ariaHidden,
        "aria-live": ariaLive,
        "aria-labelledby": ariaLabelledby,
      }),
      [
        ariaDescribedby,
        error,
        errorId,
        ariaInvalid,
        ariaRequired,
        required,
        ariaDisabled,
        ariaLabel,
        ariaHidden,
        ariaLive,
        ariaLabelledby,
      ]
    );

    // Memoize error rendering to prevent unnecessary re-renders
    const renderedError = useMemo(() => {
      if (!error)
        return <div className={styles.errorPlaceholder} aria-hidden="true" />;

      if (ErrorComponent) {
        return <ErrorComponent error={error} />;
      }

      return (
        <span
          id={errorId}
          role="alert"
          className={`${styles.errorMessage} ${errorClassName}`}
          style={errorStyles}
        >
          {error}
        </span>
      );
    }, [error, ErrorComponent, errorId, errorClassName, errorStyles]);

    // Memoize description rendering to prevent unnecessary re-renders
    const renderedDescription = useMemo(() => {
      if (!description) return null;

      if (DescriptionComponent) {
        return <DescriptionComponent description={description} />;
      }

      return (
        <span
          id={descriptionId}
          className={`${styles.description} ${descriptionClassName}`}
          style={descriptionStyles}
        >
          {description}
        </span>
      );
    }, [
      description,
      DescriptionComponent,
      descriptionId,
      descriptionClassName,
      descriptionStyles,
    ]);

    // Memoize label rendering to prevent unnecessary re-renders
    const renderedLabel = useMemo(() => {
      if (!label || type === "group") return null;

      return (
        <label
          {...(shouldAddHtmlFor ? { htmlFor: id } : {})}
          className={`${styles.label} ${labelClassName}`}
          style={labelStyles}
        >
          <span>{label}</span>
          {required && (
            <span className={styles.requiredIndicator} aria-hidden="true">
              *
            </span>
          )}
        </label>
      );
    }, [
      label,
      type,
      shouldAddHtmlFor,
      id,
      labelClassName,
      labelStyles,
      required,
    ]);

    // Memoize the enhanced child element to prevent unnecessary re-renders
    const enhancedChild = useMemo(() => {
      return React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement, ariaProps)
        : children;
    }, [children, ariaProps]);

    // Determine the appropriate role for the container
    const containerRole = useMemo(() => {
      if (role) return role;
      return type === "group" ? "group" : undefined;
    }, [role, type]);

    return (
      <div
        className={`${styles.container} ${className}`}
        style={inlineStyles}
        role={containerRole}
      >
        {renderedLabel}
        {enhancedChild}
        {renderedDescription}
        {renderedError}
      </div>
    );
  }
);

FieldWrapper.displayName = "FieldWrapper";

export default FieldWrapper;
