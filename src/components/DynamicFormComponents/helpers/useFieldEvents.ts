import { useForm } from "../providers/formContext";

type Handler = Function | undefined;

export const useFieldEvents = () => {
  const {
    values,
    errors,
    setValue,
    getFieldSchema,
    formSchema,
    dynamicOptions,
    shouldShowField,
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
    values,
    dynamicOptions,
    errors,
    formSchema,
    setValue,
    getFieldSchema,
    handleCustomEvent,
    shouldShowField,
  };
};
