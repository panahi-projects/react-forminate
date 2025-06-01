import { getValidJSXProps } from ".";
import { FieldTypeType } from "../types";

type DefaultFieldPropsType = Record<
  string,
  {
    "data-testid": string;
    excludedProps: string[];
    htmlTagName?: string;
  }
>;

const excludedFieldProps = ["required"];
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
};

export const initFieldSetup = (
  fieldType: FieldTypeType,
  props: Record<string, any>
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
      "data-testid": fieldConfig["data-testid"],
      id: props.fieldId || props.id || "",
    };
  }
  return {};
};
