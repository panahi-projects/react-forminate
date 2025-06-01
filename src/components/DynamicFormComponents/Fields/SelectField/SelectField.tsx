import React, { useEffect, useState } from "react";
import { useField } from "../../hooks/useField";
import { OptionsType, SelectFieldType } from "../../types";

const SelectField: React.FC<SelectFieldType> = (props) => {
  const {
    eventHandlers,
    processedProps,
    fieldParams,
    fieldValue,
    fieldId,
    dynamicOptions,
  } = useField<SelectFieldType, HTMLSelectElement>(props);

  const [selectOptions, setSelectOptions] = useState<OptionsType[]>(
    processedProps.options || []
  );

  // Update options when dynamicOptions are loaded
  useEffect(() => {
    if (dynamicOptions && dynamicOptions[fieldId]) {
      setSelectOptions(dynamicOptions[fieldId]);
    }
  }, [dynamicOptions, fieldId]);

  useEffect(() => {
    let raw = dynamicOptions?.[fieldId] || processedProps.options || [];

    // Normalize string[] to { label, value }[]
    const normalized =
      typeof raw[0] === "string"
        ? raw.map((opt: string) => ({ label: opt, value: opt }))
        : raw;

    setSelectOptions(normalized);
  }, [dynamicOptions, fieldId, processedProps.options]);

  return (
    <select {...fieldParams} {...eventHandlers}>
      <option value="" disabled selected={!fieldValue}>
        {processedProps.placeholder
          ? processedProps.placeholder
          : `Select an option`}
      </option>
      {selectOptions.map((option, index) => {
        const isString = typeof option === "string";
        const optionValue = isString ? option : option.value;
        const optionLabel = isString ? option : option.label;

        return (
          <option
            key={isString ? option : `${option.value}-${index}`}
            value={optionValue}
            selected={
              typeof option !== "string"
                ? fieldValue === option.value
                : fieldValue === option
            }
          >
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
};

export default SelectField;
