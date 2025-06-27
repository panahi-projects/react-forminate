import { useField } from "@/hooks";
import { TextFieldType } from "@/types";

const InputField: React.FC<TextFieldType> = (props) => {
  const { eventHandlers, fieldParams, fieldValue, isTouched } = useField(props);

  return (
    <input
      {...fieldParams}
      {...eventHandlers.htmlHandlers}
      value={fieldValue ?? ""}
      data-touched={isTouched}
    />
  );
};

export default InputField;
