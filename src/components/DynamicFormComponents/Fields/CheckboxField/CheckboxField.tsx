import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { useForm } from "../../providers/FormProvider";
import { CheckboxField as CheckboxFieldType } from "../../types";

const CheckboxField: React.FC<CheckboxFieldType> = ({
  id,
  label,
  options,
  required,
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
    <FieldWrapper id={id} label={label} required={required} error={errors[id]}>
      {options?.map((option) => (
        <label key={option} className="inline-flex items-center mt-1 mr-4">
          <input
            type="checkbox"
            name={id}
            value={option}
            checked={values[id]?.includes(option) || false}
            onChange={() => handleChange(option)}
            className="form-checkbox"
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </FieldWrapper>
  );
};

export default CheckboxField;
