import { ComponentType, FC, lazy, ReactNode, Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useForm } from "../providers/formContext";
import { FormField } from "../types";

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
const GridViewField = lazy(() =>
  import("../Fields").then((module) => ({ default: module.GridViewField }))
);
const ContainerField = lazy(() =>
  import("../Fields").then((module) => ({ default: module.ContainerField }))
);

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
  gridview: GridViewField,
  container: ContainerField,
  // Add other fields here as needed
};

// Plugin extension mechanism (for additional fields like SwitchField)
export const registerField = (type: string, component: ComponentType<any>) => {
  fieldComponents[type] = component;
};
export const unregisterField = (type: string) => {
  delete fieldComponents[type];
};

type ExtendedFormField = FormField & {
  showSkeletonLoading?: boolean;
  skeleton?: ReactNode;
};

// Default skeleton
const DefaultSkeleton = () => (
  <div>
    <Skeleton
      height={15}
      width={"25%"}
      style={{ opacity: 0.2, marginTop: "10px" }}
    />
    <Skeleton
      height={40}
      width={"100%"}
      style={{ opacity: 0.5, marginBottom: "15px" }}
    />
  </div>
);

// Generic DynamicFormField component
const DynamicFormField: FC<ExtendedFormField> = ({
  showSkeletonLoading = true,
  skeleton,
  ...props
}) => {
  const { shouldShowField } = useForm();
  if (!shouldShowField(props)) return null;

  // Get the corresponding field component dynamically
  const FieldComponent = fieldComponents[props.type];
  if (!FieldComponent) return null;

  return (
    <Suspense
      fallback={
        showSkeletonLoading && skeleton !== undefined ? (
          skeleton
        ) : showSkeletonLoading ? (
          <DefaultSkeleton />
        ) : null
      }
    >
      <FieldComponent {...props} />
    </Suspense>
  );
};

export default DynamicFormField;
