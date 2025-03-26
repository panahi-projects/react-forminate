import React, { ReactNode, memo } from "react";

interface FieldWrapperProps {
  id: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string; // Allows adding custom styles
  children: ReactNode;
}

const FieldWrapper: React.FC<FieldWrapperProps> = memo(
  ({ id, label, required, error, className = "", children }) => {
    return (
      <div className={`field-container mb-4 ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {children}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

export default FieldWrapper;
