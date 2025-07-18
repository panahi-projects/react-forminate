import { useField } from "@/hooks";
import {
  FieldTypes,
  FormErrorsType,
  FormFieldType,
  TFieldLabel,
  TFieldRequired,
} from "@/types";
import {
  ComponentType,
  FC,
  JSX,
  lazy,
  ReactNode,
  Suspense,
  useEffect,
  useState,
} from "react";
import { FieldWrapper } from "../FieldWrapper";
import {
  CheckboxSkeleton,
  DefaultSkeleton,
  FileInputSkeleton,
  GroupSkeleton,
  InputSkeleton,
  RadioSkeleton,
  SelectSkeleton,
  TextareaSkeleton,
} from "../ui";

// Mapping of field types to their respective components
const fieldComponents: Record<string, ComponentType<any>> = {
  group: lazy(() => import("../Fields/GroupField")),
  text: lazy(() => import("../Fields/InputField")),
  number: lazy(() => import("../Fields/InputField")),
  email: lazy(() => import("../Fields/InputField")),
  tel: lazy(() => import("../Fields/InputField")),
  url: lazy(() => import("../Fields/InputField")),
  password: lazy(() => import("../Fields/InputField")),
  search: lazy(() => import("../Fields/InputField")),
  date: lazy(() => import("../Fields/DatePickerField")),
  select: lazy(() => import("../Fields/SelectField")),
  radio: lazy(() => import("../Fields/RadioField")),
  checkbox: lazy(() => import("../Fields/CheckboxField")),
  gridview: lazy(() => import("../Fields/GridViewField")),
  container: lazy(() => import("../Fields/ContainerField")),
  textarea: lazy(() => import("../Fields/TextareaField")),
  spacer: lazy(() => import("../Fields/SpacerField")),
  file: lazy(() => import("../Fields/InputFileField")),
  // Add other fields here as needed
};

// Plugin extension mechanism (for additional fields like SwitchField)
export const registerField = (type: string, component: ComponentType<any>) => {
  fieldComponents[type] = component;
};
export const unregisterField = (type: string) => {
  delete fieldComponents[type];
};

type ExtendedFormField = FormFieldType & {
  showSkeletonLoading?: boolean;
  skeleton?: ReactNode;
};

const skeletonComponents: Record<FieldTypes, () => JSX.Element> = {
  text: InputSkeleton,
  email: InputSkeleton,
  select: SelectSkeleton,
  checkbox: CheckboxSkeleton,
  group: GroupSkeleton,
  radio: RadioSkeleton,
  file: FileInputSkeleton,
  textarea: TextareaSkeleton,
  // Add mappings for all your field types
};

// Generic DynamicFormField component
const DynamicFormField: FC<ExtendedFormField> = ({
  showSkeletonLoading = true,
  skeleton,
  ...props
}) => {
  const { processedProps, errors, isVisible } = useField(props);
  const [fieldErrors, setFieldErrors] = useState<FormErrorsType>();
  const [showComponent, setShowComponent] = useState<boolean>(true);

  useEffect(() => {
    setFieldErrors(errors);
    setShowComponent(isVisible);
  }, [isVisible, errors]);

  // Get the corresponding field component dynamically
  const FieldComponent = fieldComponents[props.type];
  if (!FieldComponent || !showComponent) return null;

  const SkeletonComponent = skeletonComponents[props.type] || DefaultSkeleton;

  return (
    <Suspense
      fallback={showSkeletonLoading ? skeleton || <SkeletonComponent /> : null}
    >
      <FieldWrapper
        id={processedProps.fieldId}
        label={processedProps.label as TFieldLabel}
        required={processedProps.required as TFieldRequired}
        error={fieldErrors?.[processedProps.fieldId]}
        className={processedProps.containerClassName}
        styles={processedProps.containerStyles}
        labelClassName={processedProps.labelClassName}
        labelStyles={processedProps.labelStyles}
        type={processedProps.type}
        description={processedProps.description}
      >
        <FieldComponent {...processedProps} />
      </FieldWrapper>
    </Suspense>
  );
};

export default DynamicFormField;
