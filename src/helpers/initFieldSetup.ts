import { FieldTypeType } from "@/types";
import { getValidJSXProps } from "@/utils";

type DefaultFieldPropsType = Record<
  string,
  {
    "data-testid": string;
    excludedProps: string[];
    htmlTagName?: string;
  }
>;

const excludedFieldProps = ["required", "options", "labelClassName"];
const baseFieldConfig = (tagName: string = "input", type: string = "text") => {
  return {
    "data-testid": `${tagName}-${type}-field`,
    excludedProps: [...excludedFieldProps],
    htmlTagName: tagName,
  };
};

const defaultFieldsSetupByType: DefaultFieldPropsType = {
  text: { ...baseFieldConfig("input", "text") },
  email: { ...baseFieldConfig("input", "email") },
  password: { ...baseFieldConfig("input", "password") },
  number: { ...baseFieldConfig("input", "number") },
  tel: { ...baseFieldConfig("input", "tel") },
  url: { ...baseFieldConfig("input", "url") },
  search: { ...baseFieldConfig("input", "search") },
  radio: { ...baseFieldConfig("input", "radio") },
  checkbox: { ...baseFieldConfig("input", "checkbox") },
  select: { ...baseFieldConfig("select", "select") },
  file: { ...baseFieldConfig("input", "file") },
};

export const initFieldSetup = (
  fieldType: FieldTypeType,
  props: Record<string, any>,
  isTouched?: boolean,
  hasError?: boolean
): Partial<Record<string, any>> => {
  const fieldConfig =
    defaultFieldsSetupByType[fieldType] || defaultFieldsSetupByType.text;
  if (fieldConfig.htmlTagName) {
    return {
      ...getValidJSXProps(
        fieldConfig.htmlTagName as keyof HTMLElementTagNameMap,
        props,
        fieldConfig.excludedProps
      ),
      id: props.fieldId || props.id || "",
      "data-testid": fieldConfig["data-testid"],
      "data-touched": isTouched,
      "data-error": hasError,
    };
  }
  return {};
};
