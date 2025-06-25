import { useField } from "@/hooks";
import { CheckboxFieldType } from "@/types";
import React from "react";

const CheckboxField: React.FC<CheckboxFieldType> = (props) => {
  const { eventHandlers, processedProps, fieldParams, fieldValue, fieldId } =
    useField(props);

  return (
    <div data-testid={fieldParams["data-testid"]}>
      {processedProps?.options?.map((option, index) => {
        const isString = typeof option === "string";
        const optionValue = isString ? option : option.value;
        const optionLabel = isString ? option : option.label;

        return (
          <label
            key={isString ? option : `${option.value}-${index}`}
            htmlFor={`${fieldId}-item-${optionValue}`}
            style={processedProps.itemsStyles}
            className={processedProps.itemsClassName}
          >
            <input
              {...fieldParams}
              {...eventHandlers}
              id={`${fieldId}-item-${optionValue}`}
              value={optionValue}
              checked={fieldValue?.includes(optionValue) || false}
            />
            <span>{optionLabel}</span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckboxField;
