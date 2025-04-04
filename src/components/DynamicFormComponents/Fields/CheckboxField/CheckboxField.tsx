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
  ...rest
}) => {
  const { type: _type, ...safeRest } = rest;
  const { values, setValue, errors } = useForm();

  const handleChange = (option: string) => {
    const currentValues = values[id] || [];
    const updatedValues = currentValues.includes(option)
      ? currentValues.filter((val: string) => val !== option)
      : [...currentValues, option];

    setValue(id, updatedValues);
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
              id={`${id}-item-${option}`}
              type="checkbox"
              name={id}
              value={option}
              checked={values[id]?.includes(option) || false}
              onChange={() => handleChange(option)}
              className={className}
              style={styles}
              {...safeRest}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
};

export default CheckboxField;
