import { useMemo, useRef } from "react";
import { useForm } from "../providers/formContext";
import {
  FormDataCollectionType,
  FormFieldType,
  ProcessedFieldProps,
  SupportedTypes,
} from "../types";
import { processFieldProps } from "../utils";

const processFieldRecursively = <T extends FormFieldType>(
  field: T,
  values: Record<string, SupportedTypes>,
  formSchema: FormDataCollectionType
): ProcessedFieldProps<T> => {
  const processed = processFieldProps(field, field.fieldId, values, formSchema);

  // Process nested fields if they exist
  if (field.fields && field.fields.length > 0) {
    processed.fields = field.fields.map((nestedField) =>
      processFieldRecursively(nestedField, values, formSchema)
    ) as typeof processed.fields;
  }

  return processed as ProcessedFieldProps<T>;
};

export const useFieldProcessor = <T extends FormFieldType>(
  field: T
): ProcessedFieldProps<T> => {
  const { values, formSchema, dependencyMap } = useForm();
  const cachedProcessedField = useRef<ProcessedFieldProps<T>>(
    field as ProcessedFieldProps<T>
  );

  return useMemo(() => {
    if (dependencyMap && dependencyMap[field.fieldId].size > 0) {
      // If the field has dependencies, we need to process it recursively
      return processFieldRecursively(field, values, formSchema);
    } else {
      // If the field has no dependencies, we can return the cached processed field
      return cachedProcessedField.current || (field as ProcessedFieldProps<T>);
    }
  }, [field, values, formSchema]);
};
