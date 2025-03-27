import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { useForm } from "../../providers/FormProvider";
import { RadioField as RadioFieldType } from "../../types";

const RadioField: React.FC<RadioFieldType> = ({
  id,
  label,
  options,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
}) => {
  const { values, setValue, errors, validateField, shouldShowField } =
    useForm();
  if (!shouldShowField({ id, label, options, required })) return null;

  const availableOptions = options;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, event.target.value);
    validateField(id, event.target.value);
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
      {availableOptions &&
        availableOptions.map((option: string) => (
          <label key={option}>
            <input
              type="radio"
              name={id}
              value={option}
              checked={values[id] === option}
              onChange={handleChange}
              className={className}
              style={styles}
            />
            <span>{option}</span>
          </label>
        ))}
    </FieldWrapper>
  );
};

export default RadioField;
