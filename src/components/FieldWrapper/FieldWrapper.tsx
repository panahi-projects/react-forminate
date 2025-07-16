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
  }) => {
    {
      // Determine if we should add htmlFor (not for radio or checkbox)
      const shouldAddHtmlFor = type !== "radio" && type !== "checkbox";

      return (
        <FieldContainer className={className} style={styles}>
          {label && type !== "group" && (
            <label
              {...(shouldAddHtmlFor ? { htmlFor: id } : {})}
              className={labelClassName}
              style={labelStyles}
            >
              <span>{label}</span>{" "}
              {required && <StyledErrorMessage>*</StyledErrorMessage>}
            </label>
          )}
          {children}
          {description && <StyledDescription>{description}</StyledDescription>}
          {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
        </FieldContainer>
      );
    }
  }
);

export default FieldWrapper;
