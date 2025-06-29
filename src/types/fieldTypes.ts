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
  FieldPlaceholderType,
  FieldRadioType,
  FieldRequiredMessageType,
  FieldRequiredType,
  FieldSelectType,
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
  fieldId: FieldIdType;
  type: FieldTypeType;
  label?: FieldLabelType;
  required?: FieldRequiredType;
  requiredMessage?: FieldRequiredMessageType;
  visibility?: FieldVisibilityType;
  fields?: FormFieldType[];
  className?: FieldClassNameType;
  containerClassName?: FieldClassNameType;
  styles?: FieldStyleType;
  containerStyles?: FieldStyleType;
  labelClassName?: FieldClassNameType;
  labelStyles?: FieldStyleType;
  validation?: ValidationRule[];
  disabled?: FieldDisabledType;
  _defaultValue?: FieldDefaultValueType;
  description?: FieldDescriptionType;
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
  itemsClassName: FieldClassNameType;
  itemsStyles: FieldStyleType;
}

export interface CheckboxFieldType
  extends BaseField,
    Omit<
      SelectHTMLAttributes<HTMLSelectElement>,
      "required" | "type" | "disabled"
    > {
  type: FieldCheckboxType;
  options: OptionsType[];
  itemsClassName: FieldClassNameType;
  itemsStyles: FieldStyleType;
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
