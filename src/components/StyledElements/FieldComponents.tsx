import React from "react";
import "./FieldStyles.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input: React.FC<InputProps> = ({
  hasError,
  className = "",
  ...props
}) => {
  const classes = `form-element form-input ${hasError ? "form-element-error" : ""} ${className}`;
  return <input className={classes} {...props} />;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  hasError,
  className = "",
  ...props
}) => {
  const classes = `form-element form-select ${hasError ? "form-element-error" : ""} ${className}`;
  return <select className={classes} {...props} />;
};

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  hasError,
  className = "",
  ...props
}) => {
  const classes = `form-element form-textarea ${hasError ? "form-element-error" : ""} ${className}`;
  return <textarea className={classes} {...props} />;
};

export const Checkbox: React.FC<InputProps> = ({
  className = "",
  ...props
}) => {
  const classes = `form-checkbox-radio ${className}`;
  return <input type="checkbox" className={classes} {...props} />;
};

interface RadioContainerProps {
  layout?: "inline" | "column";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioContainer: React.FC<RadioContainerProps> = ({
  layout = "inline",
  children,
  className = "",
  style,
}) => {
  const layoutClass =
    layout === "inline" ? "radio-container-inline" : "radio-container-column";
  const classes = `radio-container ${layoutClass} ${className}`;
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};

interface RadioLabelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioLabel: React.FC<RadioLabelProps> = ({
  children,
  className = "",
  style,
}) => {
  const classes = `radio-label ${className}`;
  return (
    <label className={classes} style={style}>
      {children}
    </label>
  );
};

export const RadioInput: React.FC<InputProps> = ({
  className = "",
  ...props
}) => {
  const classes = `radio-input ${className}`;
  return <input type="radio" className={classes} {...props} />;
};

interface RadioLabelTextProps {
  children: React.ReactNode;
  className?: string;
}

export const RadioLabelText: React.FC<RadioLabelTextProps> = ({
  children,
  className = "",
}) => {
  const classes = `radio-label-text ${className}`;
  return <span className={classes}>{children}</span>;
};

// MultiSelect Components
interface MultiSelectWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MultiSelectWrapper: React.FC<MultiSelectWrapperProps> = ({
  children,
  className = "",
}) => {
  const classes = `multiselect-wrapper ${className}`;
  return <div className={classes}>{children}</div>;
};

interface InputContainerProps {
  hasError?: boolean;
  isOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const InputContainer: React.FC<InputContainerProps> = ({
  hasError,
  isOpen,
  children,
  className = "",
}) => {
  const baseClasses = `form-element multiselect-input-container ${className}`;
  const errorClass = hasError ? "form-element-error" : "";
  const openClass = isOpen ? "multiselect-input-container-open" : "";
  const classes = `${baseClasses} ${errorClass} ${openClass}`;
  return <div className={classes}>{children}</div>;
};

export const SelectedTag: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="multiselect-selected-tag">{children}</div>;
};

export const RemoveTag: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <span className="multiselect-remove-tag" onClick={onClick}>
      ×
    </span>
  );
};

interface ChevronIconProps {
  isOpen: boolean;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ isOpen }) => {
  const classes = `multiselect-chevron-icon ${isOpen ? "multiselect-chevron-icon-open" : ""}`;
  return <span className={classes}>▼</span>;
};

export const ClearAllButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <button type="button" className="multiselect-clear-all" onClick={onClick}>
      Clear
    </button>
  );
};

interface DropdownProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ isOpen, children }) => {
  const classes = `multiselect-dropdown ${isOpen ? "" : "multiselect-dropdown-hidden"}`;
  return <div className={classes}>{children}</div>;
};

export const SearchContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="multiselect-search-container">{children}</div>;
};

export const SearchInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = (props) => {
  return <input className="multiselect-search-input" {...props} />;
};

interface OptionItemProps {
  isSelected: boolean;
  isFocused: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export const OptionItem: React.FC<OptionItemProps> = ({
  isSelected,
  isFocused,
  children,
  onClick,
}) => {
  const selectedClass = isSelected ? "multiselect-option-selected" : "";
  const focusedClass = isFocused ? "multiselect-option-focused" : "";
  const classes = `multiselect-option-item ${selectedClass} ${focusedClass}`;
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export const Placeholder: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <span className="multiselect-placeholder">{children}</span>;
};
