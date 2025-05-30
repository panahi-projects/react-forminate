import React, { useEffect, useState } from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { OptionsType, SelectFieldType } from "../../types";
import { useDefaultFieldValue } from "../../hooks/useDefaultFieldValue";

const SelectField: React.FC<SelectFieldType> = ({
  fieldId: id,
  type = "select",
  label,
  options,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
  placeholder,
  dynamicOptions: _omitDynamicOptions, // removed from DOM
  _defaultValue,
  events,
  ...rest
}) => {
  const { values, errors, dynamicOptions } = useFieldEvents();
  const fallbackValue =
    typeof options?.[options.length - 1] === "string" ? "" : {};

  const fieldValue =
    values[id] !== undefined
      ? values[id]
      : _defaultValue !== undefined
        ? _defaultValue
        : fallbackValue;

  // 🧠 Set default value on mount if not already set
  useDefaultFieldValue(id, _defaultValue);

  const {
    validation: _validation,
    requiredMessage: _requiredMessage,
    visibility: _visibility,
    ...safeRest
  } = rest;

  const [selectOptions, setSelectOptions] = useState<OptionsType[]>(
    options || []
  );

  // Update options when dynamicOptions are loaded
  useEffect(() => {
    if (dynamicOptions && dynamicOptions[id]) {
      setSelectOptions(dynamicOptions[id]);
    }
  }, [dynamicOptions, id]);

  useEffect(() => {
    let raw = dynamicOptions?.[id] || options || [];

    // Normalize string[] to { label, value }[]
    const normalized =
      typeof raw[0] === "string"
        ? raw.map((opt: string) => ({ label: opt, value: opt }))
        : raw;

    setSelectOptions(normalized);
  }, [dynamicOptions, id, options]);

  const inputProps = {
    "data-testid": "select-field",
    id,
    name: id,
    value: values[id] || "",
    className,
    style: styles,
    ...safeRest, // safe now since dynamicOptions props are removed
  };

  const eventHandlers = buildFieldEventHandlers<HTMLSelectElement>({
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
      <select {...inputProps} {...eventHandlers}>
        <option value="" disabled>
          {placeholder ? placeholder : `Select an option`}
        </option>
        {selectOptions.map((option, index) => {
          const isString = typeof option === "string";
          const optionValue = isString ? option : option.value;
          const optionLabel = isString ? option : option.label;

          return (
            <option
              key={isString ? option : `${option.value}-${index}`}
              value={optionValue}
              selected={
                typeof option !== "string"
                  ? fieldValue === option.value
                  : fieldValue === option
              }
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
    </FieldWrapper>
  );
};

export default SelectField;
