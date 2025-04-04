import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { DateField } from "../../types";
import { useForm } from "../../providers/formContext";

const DatePickerField: React.FC<DateField> = ({
  fieldId: id,
  label,
  required,
  className = "",
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
  const { type: _type, ...safeRest } = rest; // omit type before spreading
  const { values, setValue, errors, getFieldSchema, formSchema } = useForm();

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
    "data-testid": "date-picker-field",
    id,
    name: id,
    type: "date",
    value: values[id] || "",
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
    style: styles,
    ...safeRest,
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

export default DatePickerField;
