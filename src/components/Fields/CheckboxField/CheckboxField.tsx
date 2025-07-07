import { useField } from "@/hooks";
import { CheckboxFieldType } from "@/types";
import React from "react";

const CheckboxField: React.FC<CheckboxFieldType> = (props) => {
  const {
    eventHandlers,
    processedProps,
    fieldParams,
    fieldValue,
    fieldId,
    isTouched,
    setValue,
  } = useField(props);

  // Determine if we're in single checkbox mode
  const isSingleCheckbox = !processedProps?.options;

  // Determine layout mode (defaults to 'column' if not specified)
  const layout = processedProps?.layout || "column";

  // Handle single checkbox change
  const handleSingleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.checked ? "true" : "false";

    // Create a synthetic event that matches what your form system expects
    if (newValue === "true") {
      setValue(fieldId, processedProps?.singlePositiveAnswerValue || newValue);
    } else {
      setValue(fieldId, processedProps?.singleNegativeAnswerValue || "");
    }
  };

  // Container style based on layout
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: layout === "inline" ? "row" : "column",
    gap: layout === "inline" ? "24px" : "8px", // More gap for inline, less for column
    flexWrap: "wrap",
    ...(processedProps?.containerStyles as React.CSSProperties),
  };

  // Label style (applies to both single and multiple checkboxes)
  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px", // Space between checkbox and label
    cursor: "pointer",
    ...processedProps?.itemsStyles,
  };
  return (
    <div
      data-testid={fieldParams["data-testid"]}
      data-touched={isTouched}
      style={containerStyle}
    >
      {isSingleCheckbox ? (
        // Single checkbox mode
        <label
          htmlFor={fieldId}
          style={labelStyle}
          className={processedProps?.itemsClassName}
        >
          <input
            {...fieldParams}
            {...eventHandlers.htmlHandlers}
            id={fieldId}
            type="checkbox"
            checked={
              fieldValue === processedProps?.singlePositiveAnswerValue ||
              fieldValue === "true"
            }
            onChange={handleSingleCheckboxChange}
          />
          {processedProps?.description && (
            <span>{processedProps.description}</span>
          )}
        </label>
      ) : (
        // Multiple checkboxes mode
        processedProps?.options?.map((option, index) => {
          const isString = typeof option === "string";
          const optionValue = isString ? option : option.value;
          const optionLabel = isString ? option : option.label;

          return (
            <label
              key={isString ? option : `${option.value}-${index}`}
              htmlFor={`${fieldId}-item-${optionValue}`}
              style={labelStyle}
              className={processedProps.itemsClassName}
            >
              <input
                {...fieldParams}
                {...eventHandlers.htmlHandlers}
                id={`${fieldId}-item-${optionValue}`}
                value={optionValue}
                checked={fieldValue?.includes(optionValue) || false}
              />
              <span>{optionLabel}</span>
            </label>
          );
        })
      )}
    </div>
  );
};

export default CheckboxField;
