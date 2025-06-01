import { useEffect } from "react";
import { useForm } from "../providers/formContext";
import { SupportedTypes } from "../types";

export const useDefaultFieldValue = (
  fieldId: string,
  _defaultValue: SupportedTypes
) => {
  const { values, setValue } = useForm();

  useEffect(() => {
    const currentValue = values[fieldId];
    if (currentValue === undefined && _defaultValue !== undefined) {
      setValue(fieldId, _defaultValue); // Automatically triggers validation
    }
  }, [fieldId, values, _defaultValue, setValue]);
};
