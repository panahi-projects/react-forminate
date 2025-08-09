import { FieldDescriptionType, FieldTypeType } from "@/types";
import React, { ReactNode, memo } from "react";
import styled from "styled-components";

interface FieldWrapperProps {
  id: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string; // Allows adding custom styles
  children: ReactNode;
  styles?: React.CSSProperties;
  labelClassName?: string;
  labelStyles?: React.CSSProperties;
  type?: FieldTypeType;
  description?: FieldDescriptionType;

  // Accessibility additions
  ariaLabel?: string; // Alternative to visible label
  ariaLabelledby?: string; // ID reference for labeling element
  ariaDescribedby?: string; // ID reference for description
  ariaInvalid?: boolean | "true" | "false" | "grammar" | "spelling";
  ariaRequired?: boolean | "true" | "false";
  ariaDisabled?: boolean | "true" | "false";
  ariaHidden?: boolean | "true" | "false";
  ariaLive?: "off" | "assertive" | "polite";
  role?: string; // For custom widget roles

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

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const DefaultErrorMessage = styled.span`
  color: #f00;
  font-size: small;
  display: inline-block;
  margin: 0;
`;

const DefaultDescription = styled.span`
  font-size: small;
  color: #828282;
  display: inline-block;
  margin: 0;
`;

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
      if (!error) return null;

      if (ErrorComponent) {
        return <ErrorComponent error={error} />;
      }

      return (
        <DefaultErrorMessage
          id={errorId}
          role="alert"
          className={errorClassName}
          style={errorStyles}
        >
          {error}
        </DefaultErrorMessage>
      );
    };

    const renderDescription = () => {
      if (!description) return null;

      if (DescriptionComponent) {
        return <DescriptionComponent description={description} />;
      }

      return (
        <DefaultDescription
          id={descriptionId}
          className={descriptionClassName}
          style={descriptionStyles}
        >
          {description}
        </DefaultDescription>
      );
    };

    return (
      <FieldContainer
        className={className}
        style={styles}
        role={type === "group" ? "group" : undefined}
      >
        {label && type !== "group" && (
          <label
            {...(shouldAddHtmlFor ? { htmlFor: id } : {})}
            className={labelClassName}
            style={labelStyles}
          >
            <span>{label}</span>{" "}
            {required && (
              <DefaultErrorMessage aria-hidden="true">*</DefaultErrorMessage>
            )}
          </label>
        )}
        {React.cloneElement(children as React.ReactElement, ariaProps)}
        {renderDescription()}
        {renderError()}
      </FieldContainer>
    );
  }
);

export default FieldWrapper;
