import React, { useEffect, useState } from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { useForm } from "../../providers/FormProvider";
import { SelectField as SelectFieldType } from "../../types";

const SelectField: React.FC<SelectFieldType> = ({
  id,
  label,
  options,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
}) => {
  const { values, setValue, errors, validateField, dynamicOptions } = useForm();
  const [dynamicValues, setDynamicValues] = useState<string[]>(
    dynamicOptions[id] || options || []
  );

  useEffect(() => {
    if (dynamicOptions[id]) {
      setDynamicValues(Object.values(dynamicOptions[id])?.[1] || options || []);
    }
  }, [dynamicOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    >
      <select
        id={id}
        value={values[id] || ""}
        onChange={handleChange}
        className={className}
        style={styles}
      >
        <option value="" disabled>
          Select an option
        </option>
        {dynamicValues &&
          dynamicValues?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
    </FieldWrapper>
  );
};

export default SelectField;
