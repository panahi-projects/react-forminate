import { ComponentType, FC, lazy, Suspense } from "react";
import { useForm } from "../providers/FormProvider";
import {
  BaseField,
  CheckboxField as CheckboxFieldType,
  DateField as DateFieldType,
  RadioField as RadioFieldType,
  SelectField as SelectFieldType,
  TextField as TextFieldType,
} from "../types";

// Lazy load field components for better performance
const InputField = lazy(() =>
  import("../Fields").then((module) => ({ default: module.InputField }))
);
const DatePickerField = lazy(() =>
  import("../Fields").then((module) => ({ default: module.DatePickerField }))
);
const GroupField = lazy(() =>
  import("../Fields").then((module) => ({ default: module.GroupField }))
);
const SelectField = lazy(() =>
  import("../Fields").then((module) => ({ default: module.SelectField }))
);
const RadioField = lazy(() =>
  import("../Fields").then((module) => ({ default: module.RadioField }))
);
const CheckboxField = lazy(() =>
  import("../Fields").then((module) => ({ default: module.CheckboxField }))
);

// Define the prop type as a union of all field interfaces
type FieldProps =
  | TextFieldType
  | DateFieldType
  | SelectFieldType
  | RadioFieldType
  | CheckboxFieldType
  | BaseField;

// Mapping of field types to their respective components
const fieldComponents: Record<string, ComponentType<any>> = {
  group: GroupField,
  text: InputField,
  number: InputField,
  email: InputField,
  date: DatePickerField,
  select: SelectField,
  radio: RadioField,
  checkbox: CheckboxField,
};

// Plugin extension mechanism (for additional fields like SwitchField)
export const registerField = (type: string, component: ComponentType<any>) => {
  fieldComponents[type] = component;
};

// Generic DynamicFormField component
const DynamicFormField: FC<FieldProps> = (props) => {
  const { shouldShowField } = useForm();
  if (!shouldShowField(props)) return null;

  // Get the corresponding field component dynamically
  const FieldComponent = fieldComponents[props.type];
  if (!FieldComponent) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FieldComponent {...props} />
    </Suspense>
  );
};

export default DynamicFormField;
