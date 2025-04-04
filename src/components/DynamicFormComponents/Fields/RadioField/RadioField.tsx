import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { RadioField as RadioFieldType } from "../../types";
import { useForm } from "../../providers/formContext";

const RadioField: React.FC<RadioFieldType> = ({
  fieldId: id,
  label,
  type = "radio",
  options,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
  itemsStyles = {},
  itemsClassName = "",
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
  const {
    values,
    setValue,
    errors,
    shouldShowField,
    getFieldSchema,
    formSchema,
  } = useForm();

  if (!shouldShowField({ fieldId: id, label, options, required, type }))
    return null;

  const handleDefaultChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, event.target.value);
  };

  const handleCustomEvent = (
    handler: Function | undefined,
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    if (handler) {
      handler(event, id, values, getFieldSchema(id), formSchema);
    }
  };

  const baseInputProps = {
    type,
    name: id,
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
      <div data-testid="radio-field">
        {options?.map((option) => (
          <label key={option} style={itemsStyles} className={itemsClassName}>
            <input
              {...baseInputProps}
              value={option}
              checked={values[id] === option}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
};

export default RadioField;
