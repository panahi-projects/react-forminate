import React, { useEffect } from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { RadioFieldType } from "../../types";
import { useDefaultFieldValue } from "../../hooks/useDefaultFieldValue";

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
  _defaultValue,
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
  // Use default only if value is undefined
  const fieldValue =
    values[id] !== undefined ? values[id] : _defaultValue || "";

  // 🧠 Set default value on mount if not already set
  useDefaultFieldValue(id, _defaultValue);

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
        {options?.map((option, index) => {
          const isString = typeof option === "string";
          const optionValue = isString ? option : option.value;
          const optionLabel = isString ? option : option.label;

          return (
            <label
              key={isString ? option : `${option.value}-${index}`}
              style={itemsStyles}
              className={itemsClassName}
            >
              <input
                {...baseInputProps}
                {...eventHandlers}
                {...(!isString ? option : {})}
                value={optionValue}
                checked={fieldValue === optionValue}
              />
              <span>{optionLabel}</span>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
};

export default RadioField;
