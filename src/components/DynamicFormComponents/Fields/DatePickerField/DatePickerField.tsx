import React from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { DateField } from "../../types";

const DatePickerField: React.FC<DateField> = ({
  fieldId: id,
  label,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
  events,
  ...rest
}) => {
  const { values, errors } = useFieldEvents();
  const {
    type: _type,
    validation: _validation,
    requiredMessage: _requiredMessage,
    visibility: _visibility,

    ...safeRest
  } = rest;
  const fieldValue = values[id] || "";

  const inputProps = {
    "data-testid": "date-picker-field",
    id,
    name: id,
    type: "date",
    className,
    style: styles,
    ...safeRest,
  };

  const eventHandlers = buildFieldEventHandlers<HTMLInputElement>({
    fieldId: id,
    value: fieldValue,
    type: "date",
    ...events,
  });

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      error={errors[id]}
      className={containerClassName}
      styles={containerStyles}
      labelClassName={labelClassName}
      labelStyles={labelStyles}
    >
      <input {...inputProps} {...eventHandlers} />
    </FieldWrapper>
  );
};

export default DatePickerField;
