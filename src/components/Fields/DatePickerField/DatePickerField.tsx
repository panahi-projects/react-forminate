import { useField } from "@/hooks";
import { DateFieldType } from "@/types";
import React from "react";

const DatePickerField: React.FC<DateFieldType> = (props) => {
  const { eventHandlers, fieldParams, fieldValue, isTouched } = useField(props);

  return (
    <input
      {...fieldParams}
      {...eventHandlers}
      value={fieldValue || ""}
      data-touched={isTouched}
    />
  );
};

export default DatePickerField;
