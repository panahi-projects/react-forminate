import React, { ReactNode, memo } from "react";

interface FieldWrapperProps {
  id: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string; // Allows adding custom styles
  children: ReactNode;
  styles?: React.CSSProperties;
}

const FieldWrapper: React.FC<FieldWrapperProps> = memo(
  ({ id, label, required, error, className = "", children, styles }) => {
    return (
      <div className={`field-container ${className}`} style={styles}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label} {required && <span className="red-star-validation">*</span>}
          </label>
        )}
        {children}
        {error && <p className="red-star-validation">{error}</p>}
      </div>
    );
  }
);

export default FieldWrapper;
