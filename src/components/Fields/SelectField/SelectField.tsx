import { useField } from "@/hooks";
import { OptionsType, SelectFieldType } from "@/types";
import React, { useEffect, useState } from "react";

const SelectField: React.FC<SelectFieldType> = (props) => {
  const {
    eventHandlers,
    processedProps,
    fieldParams,
    fieldValue,
    fieldId,
    dynamicOptions,
    isTouched,
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
    <select
      {...fieldParams}
      {...eventHandlers.htmlHandlers}
      value={fieldValue || ""}
      data-touched={isTouched}
    >
      <option value="" disabled>
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
          >
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
};

export default SelectField;
