import { FormFieldType, SelectFieldType } from "../types";

export function isSelectField(field: FormFieldType): field is SelectFieldType {
  return field.type === "select";
}
