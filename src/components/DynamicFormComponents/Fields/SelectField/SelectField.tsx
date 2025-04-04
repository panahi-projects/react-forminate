import React, { useEffect, useState } from "react";
import { FieldWrapper } from "../../FieldWrapper";
import { SelectField as SelectFieldType } from "../../types";
import { useForm } from "../../providers/formContext";

const SelectField: React.FC<SelectFieldType> = ({
  fieldId: id,
  label,
  options,
  required,
  className = "",
  styles = {},
  containerClassName = "",
  containerStyles = {},
  labelClassName = "",
  labelStyles = {},
  onCustomClick,
  onCustomChange,
  onCustomBlur,
  onCustomFocus,
  onCustomKeyDown,
  onCustomKeyUp,
  onCustomMouseDown,
  onCustomMouseEnter,
  onCustomMouseLeave,
  onCustomContextMenu,
  ...rest
}) => {
  const {
    values,
    setValue,
    errors,
    dynamicOptions,
    getFieldSchema,
    formSchema,
  } = useForm();
  const [dynamicValues, setDynamicValues] = useState<string[]>(
    dynamicOptions[id] || options || []
  );

  useEffect(() => {
    if (dynamicOptions[id]) {
      setDynamicValues(Object.values(dynamicOptions[id])?.[1] || options || []);
    }
  }, [dynamicOptions]);

  const handleDefaultChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(id, e.target.value);
  };

  const handleCustomEvent = (
    handler: Function | undefined,
    event: React.SyntheticEvent<HTMLSelectElement>
  ) => {
    if (handler) {
      handler(event, id, values, getFieldSchema(id), formSchema);
    }
  };

  const inputProps = {
    id,
    name: id,
    value: values[id] || "",
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleDefaultChange(e);
      handleCustomEvent(onCustomChange, e);
    },
    onClick: (e: React.MouseEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomClick, e),
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomBlur, e),
    onFocus: (e: React.FocusEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomFocus, e),
    onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomKeyDown, e),
    onKeyUp: (e: React.KeyboardEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomKeyUp, e),
    onMouseDown: (e: React.MouseEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomMouseDown, e),
    onMouseEnter: (e: React.MouseEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomMouseEnter, e),
    onMouseLeave: (e: React.MouseEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomMouseLeave, e),
    onContextMenu: (e: React.MouseEvent<HTMLSelectElement>) =>
      handleCustomEvent(onCustomContextMenu, e),
    className,
    style: styles,
    "data-testid": "select-field",
    ...rest,
  };

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
      <select {...inputProps}>
        <option value="" disabled>
          Select an option
        </option>
        {dynamicValues?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
};

export default SelectField;
