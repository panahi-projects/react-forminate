import React from "react";
import { DynamicFormField } from "../../DynamicFormField";

interface GroupFieldProps {
  id: string;
  label: string;
  fields?: any[];
}

const GroupField: React.FC<GroupFieldProps> = ({ label, fields }) => {
  return (
    <fieldset className="mb-6 border border-border p-4 rounded-lg shadow-sm">
      <legend className="text-sm dark:text-primary-foreground text-secondary/55 font-semibold px-2">
        {label}
      </legend>
      {fields &&
        fields.map((field) => <DynamicFormField key={field.id} {...field} />)}
    </fieldset>
  );
};

export default GroupField;
