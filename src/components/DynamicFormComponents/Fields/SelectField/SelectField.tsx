import React, { useEffect, useState } from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { useForm } from "../../providers/FormProvider";
import { SelectField as SelectFieldType } from "../../types";

const SelectField: React.FC<SelectFieldType> = ({
  id,
  label,
  options,
  required,
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

  /* This block of code is only for development testing,
     I added this block because somewhere in the form schema we have "state" field 
     while we don't have "country" field to select the state based on the country.
     So, I added this block to set some sample values for the state field to pass the required validation.
   */
  //--------------------------------------------
  useEffect(() => {
    if (
      id === "state" &&
      (typeof options === "undefined" || options?.length === 0)
    ) {
      setDynamicValues([
        "* Sample value to select to pass required validation",
      ]);
    }
  }, [id]);
  //--------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(id, e.target.value);
    validateField(id, e.target.value);
  };

  return (
    <FieldWrapper id={id} label={label} required={required} error={errors[id]}>
      <select
        id={id}
        value={values[id] || ""}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
