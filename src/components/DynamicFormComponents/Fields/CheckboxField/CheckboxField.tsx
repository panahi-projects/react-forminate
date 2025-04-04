import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { CheckboxField as CheckboxFieldType } from "../../types";
import { useForm } from "../../providers/formContext";

const CheckboxField: React.FC<CheckboxFieldType> = ({
  fieldId: id,
  label,
  options,
  required,
  containerClassName = "",
  containerStyles = {},
  className = "",
  styles = {},
  labelClassName = "",
  labelStyles = {},
  itemsClassName = "",
  itemsStyles = {},
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
  const { type: _type, ...safeRest } = rest; //Omit "type" from rest before spreading

  const handleDefaultChange = (option: string) => {
    const currentValues = values[id] || [];
    const updatedValues = currentValues.includes(option)
      ? currentValues.filter((val: string) => val !== option)
      : [...currentValues, option];

    setValue(id, updatedValues);
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
    type: "checkbox",
    name: id,
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
      <div data-testid="checkbox-field">
        {options?.map((option) => (
          <label
            htmlFor={`${id}-item-${option}`}
            style={itemsStyles}
            className={itemsClassName}
            key={option}
          >
            <input
              {...baseInputProps}
              id={`${id}-item-${option}`}
              value={option}
              checked={values[id]?.includes(option) || false}
              onChange={(e) => {
                handleDefaultChange(option);
                handleCustomEvent(onCustomChange, e);
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
};

export default CheckboxField;
