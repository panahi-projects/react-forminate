import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { useForm } from "../../providers/FormProvider";
import { DateField } from "../../types";

const DatePickerField: React.FC<DateField> = ({
  id,
  label,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
}) => {
  const { values, setValue, errors, validateField } = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, e.target.value);
    validateField(id, e.target.value);
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
        id={id}
        type="date"
        value={values[id] || ""}
        onChange={handleChange}
        className={className}
        style={styles}
      />
    </FieldWrapper>
  );
};

export default DatePickerField;
