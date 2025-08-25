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
  useRef,
  useCallback,
  useMemo,
  forwardRef,
} from "react";
import { FieldWrapper } from "../FieldWrapper";
import { SkeletonComponent } from "../ui";
import { SkeletonComponentType } from "../ui/SkeletonComponent";

// Field component registry with lazy loading
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
  content: lazy(() => import("../Fields/ContentField")),
  multiSelect: lazy(() => import("../Fields/MultiSelectField")),
};

// Plugin extension mechanism
export const registerField = (type: string, component: ComponentType<any>) => {
  fieldComponents[type] = component;
};

export const unregisterField = (type: string) => {
  delete fieldComponents[type];
};

type ExtendedFormField = FormFieldType & {
  showSkeletonLoading?: boolean;
  skeleton?: ReactNode;
  onLoadComplete?: (fieldId: string) => void;
};

// Create a wrapper component that can forward refs
const FieldComponentWithRef = forwardRef<any, any>((props, ref) => {
  const FieldComponent = fieldComponents[props.type];
  return <FieldComponent {...props} ref={ref} />;
});

FieldComponentWithRef.displayName = "FieldComponentWithRef";

/**
 * DynamicFormField component that renders form fields based on their type
 * with optimized rendering and lazy loading capabilities
 */
const DynamicFormField: FC<ExtendedFormField> = React.memo(
  ({ showSkeletonLoading = true, skeleton, onLoadComplete, ...props }) => {
    const { processedProps, fieldErrors, isVisible } = useDynamicField(props);
    const hasNotifiedLoaded = useRef(false);
    const FieldComponent = fieldComponents[props.type];

    // Memoize the load complete handler to prevent unnecessary re-renders
    const handleLoadComplete = useCallback(() => {
      if (onLoadComplete && !hasNotifiedLoaded.current) {
        onLoadComplete(processedProps.fieldId);
        hasNotifiedLoaded.current = true;
      }
    }, [onLoadComplete, processedProps.fieldId]);

    // Reset loaded state when component unmounts
    useEffect(() => {
      return () => {
        hasNotifiedLoaded.current = false;
      };
    }, []);

    // Notify when component is not visible or doesn't exist
    useEffect(() => {
      if (
        (!FieldComponent || !isVisible) &&
        onLoadComplete &&
        !hasNotifiedLoaded.current
      ) {
        onLoadComplete(processedProps.fieldId);
        hasNotifiedLoaded.current = true;
      }
    }, [FieldComponent, isVisible, onLoadComplete, processedProps.fieldId]);

    // Memoize the skeleton component to prevent recreation on every render
    const skeletonFallback = useMemo(() => {
      if (!showSkeletonLoading) return null;

      if (skeleton) return skeleton;

      // Handle special cases for checkbox and radio fields
      if (props.type === "checkbox" || props.type === "radio") {
        const fieldProps = props as RadioFieldType | CheckboxFieldType;
        return (
          <SkeletonComponent
            type={props.type as SkeletonComponentType}
            itemsCount={fieldProps?.options?.length || 1}
            layout={fieldProps?.layout || "column"}
          />
        );
      }

      // Default skeleton for other field types
      return <SkeletonComponent type={props.type as SkeletonComponentType} />;
    }, [
      showSkeletonLoading,
      skeleton,
      props.type,
      (props as RadioFieldType | CheckboxFieldType)?.options?.length,
      (props as RadioFieldType | CheckboxFieldType)?.layout,
    ]);

    // Don't render if component doesn't exist or isn't visible
    if (!FieldComponent || !isVisible) {
      return null;
    }

    return (
      <Suspense fallback={skeletonFallback}>
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
          gridColumn={processedProps.gridColumn}
          gridRow={processedProps.gridRow}
        >
          <FieldComponentWithRef {...processedProps} ref={handleLoadComplete} />
        </FieldWrapper>
      </Suspense>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    // Compare only the essential props that affect rendering
    return (
      prevProps.fieldId === nextProps.fieldId &&
      prevProps.type === nextProps.type &&
      prevProps.label === nextProps.label &&
      prevProps.required === nextProps.required &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.showSkeletonLoading === nextProps.showSkeletonLoading &&
      prevProps.skeleton === nextProps.skeleton
    );
  }
);

DynamicFormField.displayName = "DynamicFormField";
export default DynamicFormField;
