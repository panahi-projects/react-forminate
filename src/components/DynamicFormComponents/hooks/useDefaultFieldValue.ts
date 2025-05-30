import { useEffect } from "react";
import { useForm } from "../providers/formContext";

export const useDefaultFieldValue = (
  fieldId: string,
  _defaultValue: unknown
) => {
  const { values, setValue } = useForm();

  useEffect(() => {
    const currentValue = values[fieldId];
    if (
      (currentValue === undefined || currentValue === "") &&
      _defaultValue !== undefined
    ) {
      setValue(fieldId, _defaultValue); // Automatically triggers validation
    }
  }, [fieldId, values, _defaultValue, setValue]);
};
