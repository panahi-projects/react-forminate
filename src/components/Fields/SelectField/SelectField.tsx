import { Select } from "@/components/StyledElements";
import { useField } from "@/hooks";
import { OptionsType, SelectFieldType } from "@/types";
import React, { useMemo } from "react";

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

  const normalizedOptions = useMemo(() => {
    const rawOptions =
      dynamicOptions?.[fieldId] || processedProps.options || [];
    if (typeof rawOptions[0] === "string") {
      return (rawOptions as string[]).map((opt) => ({
        label: opt,
        value: opt,
      }));
    }
    return rawOptions as OptionsType[];
  }, [dynamicOptions?.[fieldId], processedProps.options]);

  const commonSelectProps = {
    ...fieldParams,
    ...eventHandlers.htmlHandlers,
    value: fieldValue as string | number,
    hasError: !!fieldErrors,
    className: processedProps.className, // Pass through any className
  };

  const OptionList = useMemo(
    () => (
      <>
        <option value="" disabled>
          {processedProps.placeholder || "Select an option"}
        </option>
        {normalizedOptions.map((option, index) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          return (
            <option key={`${value}-${index}`} value={value}>
              {label}
            </option>
          );
        })}
      </>
    ),
    [normalizedOptions, processedProps.placeholder]
  );

  return hasDefaultStyling ? (
    <Select {...commonSelectProps}>{OptionList}</Select>
  ) : (
    <select {...commonSelectProps} className={processedProps.className}>
      {OptionList}
    </select>
  );
};

export default React.memo(SelectField);
