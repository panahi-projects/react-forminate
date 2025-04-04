import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { DateField } from "../../types";
import { useForm } from "../../providers/formContext";

const DatePickerField: React.FC<DateField> = ({
  fieldId: id,
  label,
  required,
  className = "",
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
        data-testid="date-picker-field"
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
