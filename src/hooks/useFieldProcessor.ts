import { FormFieldType, ProcessedFieldProps } from "@/types";
import { FieldProcessor } from "@/utils";
import { useMemo } from "react";
import { useFormMeta, useFormValues } from "./formHooks";

export const useFieldProcessor = <T extends FormFieldType>(
  field: T
): ProcessedFieldProps<T> => {
  const values = useFormValues();
  const { formSchema } = useFormMeta();

  const processor = FieldProcessor.getInstance();

  return useMemo(() => {
    const res = processor.process(field, values, formSchema);
    return res;
  }, [field, values, formSchema]);
};
