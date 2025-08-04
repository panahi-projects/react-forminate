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
}

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const StyledErrorMessage = styled.span`
  color: #f00;
  font-size: small;
  display: inline-block;
  margin: 0;
`;

const StyledDescription = styled.span`
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
    ariaDescribedby,
    ariaLabel,
    ariaDisabled,
  }) => {
    {
      // Determine if we should add htmlFor (not for radio or checkbox)
      const shouldAddHtmlFor = type !== "radio" && type !== "checkbox";

      const descriptionId = `${id}-description`;
      const errorId = `${id}-error`;

      const ariaProps = {
        "aria-describedby": ariaDescribedby,
        "aria-errormessage": error ? error : undefined,
        "aria-invalid": !!error,
        "aria-required": required,
        "aria-disabled": ariaDisabled,
        "aria-label": ariaLabel,
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
                <StyledErrorMessage aria-hidden="true">*</StyledErrorMessage>
              )}
            </label>
          )}
          {React.cloneElement(children as React.ReactElement, ariaProps)}
          {description && (
            <StyledDescription id={descriptionId}>
              {description}
            </StyledDescription>
          )}
          {error && (
            <StyledErrorMessage id={errorId} role="alert">
              {error}
            </StyledErrorMessage>
          )}
        </FieldContainer>
      );
    }
  }
);

export default FieldWrapper;
