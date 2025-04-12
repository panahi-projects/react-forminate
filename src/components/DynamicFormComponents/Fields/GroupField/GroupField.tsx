import React from "react";
import { DynamicFormField } from "../../DynamicFormField";
import { GroupFieldType } from "../../types";

const GroupField: React.FC<GroupFieldType> = ({
  fieldId: id,
  as: Component = "fieldset",
  label,
  fields,
  className = "",
  styles = {},
  legendClassName = "",
  legendStyles = {},
  ...rest
}) => {
  return (
    <Component
      id={id}
      data-testid="group-field"
      className={className}
      style={styles}
      {...rest}
    >
      {Component === "fieldset" && (
        <legend className={legendClassName} style={legendStyles}>
          {label}
        </legend>
      )}

      {fields &&
        fields.map((field) => (
          <DynamicFormField key={field.fieldId} {...field} />
        ))}
    </Component>
  );
};

export default GroupField;
