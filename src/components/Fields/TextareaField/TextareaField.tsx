import { Textarea } from "@/components/StyledElements";
import { useField } from "@/hooks";
import { TextareaFieldType } from "@/types";
import React from "react";

const TextareaField: React.FC<TextareaFieldType> = (props) => {
  const {
    eventHandlers,
    fieldParams,
    fieldValue,
    hasDefaultStyling,
    fieldErrors,
  } = useField<TextareaFieldType, HTMLTextAreaElement>(props);

  // Common input props
  const commonInputProps = {
    ...fieldParams,
    ...eventHandlers.htmlHandlers,
    value: fieldValue ?? "",
  };

  return hasDefaultStyling ? (
    <Textarea {...commonInputProps} $hasError={!!fieldErrors} />
  ) : (
    <textarea {...commonInputProps} />
  );
};

export default React.memo(TextareaField);
