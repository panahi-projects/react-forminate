import { useForm } from "../providers/formContext";

type Handler = Function | undefined;

export const useFieldEvents = () => {
  const { values, errors, setValue, getFieldSchema, formSchema } = useForm();

  const handleCustomEvent = <T>(
    handler: Handler,
    event: React.SyntheticEvent<T>,
    fieldId: string,
    newValue?: any
  ) => {
    if (handler) {
      const currentValue = newValue ?? values[fieldId];
      handler(
        event,
        fieldId,
        { ...values, [fieldId]: currentValue },
        errors,
        getFieldSchema(fieldId),
        formSchema
      );
    }
  };

  return {
    values,
    setValue,
    errors,
    getFieldSchema,
    formSchema,
    handleCustomEvent,
  };
};
