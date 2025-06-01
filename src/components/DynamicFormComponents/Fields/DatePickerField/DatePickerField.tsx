import React from "react";
import { useField } from "../../hooks/useField";
import { DateFieldType } from "../../types";

const DatePickerField: React.FC<DateFieldType> = (props) => {
  const { eventHandlers, fieldParams, fieldValue } = useField(props);

  return <input {...fieldParams} {...eventHandlers} value={fieldValue || ""} />;
};

export default DatePickerField;
