import { useForm } from "@/context";

type Handler = Function | undefined;

export const useFieldEvents = () => {
  const {
    values,
    errors,
    formSchema,
    setValue,
    getFieldSchema,
    setTouched,
    validateField,
  } = useForm();

  const handleCustomEvent = <T>(
    handler: Handler,
    event: React.SyntheticEvent<T>,
    fieldId: string,
    newValue?: any
  ) => {
    if (handler) {
      const currentValue = newValue ?? values[fieldId];
      const currentFieldSchema = getFieldSchema(fieldId);
      handler(
        event,
        fieldId,
        { ...values, [fieldId]: currentValue },
        currentFieldSchema,
        formSchema,
        errors
      );
    }
  };

  return {
    setValue,
    handleCustomEvent,
    setTouched,
    validateField,
  };
};
