import React, { useEffect, useState } from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { SelectField as SelectFieldType } from "../../types";
import { useForm } from "../../providers/formContext";

const SelectField: React.FC<SelectFieldType> = ({
  fieldId: id,
  label,
  options,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
}) => {
  const { values, setValue, errors, dynamicOptions } = useForm();
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
      <select
        data-testid="select-field"
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
