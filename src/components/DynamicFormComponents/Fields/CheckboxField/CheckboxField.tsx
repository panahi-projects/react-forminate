import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { useForm } from "../../providers/FormProvider";
import { CheckboxField as CheckboxFieldType } from "../../types";

const CheckboxField: React.FC<CheckboxFieldType> = ({
  id,
  label,
  options,
  required,
  containerClassName = "",
  containerStyles = {},
  className = "",
  styles = {},
}) => {
  const { values, setValue, errors, validateField } = useForm();

  const handleChange = (option: string) => {
    const currentValues = values[id] || [];
    const updatedValues = currentValues.includes(option)
      ? currentValues.filter((val: string) => val !== option)
      : [...currentValues, option];

    setValue(id, updatedValues);
    validateField(id, updatedValues);
  };

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      error={errors[id]}
      className={containerClassName}
      styles={containerStyles}
    >
      {options?.map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            name={id}
            value={option}
            checked={values[id]?.includes(option) || false}
            onChange={() => handleChange(option)}
            className={className}
            style={styles}
          />
          <span>{option}</span>
        </label>
      ))}
    </FieldWrapper>
  );
};

export default CheckboxField;
