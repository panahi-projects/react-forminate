import { useField } from "@/hooks";
import { TextFieldType } from "@/types";

const InputField: React.FC<TextFieldType> = (props) => {
  const { eventHandlers, fieldParams, fieldValue } = useField(props);

  return <input {...fieldParams} {...eventHandlers} value={fieldValue ?? ""} />;
};

export default InputField;
