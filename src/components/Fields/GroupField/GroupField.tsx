import { DynamicFormField } from "@/components/DynamicFormField";
import { GroupFieldType, TFieldLabel } from "@/types";
import React from "react";

const GroupField: React.FC<GroupFieldType> = ({
  fieldId: id,
  as: Component = "fieldset",
  label,
  fields,
  className = "",
  styles = {},
  legendClassName = "",
  legendStyles = {},
  labelClassName, // we must keep it that not to automatically inject it to the HTML as an attribute
  labelStyles = {},
  ...rest
}) => {
  return (
    <Component
      id={id}
      data-testid="group-field"
      className={className}
      style={styles}
      // Only pass 'disabled' if it's a boolean, otherwise omit it
      {...(typeof rest.disabled === "boolean"
        ? { disabled: rest.disabled }
        : {})}
      {...Object.fromEntries(
        Object.entries(rest).filter(([key]) => key !== "disabled")
      )}
    >
      {Component === "fieldset" && (
        <legend className={legendClassName} style={legendStyles}>
          {label as TFieldLabel}
        </legend>
      )}

      {fields &&
        fields.map((field) => (
          <DynamicFormField key={field.fieldId} {...field} />
        ))}
    </Component>
  );
};

export default React.memo(GroupField);
