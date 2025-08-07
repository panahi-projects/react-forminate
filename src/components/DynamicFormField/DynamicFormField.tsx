import { useDynamicField } from "@/hooks";
import {
  FormFieldType,
  TFieldDisabled,
  TFieldLabel,
  TFieldRequired,
} from "@/types";
import React, { ComponentType, FC, lazy, ReactNode, Suspense } from "react";
import { FieldWrapper } from "../FieldWrapper";
import { SkeletonComponent } from "../ui";

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
  content: lazy(() => import("../Fields/ContentField")), //can contain any kind of HTML or JSX content
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

// Generic DynamicFormField component
const DynamicFormField: FC<ExtendedFormField> = React.memo(
  ({ showSkeletonLoading = true, skeleton, ...props }) => {
    const { processedProps, fieldErrors, isVisible } = useDynamicField(props);

    // Get the corresponding field component dynamically
    const FieldComponent = fieldComponents[props.type];
    if (!FieldComponent || !isVisible) return null;

    return (
      <Suspense
        fallback={
          showSkeletonLoading ? skeleton || <SkeletonComponent /> : null
        }
      >
        <FieldWrapper
          id={processedProps.fieldId}
          label={processedProps.label as TFieldLabel}
          required={processedProps.required as TFieldRequired}
          error={fieldErrors}
          className={processedProps.containerClassName}
          styles={processedProps.containerStyles}
          labelClassName={processedProps.labelClassName}
          labelStyles={processedProps.labelStyles}
          type={processedProps.type}
          description={processedProps.description}
          ariaDescribedby={
            processedProps.ariaDescribedby || processedProps.description
          }
          ariaDisabled={
            processedProps.ariaDisabled ||
            (processedProps.disabled as TFieldDisabled)
          }
          ariaLabel={
            processedProps.ariaLabel || (processedProps.label as TFieldLabel)
          }
        >
          <FieldComponent {...processedProps} />
        </FieldWrapper>
      </Suspense>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.fieldId === nextProps.fieldId &&
      prevProps.type === nextProps.type &&
      prevProps.label === nextProps.label &&
      prevProps.required === nextProps.required &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.showSkeletonLoading === nextProps.showSkeletonLoading
    );
  }
);

DynamicFormField.displayName = "DynamicFormField";
export default DynamicFormField;
