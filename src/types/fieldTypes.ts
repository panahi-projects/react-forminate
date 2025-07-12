import {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { dynamicOptionsType } from "./apiTypes";
import { CustomEventHandlers } from "./functionTypes";
import {
  ChildrenType,
  ColumnsType,
  ExtractFieldIds,
  FieldAsHTMLContainerTagType,
  FieldAutoCapitalizeType,
  FieldAutoCorrectType,
  FieldAutoFocusType,
  FieldCheckboxType,
  FieldClassNameType,
  FieldContainerType,
  FieldDatepickerType,
  FieldDefaultValueType,
  FieldDescriptionType,
  FieldDisabledType,
  FieldGridViewType,
  FieldGroupType,
  FieldIdType,
  FieldInputFileType,
  FieldInputType,
  FieldLabelType,
  FieldLayout,
  FieldPlaceholderType,
  FieldRadioType,
  FieldRequiredMessageType,
  FieldRequiredType,
  FieldSelectType,
  FieldSingleNegativeAnswerValue,
  FieldSinglePositiveAnswerValue,
  FieldSpacerType,
  FieldSpellCheckType,
  FieldStepType,
  FieldStyleType,
  FieldTextareaColsType,
  FieldTextareaRowsType,
  FieldTextareaType,
  FieldTypeType,
  FieldVisibilityType,
  FileAcceptType,
  FileFileTypesType,
  FileMaxSizeMBType,
  FileMinFilesType,
  FileMultipleType,
  FilePresignedUrlFnType,
  FilePreviewType,
  FileRenameFileType,
  FileStorageFormatType,
  FileStoreLocallyType,
  FileUploadHeadersType,
  FileUploadMethodType,
  FileUploadUrlType,
  GapType,
  HeightType,
  OptionsType,
  WidthType,
} from "./primitiveTypes";
import { ValidationRule } from "./validationsTypes";

export interface BaseField extends CustomEventHandlers {
  fieldId: FieldIdType; // Unique identifier for the field (e.g., "user.email")
  type: FieldTypeType; // Field type (e.g., "text", "select", "file")

  // Presentation
  label?: FieldLabelType; // Display text or dynamic label function
  description?: FieldDescriptionType; // Help text shown below field

  // Validation
  required?: FieldRequiredType; // Whether field is mandatory
  requiredMessage?: FieldRequiredMessageType; // Custom required error message
  validation?: ValidationRule[]; // Array of validation rules

  // Layout & Styling
  className?: FieldClassNameType; // CSS classes for input element
  containerClassName?: FieldClassNameType; // CSS classes for wrapper div
  styles?: FieldStyleType; // Inline styles for input element
  containerStyles?: FieldStyleType; // Inline styles for wrapper
  labelClassName?: FieldClassNameType; // CSS classes for label
  labelStyles?: FieldStyleType; // Inline styles for label

  // Behavior
  visibility?: FieldVisibilityType; // Conditional display rules
  disabled?: FieldDisabledType; // Disabled state (static or dynamic)

  // Advanced
  fields?: FormFieldType[]; // Child fields (for group/container types)
  _defaultValue?: FieldDefaultValueType; // Initial value (internal use)
}

export interface TextFieldType
  extends BaseField,
    Omit<InputHTMLAttributes<HTMLInputElement>, "required" | "disabled"> {
  type: FieldInputType;
  placeholder?: FieldPlaceholderType;
  autoCorrect?: FieldAutoCorrectType;
  autoCapitalize?: FieldAutoCapitalizeType;
  spellCheck?: FieldSpellCheckType;
  autoFocus?: FieldAutoFocusType;
  step?: FieldStepType;
}

export interface DateFieldType
  extends BaseField,
    Omit<InputHTMLAttributes<HTMLInputElement>, "required" | "disabled"> {
  type: FieldDatepickerType;
}

export interface SelectFieldType
  extends BaseField,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "required" | "disabled"> {
  type: FieldSelectType;
  options?: OptionsType[];
  dynamicOptions?: dynamicOptionsType;
  placeholder?: FieldPlaceholderType;
}

export interface RadioFieldType extends BaseField {
  type: FieldRadioType;
  options: OptionsType[];
  itemsClassName?: FieldClassNameType;
  itemsStyles?: FieldStyleType;
  layout?: FieldLayout;
}

export interface CheckboxFieldType
  extends BaseField,
    Omit<
      SelectHTMLAttributes<HTMLSelectElement>,
      "required" | "type" | "disabled"
    > {
  type: FieldCheckboxType;
  options?: OptionsType[];
  itemsClassName?: FieldClassNameType;
  itemsStyles?: FieldStyleType;
  singlePositiveAnswerValue?: FieldSinglePositiveAnswerValue;
  singleNegativeAnswerValue?: FieldSingleNegativeAnswerValue;
  layout?: FieldLayout;
}

export interface TextareaFieldType
  extends BaseField,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "required" | "disabled"> {
  type: FieldTextareaType;
  placeholder?: FieldPlaceholderType;
  rows?: FieldTextareaRowsType;
  cols?: FieldTextareaColsType;
  autoCorrect?: FieldAutoCorrectType;
  autoCapitalize?: FieldAutoCapitalizeType;
  spellCheck?: FieldSpellCheckType;
  autoFocus?: FieldAutoFocusType;
}

export interface GroupFieldType extends BaseField {
  type: FieldGroupType;
  as?: FieldAsHTMLContainerTagType | "fieldset";
  label: FieldLabelType;
  legendClassName?: FieldClassNameType;
  legendStyles?: FieldStyleType;
}

export interface GridViewFieldType extends BaseField {
  type: FieldGridViewType;
  required?: FieldRequiredType;
  dynamicOptions?: dynamicOptionsType;
  itemsClassName?: FieldClassNameType;
  itemsStyles?: FieldStyleType;
}

export interface SpacerFieldType extends BaseField {
  type: FieldSpacerType;
  as: FieldAsHTMLContainerTagType;
  width?: WidthType;
  height?: HeightType;
  children?: ChildrenType;
}

export interface InputFileType
  extends BaseField,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "required" | "disabled" | "accept"
    > {
  type: FieldInputFileType;
  accept?: FileAcceptType;
  multiple?: FileMultipleType;
  maxSizeMB?: FileMaxSizeMBType;
  minFiles?: FileMinFilesType;
  preview?: FilePreviewType;
  uploadUrl?: FileUploadUrlType;
  uploadHeaders?: FileUploadHeadersType;
  uploadMethod?: FileUploadMethodType;
  presignedUrlFn?: FilePresignedUrlFnType;
  fileTypes?: FileFileTypesType;
  renameFile?: FileRenameFileType;
  storeLocally?: FileStoreLocallyType;
  storageFormat?: FileStorageFormatType;
}

export interface BaseContainerField<T extends FormFieldType[]>
  extends Omit<BaseField, "fields"> {
  type: FieldContainerType;
  as: FieldAsHTMLContainerTagType;
  columns?: ColumnsType;
  gap?: GapType;
  fields: T;
  itemsStyles?: FieldStyleType;
  itemsClassName?: FieldClassNameType;
  children?: ChildrenType;
  header?: ChildrenType;
  footer?: ChildrenType;
  itemsParentAttributes?: {
    [K in ExtractFieldIds<T>]?: HTMLAttributes<HTMLElement> & {
      colSpan?: number;
      [key: string]: any;
    };
  };
}

export type ContainerFieldType = BaseContainerField<FormFieldType[]>;

export type FormFieldType =
  | BaseField
  | TextFieldType
  | DateFieldType
  | SelectFieldType
  | RadioFieldType
  | CheckboxFieldType
  | GroupFieldType
  | GridViewFieldType
  | ContainerFieldType
  | TextareaFieldType
  | SpacerFieldType
  | InputFileType;
