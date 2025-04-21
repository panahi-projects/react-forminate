import React, { useEffect, useState } from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { SelectFieldType } from "../../types";

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
  dynamicOptions: _omitDynamicOptions, // removed from DOM
  events,
  ...rest
}) => {
  const { values, errors, dynamicOptions } = useFieldEvents();
  const fieldValue =
    values[id] || typeof options?.[options?.length - 1] === "string" ? "" : {};
  const {
    validation: _validation,
    requiredMessage: _requiredMessage,
    visibility: _visibility,
    ...safeRest
  } = rest;

  const [selectOptions, setSelectOptions] = useState<
    { label: string; value: any }[] | string[]
  >(options || []);

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
          Select an option
        </option>
        {selectOptions.map((option) => (
          <option
            key={typeof option !== "string" ? option.value : option}
            value={typeof option !== "string" ? option.value : option}
          >
            {typeof option !== "string" ? option.label : option}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
};

export default SelectField;
