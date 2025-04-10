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
  dynamicOptions: _omitDynamicOptions, // removed from DOM
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
  const {
    validation: _validation,
    requiredMessage: _requiredMessage,
    visibility: _visibility,
    ...safeRest
  } = rest;

  const [selectOptions, setSelectOptions] = useState<
    { label: string; value: any }[] | string[]
  >(options || []);

  // Update options when dynamicOptions are loaded
  useEffect(() => {
    if (dynamicOptions && dynamicOptions[id]) {
      setSelectOptions(dynamicOptions[id]);
    }
  }, [dynamicOptions, id]);

  useEffect(() => {
    let raw = dynamicOptions?.[id] || options || [];

    // Normalize string[] to { label, value }[]
    const normalized =
      typeof raw[0] === "string"
        ? raw.map((opt: string) => ({ label: opt, value: opt }))
        : raw;

    setSelectOptions(normalized);
  }, [dynamicOptions, id, options]);

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
    ...safeRest, // safe now since dynamicOptions props are removed
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
        {selectOptions.map((option) => (
          <option
            key={typeof option !== "string" ? option.value : option}
            value={typeof option !== "string" ? option.value : option}
          >
            {typeof option !== "string" ? option.label : option}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
};

export default SelectField;
