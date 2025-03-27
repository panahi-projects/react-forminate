import React from "react";
import { DynamicFormField } from "../../DynamicFormField";

interface GroupFieldProps {
  id: string;
  label: string;
  fields?: any[];
  className?: string;
  styles?: React.CSSProperties;
  legendClassName?: string;
  legendStyles?: React.CSSProperties;
}

const GroupField: React.FC<GroupFieldProps> = ({
  label,
  fields,
  className = "",
  styles = {},
  legendClassName = "",
  legendStyles = {},
}) => {
  return (
    <fieldset className={className} style={styles}>
      <legend className={legendClassName} style={legendStyles}>
        {label}
      </legend>
      {fields &&
        fields.map((field) => <DynamicFormField key={field.id} {...field} />)}
    </fieldset>
  );
};

export default GroupField;
