import { useField } from "../../hooks/useField";
import { TextareaFieldType } from "../../types";

const TextareaField: React.FC<TextareaFieldType> = (props) => {
  const { eventHandlers, fieldParams, fieldValue } = useField<
    TextareaFieldType,
    HTMLTextAreaElement
  >(props);

  return (
    <textarea {...fieldParams} {...eventHandlers} value={fieldValue || ""} />
  );
};

export default TextareaField;
