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
  }) => {
    return (
      <FieldContainer className={className} style={styles}>
        {label && (
          <label htmlFor={id} className={labelClassName} style={labelStyles}>
            {label} {required && <StyledErrorMessage>*</StyledErrorMessage>}
          </label>
        )}
        {children}
        {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
      </FieldContainer>
    );
  }
);

export default FieldWrapper;
