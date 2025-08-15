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

const DynamicFormField: FC<ExtendedFormField> = React.memo(
  ({ showSkeletonLoading = true, skeleton, onLoadComplete, ...props }) => {
    const { processedProps, fieldErrors, isVisible } = useDynamicField(props);
    const hasNotifiedLoaded = useRef(false);
    const FieldComponent = fieldComponents[props.type];

    useEffect(() => {
      // Cleanup function to reset the loaded state if component unmounts
      return () => {
        hasNotifiedLoaded.current = false;
      };
    }, []);

    if (!FieldComponent || !isVisible) {
      // If field is not visible, consider it loaded immediately
      if (onLoadComplete && !hasNotifiedLoaded.current) {
        onLoadComplete(processedProps.fieldId);
        hasNotifiedLoaded.current = true;
      }
      return null;
    }

    const handleLoad = () => {
      if (onLoadComplete && !hasNotifiedLoaded.current) {
        onLoadComplete(processedProps.fieldId);
        hasNotifiedLoaded.current = true;
      }
    };

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
          <FieldComponent {...processedProps} ref={handleLoad} />
        </FieldWrapper>
      </Suspense>
    );
  },
  (prevProps, nextProps) => {
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
