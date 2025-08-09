import {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { dynamicOptionsType } from "./apiTypes";
import { CustomEventHandlers } from "./functionTypes";
import {
  BaseFieldParams,
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
  FieldContentType,
  FieldDatepickerType,
  FieldDefaultValueType,
  FieldDescriptionType,
  FieldDisableDefaultStyling,
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
  FunctionalChildrenType,
  GapType,
  HeightType,
  OptionsType,
  WidthType,
} from "./primitiveTypes";
import { ValidationRule } from "./validationsTypes";

export type FieldValueType =
  | string
  | number
  | boolean
  | readonly string[]
  | File
  | null
  | undefined;

export type SelectValueType = string | number | readonly string[] | undefined;
export type FileValueType =
  | File
  | File[]
  | FileList
  | string
  | string[]
  | ArrayBuffer
  | { [key: string]: any }
  | null;

export type FieldTypes =
  | FieldInputType
  | "select"
  | "checkbox"
  | "radio"
  | "container"
  | "group"
  | "date"
  | "gridview"
  | "file"
  | "spacer"
  | "textarea"
  | "content"
  | string;

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
  style?: FieldStyleType; // Inline styles for input element
  styles?: FieldStyleType; // Inline styles for input element
  containerStyles?: FieldStyleType; // Inline styles for wrapper
  labelClassName?: FieldClassNameType; // CSS classes for label
  labelStyles?: FieldStyleType; // Inline styles for label
  disableDefaultStyling?: FieldDisableDefaultStyling;

  // Behavior
  visibility?: FieldVisibilityType; // Conditional display rules
  disabled?: FieldDisabledType; // Disabled state (static or dynamic)

  // Advanced
  fields?: FormFieldType[]; // Child fields (for group/container types)
  _defaultValue?: FieldDefaultValueType; // Initial value (internal use)
  params?: BaseFieldParams;

  // Accessibility additions
  ariaLabel?: string; // Alternative to visible label
  ariaLabelledby?: string; // ID reference for labeling element
  ariaDescribedby?: string; // ID reference for description
  ariaInvalid?: boolean | "true" | "false" | "grammar" | "spelling";
  ariaRequired?: boolean | "true" | "false";
  ariaDisabled?: boolean | "true" | "false";
  ariaHidden?: boolean | "true" | "false";
  ariaLive?: "off" | "assertive" | "polite";
  role?: string; // For custom widget roles
}

export type ExcludingAttributes = "required" | "disabled" | "value" | "role";

export interface TextFieldType
  extends BaseField,
    Omit<InputHTMLAttributes<HTMLInputElement>, ExcludingAttributes> {
  type: FieldInputType;
  placeholder?: FieldPlaceholderType;
  autoCorrect?: FieldAutoCorrectType;
  autoCapitalize?: FieldAutoCapitalizeType;
  spellCheck?: FieldSpellCheckType;
  autoFocus?: FieldAutoFocusType;
  step?: FieldStepType;
  value?: FieldValueType;
}

export interface DateFieldType
  extends BaseField,
    Omit<InputHTMLAttributes<HTMLInputElement>, ExcludingAttributes> {
  type: FieldDatepickerType;
}

export interface SelectFieldType
  extends BaseField,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, ExcludingAttributes> {
  type: FieldSelectType;
  options?: OptionsType[];
  dynamicOptions?: dynamicOptionsType;
  placeholder?: FieldPlaceholderType;
  value?: SelectValueType; // Add explicit value type
  validateOnChange?: boolean;
}

export interface MultiSelectFieldType extends SelectFieldType {
  debounceSearch?: number;
  showClearAll?: boolean;
}

export interface RadioFieldType extends BaseField {
  type: FieldRadioType;
  options: OptionsType[];
  itemsClassName?: FieldClassNameType;
  innerItemsClassName?: FieldClassNameType;
  itemsStyles?: FieldStyleType;
  innerItemsStyles?: FieldStyleType;
  layout?: FieldLayout;
}

export interface CheckboxFieldType
  extends BaseField,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, ExcludingAttributes> {
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
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, ExcludingAttributes> {
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
  styles?: FieldStyleType;
}

export interface GridViewFieldType extends BaseField {
  type: FieldGridViewType;
  required?: FieldRequiredType;
  dynamicOptions?: dynamicOptionsType;
  itemsClassName?: FieldClassNameType;
  itemsStyles?: FieldStyleType;
  styles?: FieldStyleType;
}

export interface SpacerFieldType extends BaseField {
  type: FieldSpacerType;
  as: FieldAsHTMLContainerTagType;
  width?: WidthType;
  height?: HeightType;
  children?: ChildrenType;
}

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  [key: string]: any; // Allow additional custom metadata
}

export type FileValue =
  | File // Native File object
  | FileList // Native FileList
  | string // Base64, blob URL, or remote URL
  | ArrayBuffer // Binary data
  | FileMetadata // Custom metadata object
  | File[] // Array of File objects
  | string[] // Array of URLs/base64 strings
  | ArrayBuffer[] // Array of ArrayBuffers
  | FileMetadata[] // Array of metadata objects
  | null;

export interface InputFileType
  extends BaseField,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      | ExcludingAttributes
      | "value"
      | "accept"
      | "onUpload"
      | "onRemove"
      | "onError"
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
  value?: FileValueType;
  onUpload?: (files: FileValue[], fieldId: string) => void;
  onRemove?: (file: FileValue, fieldId: string) => void;
  onError?: (error: Error, file: File) => void;
}

export type ProcessedFileValue<T extends FileStorageFormatType> =
  T extends "file"
    ? File
    : T extends "fileList"
      ? FileList
      : T extends "base64"
        ? string
        : T extends "blobUrl"
          ? string
          : T extends "arrayBuffer"
            ? ArrayBuffer
            : T extends "remoteUrl"
              ? string
              : T extends "metadata"
                ? FileMetadata
                : never;

export interface BaseContainerField<T extends FormFieldType[]>
  extends Omit<BaseField, "fields"> {
  type: FieldContainerType;
  as: FieldAsHTMLContainerTagType;
  columns?: ColumnsType;
  gap?: GapType;
  fields: T;
  styles?: FieldStyleType;
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

export interface ContentFieldType extends BaseField {
  type: FieldContentType;
  as?: React.ElementType;
  content?: FunctionalChildrenType;
}

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
  | InputFileType
  | ContentFieldType
  | MultiSelectFieldType;
