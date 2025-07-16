import { Select } from "@/components/StyledElements";
import { useField } from "@/hooks";
import { OptionsType, SelectFieldType } from "@/types";
import React, { useEffect, useMemo, useState } from "react";

const SelectField: React.FC<SelectFieldType> = (props) => {
  const {
    eventHandlers,
    processedProps,
    fieldParams,
    fieldValue,
    fieldId,
    dynamicOptions,
    fieldErrors,
    hasDefaultStyling,
  } = useField<SelectFieldType, HTMLSelectElement>(props);

  const [selectOptions, setSelectOptions] = useState<OptionsType[]>(
    processedProps.options || []
  );

  // Normalize options to { label, value } format
  const normalizedOptions = useMemo(() => {
    const rawOptions =
      dynamicOptions?.[fieldId] || processedProps.options || [];
    return typeof rawOptions[0] === "string"
      ? rawOptions.map((opt: string) => ({ label: opt, value: opt }))
      : rawOptions;
  }, [dynamicOptions, fieldId, processedProps.options]);

  // Update options when they change
  useEffect(() => {
    setSelectOptions(normalizedOptions);
  }, [normalizedOptions]);

  // Common select props
  const commonSelectProps = {
    ...fieldParams,
    ...eventHandlers.htmlHandlers,
    value: fieldValue || "",
    $hasError: !!fieldErrors,
  };

  // Options rendering
  const renderOptions = () => (
    <>
      <option value="" disabled>
        {processedProps.placeholder || "Select an option"}
      </option>
      {selectOptions.map((option, index) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel = typeof option === "string" ? option : option.label;
        const key =
          typeof option === "string" ? option : `${option.value}-${index}`;

        return (
          <option key={key} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </>
  );

  return hasDefaultStyling ? (
    <Select {...commonSelectProps}>{renderOptions()}</Select>
  ) : (
    <select {...commonSelectProps}>{renderOptions()}</select>
  );
};

export default React.memo(SelectField);
