import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { RadioField as RadioFieldType } from "../../types";
import { useForm } from "../../providers/formContext";

const RadioField: React.FC<RadioFieldType> = ({
  id,
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
}) => {
  const { values, setValue, errors, shouldShowField } = useForm();
  if (!shouldShowField({ id, label, options, required, type })) return null;

  const availableOptions = options;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, event.target.value);
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
