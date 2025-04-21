import { FieldWrapper } from "../../FieldWrapper";
import { buildFieldEventHandlers } from "../../helpers/buildFieldEventHandlers";
import { useFieldEvents } from "../../helpers/useFieldEvents";
import { TextareaFieldType } from "../../types";

const TextareaField: React.FC<TextareaFieldType> = ({
  fieldId: id,
  label,
  type,
  required,
  placeholder = "",
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
  events,
  ...rest
}) => {
  const { values, errors } = useFieldEvents();
  const {
    validation: _validation,
    requiredMessage: _requiredMessage,
    visibility: _visibility,
    ...safeRest
  } = rest;
  const fieldValue = values[id] || "";

  const inputProps = {
    "data-testid": "textarea-field",
    id,
    type,
    className,
    placeholder,
    style: styles,
    ...safeRest,
  };

  const eventHandlers = buildFieldEventHandlers<HTMLTextAreaElement>({
    fieldId: id,
    value: fieldValue,
    type,
    ...events,
  });
  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      error={errors[id]}
      className={containerClassName}
      styles={containerStyles}
      labelClassName={labelClassName}
      labelStyles={labelStyles}
    >
      <textarea {...inputProps} {...eventHandlers} />
    </FieldWrapper>
  );
};

export default TextareaField;
