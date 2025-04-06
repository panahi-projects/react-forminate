import { FormField, SelectField } from "../types";

export function isSelectField(field: FormField): field is SelectField {
  return field.type === "select";
}
