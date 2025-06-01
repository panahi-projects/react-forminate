import React from "react";
import { useField } from "../../hooks/useField";
import { RadioFieldType } from "../../types";

const RadioField: React.FC<RadioFieldType> = (props) => {
  const { eventHandlers, processedProps, fieldParams, fieldValue } =
    useField(props);

  return (
    <div data-testid={fieldParams["data-testid"]}>
      {props.options?.map((option, index) => {
        const isString = typeof option === "string";
        const optionValue = isString ? option : option.value;
        const optionLabel = isString ? option : option.label;

        return (
          <label
            key={isString ? option : `${option.value}-${index}`}
            style={processedProps.itemsStyles}
            className={processedProps.itemsClassName}
          >
            <input
              {...fieldParams}
              {...eventHandlers}
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
