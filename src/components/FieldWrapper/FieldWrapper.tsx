import { FieldDescriptionType, FieldTypeType } from "@/types";
import React, { ReactNode, memo } from "react";

import "./FieldWrapper.css";

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

const FieldWrapper: React.FC<FieldWrapperProps> = memo(
  ({
    id,
    label,
    required,
    error,
    className = "",
    children,
    styles = {},
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
  }) => {
    const shouldAddHtmlFor = type !== "radio" && type !== "checkbox";
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    const ariaProps = {
      "aria-describedby": ariaDescribedby,
      "aria-errormessage": error ? errorId : undefined,
      "aria-invalid": !!error,
      "aria-required": required,
      "aria-disabled": ariaDisabled,
      "aria-label": ariaLabel,
    };

    const renderError = () => {
      if (!error) return <div className="field-error-placeholder"></div>;

      if (ErrorComponent) {
        return <ErrorComponent error={error} />;
      }

      return (
        <span
          id={errorId}
          role="alert"
          className={`field-error-message ${errorClassName}`}
          style={errorStyles}
        >
          {error}
        </span>
      );
    };

    const renderDescription = () => {
      if (!description) return null;

      if (DescriptionComponent) {
        return <DescriptionComponent description={description} />;
      }

      return (
        <span
          id={descriptionId}
          className={`field-description ${descriptionClassName}`}
          style={descriptionStyles}
        >
          {description}
        </span>
      );
    };

    return (
      <div
        className={`field-container ${className}`}
        style={styles}
        role={type === "group" ? "group" : undefined}
      >
        {label && type !== "group" && (
          <label
            {...(shouldAddHtmlFor ? { htmlFor: id } : {})}
            className={`field-label ${labelClassName}`}
            style={labelStyles}
          >
            <span>{label}</span>{" "}
            {required && (
              <span className="field-required-indicator" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        {React.cloneElement(children as React.ReactElement, ariaProps)}
        {renderDescription()}
        {renderError()}
      </div>
    );
  }
);

FieldWrapper.displayName = "FieldWrapper";

export default FieldWrapper;
