import { SpacerField as SpacerFieldType } from "../../types";

const SpacerField: React.FC<SpacerFieldType> = ({
  as: Component = "div",
  fieldId,
  width = "100%",
  height = 16,
  className = "",
  styles = {},
  children,
  ...rest
}) => {
  return (
    <Component
      data-testid="spacer-field"
      id={fieldId}
      className={className}
      style={{
        width,
        height,
        ...styles,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default SpacerField;
