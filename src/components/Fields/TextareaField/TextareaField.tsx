import { useField } from "@/hooks";
import { TextareaFieldType } from "@/types";

const TextareaField: React.FC<TextareaFieldType> = (props) => {
  const { eventHandlers, fieldParams, fieldValue, isTouched } = useField<
    TextareaFieldType,
    HTMLTextAreaElement
  >(props);

  return (
    <textarea
      {...fieldParams}
      {...eventHandlers.htmlHandlers}
      value={fieldValue || ""}
      data-touched={isTouched}
    />
  );
};

export default TextareaField;
