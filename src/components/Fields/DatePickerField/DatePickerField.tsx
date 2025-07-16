import { Input } from "@/components/StyledElements";
import { useField } from "@/hooks";
import { DateFieldType } from "@/types";
import React from "react";

const DatePickerField: React.FC<DateFieldType> = (props) => {
  const {
    eventHandlers,
    fieldParams,
    fieldValue,
    fieldErrors,
    hasDefaultStyling,
  } = useField(props);

  // Common input props
  const commonInputProps = {
    ...fieldParams,
    ...eventHandlers.htmlHandlers,
    value: fieldValue ?? "",
  };

  return hasDefaultStyling ? (
    <Input {...commonInputProps} $hasError={!!fieldErrors} />
  ) : (
    <input {...commonInputProps} />
  );
};

export default React.memo(DatePickerField);
