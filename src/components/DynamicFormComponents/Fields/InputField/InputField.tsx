import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { TextField } from "../../types";
import { useForm } from "../../providers/formContext";

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
  const { values, setValue, errors, getFieldSchema, formSchema } = useForm();
  const fieldValue = values[id] || "";

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, e.target.value);
  };

  const handleCustomEvent = (
    handler: Function | undefined,
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    if (handler) {
      handler(event, id, values, getFieldSchema(id), formSchema);
    }
  };

  const inputProps = {
    "data-testid": "input-field",
    id,
    type,
    value: fieldValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      handleDefaultChange(e);
      handleCustomEvent(onCustomChange, e);
    },
    onClick: (e: React.MouseEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomClick, e),
    onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomBlur, e),
    onFocus: (e: React.FocusEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomFocus, e),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomKeyDown, e),
    onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomKeyUp, e),
    onMouseDown: (e: React.MouseEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomMouseDown, e),
    onMouseEnter: (e: React.MouseEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomMouseEnter, e),
    onMouseLeave: (e: React.MouseEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomMouseLeave, e),
    onContextMenu: (e: React.MouseEvent<HTMLInputElement>) =>
      handleCustomEvent(onCustomContextMenu, e),
    className,
    placeholder,
    style: styles,
    ...rest,
  };

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
      <input {...inputProps} />
    </FieldWrapper>
  );
};

export default InputField;
