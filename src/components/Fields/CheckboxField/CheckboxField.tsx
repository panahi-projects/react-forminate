import { useField } from "@/hooks";
import { CheckboxFieldType } from "@/types";
import React, { useMemo, useCallback } from "react";

/**
 * CheckboxField component - Renders either a single checkbox or a group of checkboxes
 * with optimized performance through memoization and reduced re-renders
 */
const CheckboxField: React.FC<CheckboxFieldType> = React.memo((props) => {
  const {
    eventHandlers,
    processedProps,
    fieldParams,
    fieldValue,
    fieldId,
    isTouched,
    setValue,
  } = useField(props);

  // Memoize derived values to prevent recalculation on every render
  const isSingleCheckbox = useMemo(
    () => !processedProps?.options,
    [processedProps?.options]
  );
  const layout = useMemo(
    () => processedProps?.layout || "column",
    [processedProps?.layout]
  );
  const singlePositiveAnswerValue = useMemo(
    () => processedProps?.singlePositiveAnswerValue || "true",
    [processedProps?.singlePositiveAnswerValue]
  );
  const singleNegativeAnswerValue = useMemo(
    () => processedProps?.singleNegativeAnswerValue || "",
    [processedProps?.singleNegativeAnswerValue]
  );

  // Memoize container style to prevent object recreation on every render
  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      display: "flex",
      flexDirection: layout === "inline" ? "row" : "column",
      gap: layout === "inline" ? "24px" : "8px",
      flexWrap: "wrap",
      ...(processedProps?.containerStyles as React.CSSProperties),
    }),
    [layout, processedProps?.containerStyles]
  );

  // Memoize label style to prevent object recreation on every render
  const labelStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: "4px",
      cursor: "pointer",
      ...processedProps?.itemsStyles,
    }),
    [processedProps?.itemsStyles]
  );

  // Optimized isChecked function with useCallback to maintain reference equality
  const isChecked = useCallback(
    (optionValue?: string | number): boolean => {
      if (isSingleCheckbox) {
        return (
          fieldValue === singlePositiveAnswerValue || fieldValue === "true"
        );
      }

      return Boolean(
        optionValue &&
          Array.isArray(fieldValue) &&
          fieldValue.includes(optionValue as string)
      );
    },
    [isSingleCheckbox, fieldValue, singlePositiveAnswerValue]
  );

  // Memoize single checkbox change handler
  const handleSingleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked
        ? singlePositiveAnswerValue
        : singleNegativeAnswerValue;
      setValue(fieldId, newValue);
    },
    [setValue, fieldId, singlePositiveAnswerValue, singleNegativeAnswerValue]
  );

  // Memoize single checkbox rendering to prevent unnecessary re-renders
  const renderSingleCheckbox = useMemo(() => {
    if (!isSingleCheckbox) return null;

    return (
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
          checked={isChecked()}
          onChange={handleSingleCheckboxChange}
        />
        {processedProps?.description && (
          <span>{processedProps.description}</span>
        )}
      </label>
    );
  }, [
    isSingleCheckbox,
    fieldId,
    labelStyle,
    processedProps?.itemsClassName,
    processedProps?.description,
    fieldParams,
    eventHandlers.htmlHandlers,
    isChecked,
    handleSingleCheckboxChange,
  ]);

  // Memoize multiple checkboxes rendering to prevent unnecessary re-renders
  const renderMultipleCheckboxes = useMemo(() => {
    if (isSingleCheckbox || !processedProps?.options) return null;

    return processedProps.options.map((option, index) => {
      const isString = typeof option === "string";
      const optionValue = isString ? option : option.value;
      const optionLabel = isString ? option : option.label;
      const optionKey = isString ? option : `${option.value}-${index}`;
      const optionId = `${fieldId}-item-${optionValue}`;

      return (
        <label
          key={optionKey}
          htmlFor={optionId}
          style={labelStyle}
          className={processedProps.itemsClassName}
        >
          <input
            {...fieldParams}
            {...eventHandlers.htmlHandlers}
            id={optionId}
            value={optionValue}
            checked={isChecked(optionValue)}
          />
          <span>{optionLabel}</span>
        </label>
      );
    });
  }, [
    isSingleCheckbox,
    processedProps?.options,
    processedProps?.itemsClassName,
    fieldId,
    labelStyle,
    fieldParams,
    eventHandlers.htmlHandlers,
    isChecked,
  ]);

  return (
    <div
      data-testid={fieldParams["data-testid"]}
      data-touched={isTouched}
      style={containerStyle}
    >
      {renderSingleCheckbox}
      {renderMultipleCheckboxes}
    </div>
  );
});

CheckboxField.displayName = "CheckboxField";

export default CheckboxField;
