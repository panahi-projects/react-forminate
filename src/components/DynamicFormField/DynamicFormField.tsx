import { useDynamicField } from "@/hooks";
import {
  CheckboxFieldType,
  FormFieldType,
  RadioFieldType,
  TFieldDisabled,
  TFieldLabel,
  TFieldRequired,
} from "@/types";
import React, {
  ComponentType,
  FC,
  lazy,
  ReactNode,
  Suspense,
  useEffect,
  useState,
} from "react";
import { FieldWrapper } from "../FieldWrapper";
import { SkeletonComponent } from "../ui";
import { SkeletonComponentType } from "../ui/SkeletonComponent";

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
  multiSelect: lazy(() => import("../Fields/MultiSelectField")),
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
  onLoadComplete?: () => void;
};

// Generic DynamicFormField component
const DynamicFormField: FC<ExtendedFormField> = React.memo(
  ({ showSkeletonLoading = true, skeleton, onLoadComplete, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { processedProps, fieldErrors, isVisible } = useDynamicField(props);

    const FieldComponent = fieldComponents[props.type];
    if (!FieldComponent || !isVisible) return null;

    useEffect(() => {
      if (isLoaded && onLoadComplete) {
        onLoadComplete();
      }
    }, [isLoaded, onLoadComplete]);

    return (
      <Suspense
        fallback={
          showSkeletonLoading
            ? skeleton || (
                <SkeletonComponent
                  type={props.type as SkeletonComponentType}
                  itemsCount={
                    props.type === "checkbox" || props.type === "radio"
                      ? (props as RadioFieldType | CheckboxFieldType)?.options
                          ?.length
                      : 1
                  }
                  layout={
                    props.type === "checkbox" || props.type === "radio"
                      ? (props as RadioFieldType | CheckboxFieldType)?.layout
                      : "column"
                  }
                />
              )
            : null
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
          errorClassName={processedProps.errorClassName}
          errorStyles={processedProps.errorStyles}
          descriptionClassName={processedProps.descriptionClassName}
          descriptionStyles={processedProps.descriptionStyles}
          errorComponent={processedProps.errorComponent}
          descriptionComponent={processedProps.descriptionComponent}
        >
          <FieldComponent {...processedProps} ref={() => setIsLoaded(true)} />
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
