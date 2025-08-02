import { useForm } from "./formHooks";

type Handler = Function | undefined;

export const useFieldEvents = () => {
  const {
    values,
    errors,
    formSchema,
    formOptions,
    touched,
    blurred,
    setBlurred,
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
    formOptions,
    touched,
    blurred,
    setValue,
    handleCustomEvent,
    setTouched,
    setBlurred,
    validateField,
  };
};
