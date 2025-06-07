import { convertLegacyFieldToNew } from ".";
import {
  ComputedValue,
  FieldPropContext,
  FieldPropFunction,
  FormFieldType,
  ProcessedFieldProps,
} from "../types";

export class PropertyProcessor {
  static process<T>(prop: T | ComputedValue<T>, context: FieldPropContext): T {
    try {
      const fieldProp: T | ComputedValue<T> =
        (convertLegacyFieldToNew(prop as FieldPropFunction<unknown>) as
          | T
          | ComputedValue<T>) || prop;
      if (this.isComputedValue(fieldProp)) {
        return fieldProp.fn(context);
      }
      return fieldProp as T;
    } catch (err) {
      if (this.isComputedValue(prop)) {
        return prop.fn(context);
      }
      return prop as T;
    }
  }

  private static isComputedValue<T>(value: any): value is ComputedValue<T> {
    return value && typeof value === "object" && "fn" in value;
  }

  static processFieldProps(
    field: FormFieldType,
    context: FieldPropContext
  ): ProcessedFieldProps<FormFieldType> {
    const processed: any = {};

    for (const [key, value] of Object.entries(field)) {
      if (this.isProcessableProperty(key)) {
        processed[key] = this.process(value, context);
      } else {
        processed[key] = value;
      }
    }

    return processed as ProcessedFieldProps<FormFieldType>;
  }

  private static isProcessableProperty(key: string): boolean {
    const processableProps = [
      "label",
      "required",
      "disabled",
      "visibility",
      "className",
      "options",
      "placeholder",
      "validation",
      "requiredMessage",
    ];
    return processableProps.includes(key);
  }
}
