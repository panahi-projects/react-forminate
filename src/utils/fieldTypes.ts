import { FieldTypes } from "@/types";

type ComponentLoader = () => Promise<{ default: React.ComponentType<any> }>;

export const FIELD_COMPONENT_MAP: Record<FieldTypes, ComponentLoader> = {
  text: () => import("../components/Fields/InputField"),
  email: () => import("../components/Fields/InputField"),
  password: () => import("../components/Fields/InputField"),
  select: () => import("../components/Fields/SelectField"),
  checkbox: () => import("../components/Fields/CheckboxField"),
  radio: () => import("../components/Fields/RadioField"),
  date: () => import("../components/Fields/DatePickerField"),
  file: () => import("../components/Fields/InputFileField"),
} as const;
