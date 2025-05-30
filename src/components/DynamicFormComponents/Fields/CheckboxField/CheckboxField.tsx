import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { CheckboxFieldType } from "../../types";
import { useDefaultFieldValue } from "../../hooks/useDefaultFieldValue";

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

  const fallbackValue: string[] = [];
  const fieldValue =
    values[id] !== undefined
      ? values[id]
      : _defaultValue !== undefined && Array.isArray(_defaultValue)
        ? _defaultValue
        : fallbackValue;

  // 🧠 Set default value on mount if not already set
  useDefaultFieldValue(
    id,
    _defaultValue !== undefined && Array.isArray(_defaultValue)
      ? _defaultValue
      : []
  );

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
        {options?.map((option, index) => {
          const isString = typeof option === "string";
          const optionValue = isString ? option : option.value;
          const optionLabel = isString ? option : option.label;

          return (
            <label
              key={isString ? option : `${option.value}-${index}`}
              htmlFor={`${id}-item-${optionValue}`}
              style={itemsStyles}
              className={itemsClassName}
            >
              <input
                {...baseInputProps}
                {...eventHandlers}
                id={`${id}-item-${optionValue}`}
                value={optionValue}
                checked={values[id]?.includes(optionValue) || false}
              />
              <span>{optionLabel}</span>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
};

export default CheckboxField;
