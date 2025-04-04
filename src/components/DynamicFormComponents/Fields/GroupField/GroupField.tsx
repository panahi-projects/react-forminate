import React from "react";
import { DynamicFormField } from "../../DynamicFormField";

interface GroupFieldProps {
  fieldId: string;
  label: string;
  fields?: any[];
  className?: string;
  styles?: React.CSSProperties;
  legendClassName?: string;
  legendStyles?: React.CSSProperties;
}

const GroupField: React.FC<GroupFieldProps> = ({
  fieldId: id,
  label,
  fields,
  className = "",
  styles = {},
  legendClassName = "",
  legendStyles = {},
  ...rest
}) => {
  return (
    <fieldset
      id={id}
      data-testid="group-field"
      className={className}
      style={styles}
      {...rest}
    >
      <legend className={legendClassName} style={legendStyles}>
        {label}
      </legend>
      {fields &&
        fields.map((field) => <DynamicFormField key={field.id} {...field} />)}
    </fieldset>
  );
};

export default GroupField;
