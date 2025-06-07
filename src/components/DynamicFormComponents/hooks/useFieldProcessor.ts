import { useMemo } from "react";
import { useForm } from "../providers/formContext";
import { FormFieldType, ProcessedFieldProps } from "../types";
import { FieldProcessor } from "../utils/fieldProcessor";

export const useFieldProcessor = <T extends FormFieldType>(
  field: T
): ProcessedFieldProps<T> => {
  const { values, formSchema } = useForm();
  const processor = FieldProcessor.getInstance();

  return useMemo(() => {
    const res = processor.process(field, values, formSchema);
    return res;
  }, [field, values, formSchema]);
};
