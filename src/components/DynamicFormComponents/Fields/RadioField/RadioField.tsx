import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { useForm } from "../../providers/FormProvider";

const RadioField: React.FC<any> = ({ id, label, options, required }) => {
  const { values, setValue, errors, validateField, shouldShowField } =
    useForm();
  if (!shouldShowField({ id, label, options, required })) return null;

  const availableOptions = options;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(id, event.target.value);
    validateField(id, event.target.value);
  };

  return (
    <FieldWrapper id={id} label={label} required={required} error={errors[id]}>
      {availableOptions &&
        availableOptions.map((option: string) => (
          <label key={option} className="inline-flex items-center mt-1 mr-4">
            <input
              type="radio"
              name={id}
              value={option}
              className="form-radio"
              checked={values[id] === option}
              onChange={handleChange}
            />
            <span className="ml-2">{option}</span>
          </label>
        ))}
    </FieldWrapper>
  );
};

export default RadioField;
