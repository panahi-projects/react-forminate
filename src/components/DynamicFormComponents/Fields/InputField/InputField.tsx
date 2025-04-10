import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { TextField } from "../../types";

const InputField: React.FC<TextField> = ({
  fieldId: id,
  label,
  type,
  required,
  className = "",
  placeholder = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
  onCustomClick,
  onCustomChange,
  onCustomBlur,
  onCustomFocus,
  onCustomKeyDown,
  onCustomKeyUp,
  onCustomMouseDown,
  onCustomMouseEnter,
  onCustomMouseLeave,
  onCustomContextMenu,
  ...rest
}) => {
  const { values, errors } = useFieldEvents();
  const {
    validation: _validation,
    requiredMessage: _requiredMessage,
    visibility: _visibility,

    ...safeRest
  } = rest;
  const fieldValue = values[id] || "";

  const inputProps = {
    "data-testid": "input-field",
    id,
    type,
    className,
    placeholder,
    style: styles,
    ...safeRest,
  };

  const eventHandlers = buildFieldEventHandlers<HTMLInputElement>({
    fieldId: id,
    value: fieldValue,
    type,
    onCustomClick,
    onCustomChange,
    onCustomBlur,
    onCustomFocus,
    onCustomKeyDown,
    onCustomKeyUp,
    onCustomMouseDown,
    onCustomMouseEnter,
    onCustomMouseLeave,
    onCustomContextMenu,
  });

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      error={errors[id]}
      className={containerClassName}
      styles={containerStyles}
      labelClassName={labelClassName}
      labelStyles={labelStyles}
    >
      <input {...inputProps} {...eventHandlers} />
    </FieldWrapper>
  );
};

export default InputField;
