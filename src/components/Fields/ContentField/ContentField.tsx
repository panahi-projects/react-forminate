import { useField } from "@/hooks";
import { ContentFieldType } from "@/types";

const ContentField: React.FC<ContentFieldType> = (props) => {
  const { processedProps } = useField(props);
  const Component = processedProps.as || "div";
  return <Component>{processedProps.content}</Component>;
};

export default ContentField;
