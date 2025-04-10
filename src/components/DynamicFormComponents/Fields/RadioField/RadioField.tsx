import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { RadioField as RadioFieldType } from "../../types";

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
  const fieldValue = values[id] || "";

  if (!shouldShowField({ fieldId: id, label, options, required, type }))
    return null;

  const baseInputProps = {
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
      <div data-testid="radio-field">
        {options?.map((option) => (
          <label key={option} style={itemsStyles} className={itemsClassName}>
            <input
              {...baseInputProps}
              {...eventHandlers}
              {...(typeof option !== "string" ? option : {})}
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
