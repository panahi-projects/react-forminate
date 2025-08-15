import { Input } from "@/components/StyledElements";
import { useOptimizedField } from "@/hooks";
import { TextFieldType } from "@/types";
import React from "react";

const InputField: React.FC<TextFieldType> = (props) => {
  const {
    eventHandlers,
    value: fieldValue,
    error: fieldErrors,
    props: fieldProps,
    fieldParams,
  } = useOptimizedField(props);

  // Common input props
  const commonInputProps = {
    ...fieldParams,
    ...eventHandlers.htmlHandlers,
    value: fieldValue as string | number,
  };

  return !fieldProps.disableDefaultStyling ? (
    <Input {...commonInputProps} hasError={!!fieldErrors} />
  ) : (
    <input {...commonInputProps} />
  );
};

export default React.memo(InputField);
