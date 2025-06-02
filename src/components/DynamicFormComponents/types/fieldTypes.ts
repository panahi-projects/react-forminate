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
  FieldDisabledType,
  FieldGridViewType,
  FieldGroupType,
  FieldIdType,
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
}

export interface TextFieldType
  extends BaseField,
    Omit<InputHTMLAttributes<HTMLInputElement>, "required"> {
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
    Omit<InputHTMLAttributes<HTMLInputElement>, "required"> {
  type: FieldDatepickerType;
}

export interface SelectFieldType
  extends BaseField,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "required"> {
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
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "required" | "type"> {
  type: FieldCheckboxType;
  options: OptionsType[];
  itemsClassName: FieldClassNameType;
  itemsStyles: FieldStyleType;
}

export interface TextareaFieldType
  extends BaseField,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "required"> {
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
  as?: FieldAsHTMLContainerTagType;
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
  | SpacerFieldType;
