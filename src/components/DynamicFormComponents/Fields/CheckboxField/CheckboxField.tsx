import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { CheckboxField as CheckboxFieldType } from "../../types";

const CheckboxField: React.FC<CheckboxFieldType> = ({
  fieldId: id,
  label,
  type = "checkbox",
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
  events,
  ...rest
}) => {
  const { values, errors, shouldShowField } = useFieldEvents();
  const {
    validation: _validation,
    requiredMessage: _requiredMessage,
    visibility: _visibility,
    ...safeRest
  } = rest;
  const fieldValue = values[id] || [];

  if (!shouldShowField({ fieldId: id, label, options, required, type }))
    return null;

  const baseInputProps = {
    "data-testid": "checkbox-field",
    type,
    name: id,
    className,
    style: styles,
    ...safeRest,
  };

  const eventHandlers = buildFieldEventHandlers<HTMLInputElement>({
    fieldId: id,
    value: fieldValue,
    type,
    ...events,
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
              {...eventHandlers}
              id={`${id}-item-${option}`}
              value={option}
              checked={values[id]?.includes(option) || false}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
};

export default CheckboxField;
