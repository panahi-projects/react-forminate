import { Input } from "@/components/StyledElements";
import { useField } from "@/hooks";
import { TextFieldType } from "@/types";
import React from "react";

const InputField: React.FC<TextFieldType> = (props) => {
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
    value: fieldValue as string | number,
  };

  return hasDefaultStyling ? (
    <Input {...commonInputProps} $hasError={!!fieldErrors} />
  ) : (
    <input {...commonInputProps} />
  );
};

export default React.memo(InputField);
