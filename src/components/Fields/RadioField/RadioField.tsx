import {
  RadioContainer,
  RadioInput,
  RadioLabel,
  RadioLabelText,
} from "@/components/StyledElements";
import { useField } from "@/hooks";
import { OptionsType, RadioFieldType } from "@/types";
import React from "react";

const RadioField: React.FC<RadioFieldType> = (props) => {
  const {
    eventHandlers,
    processedProps,
    fieldParams,
    fieldValue,
    isTouched,
    hasDefaultStyling = true,
    fieldId,
    errors,
  } = useField(props);

  const layout = processedProps?.layout || "inline";
  const hasError = !!errors[fieldId];

  // Common props for both styled and unstyled inputs
  const commonInputProps = {
    ...fieldParams,
    ...eventHandlers.htmlHandlers,
    "data-touched": isTouched,
  };

  const renderRadioOption = (option: OptionsType, index: number) => {
    const isString = typeof option === "string";
    const optionValue = isString ? option : option.value;
    const optionLabel = isString ? option : option.label;
    const key = isString ? option : `${option.value}-${index}`;
    const additionalProps = !isString ? option : {};

    return hasDefaultStyling ? (
      <RadioLabel
        key={key}
        style={processedProps?.itemsStyles}
        className={processedProps?.itemsClassName}
      >
        <RadioInput
          {...commonInputProps}
          {...additionalProps}
          value={optionValue}
          checked={fieldValue === optionValue}
        />
        <RadioLabelText>{optionLabel}</RadioLabelText>
      </RadioLabel>
    ) : (
      <label
        key={key}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          ...processedProps?.itemsStyles,
        }}
        className={processedProps?.itemsClassName}
      >
        <input
          type="radio"
          {...commonInputProps}
          {...additionalProps}
          value={optionValue}
          checked={fieldValue === optionValue}
          className={hasError ? "error" : ""}
        />
        <span>{optionLabel}</span>
      </label>
    );
  };

  const containerProps = {
    "data-testid": fieldParams["data-testid"],
    "data-touched": isTouched,
    style: processedProps?.containerStyles,
  };

  return hasDefaultStyling ? (
    <RadioContainer $layout={layout} {...containerProps}>
      {props.options?.map(renderRadioOption)}
    </RadioContainer>
  ) : (
    <div
      {...containerProps}
      style={{
        display: "flex",
        flexDirection: layout === "inline" ? "row" : "column",
        gap: layout === "inline" ? "24px" : "8px",
        flexWrap: "wrap",
        ...processedProps?.containerStyles,
      }}
    >
      {props.options?.map(renderRadioOption)}
    </div>
  );
};

export default React.memo(RadioField);
