import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { TextField } from "../../types";
import { useForm } from "../../providers/formContext";

const InputField: React.FC<TextField> = ({
  id,
  label,
  type,
  required,
  className = "",
  placeholder = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
}) => {
  const { values, setValue, errors } = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, e.target.value);
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
      <input
        data-testId="input-field"
        id={id}
        type={type}
        value={values[id] || ""}
        onChange={handleChange}
        className={className}
        placeholder={placeholder}
        style={styles}
      />
    </FieldWrapper>
  );
};

export default InputField;
