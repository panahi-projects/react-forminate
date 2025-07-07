import { useField } from "@/hooks";
import { RadioFieldType } from "@/types";
import React from "react";

const RadioField: React.FC<RadioFieldType> = (props) => {
  const { eventHandlers, processedProps, fieldParams, fieldValue, isTouched } =
    useField(props);
  // Determine layout mode (defaults to 'column' if not specified)
  const layout = processedProps?.layout || "inline";

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
      {props.options?.map((option, index) => {
        const isString = typeof option === "string";
        const optionValue = isString ? option : option.value;
        const optionLabel = isString ? option : option.label;

        return (
          <label
            key={isString ? option : `${option.value}-${index}`}
            style={labelStyle}
            className={processedProps.itemsClassName}
          >
            <input
              {...fieldParams}
              {...eventHandlers.htmlHandlers}
              {...(!isString ? option : {})}
              value={optionValue}
              checked={fieldValue === optionValue}
            />
            <span>{optionLabel}</span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioField;
