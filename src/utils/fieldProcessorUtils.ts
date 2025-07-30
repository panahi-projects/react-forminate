import { PropertyProcessor } from "@/helpers";
import {
  FieldPropFunction,
  FormDataCollectionType,
  FormFieldType,
  ProcessedFieldProps,
  SupportedTypes,
} from "@/types";
import { convertLegacyFieldToNew, customStringify } from "@/utils";

export class FieldProcessor {
  private static instance: FieldProcessor;
  private cache: Map<string, ProcessedFieldProps<any>> = new Map();

  private constructor() {}

  public static getInstance(): FieldProcessor {
    if (!FieldProcessor.instance) {
      FieldProcessor.instance = new FieldProcessor();
    }
    return FieldProcessor.instance;
  }

  public process<T extends FormFieldType>(
    field: T,
    values: Record<string, SupportedTypes>,
    formSchema: FormDataCollectionType
  ): ProcessedFieldProps<T> {
    const cacheKey = this.getCacheKey(field, values);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const processed = this.processField(field, values, formSchema);
    this.cache.set(cacheKey, processed);
    return processed;
  }

  public processAllFields(
    fields: FormFieldType[],
    values: Record<string, SupportedTypes>,
    formSchema: FormDataCollectionType
  ): ProcessedFieldProps<FormFieldType>[] {
    return fields.map((field) => this.process(field, values, formSchema));
  }

  public processField<T extends FormFieldType>(
    field: T,
    values: Record<string, SupportedTypes>,
    formSchema: FormDataCollectionType
  ): ProcessedFieldProps<T> {
    const context = {
      fieldId: field.fieldId,
      values,
      fieldSchema: field,
      formSchema,
    };

    // Process top-level properties
    const processed = PropertyProcessor.processFieldProps(field, context);

    // Process nested fields recursively
    if (field.fields && field.fields.length > 0) {
      processed.fields = field.fields.map((nestedField) =>
        this.processField(nestedField, values, formSchema)
      ) as typeof processed.fields;
    }

    return processed as ProcessedFieldProps<T>;
  }

  private getCacheKey(
    field: FormFieldType,
    values: Record<string, SupportedTypes>
  ): string {
    // Create a key based on field ID and relevant dependent values
    const dependencyKeys = this.getFieldDependencies(field);
    const valueHash = dependencyKeys
      .map((key) => `${key}:${JSON.stringify(values[key])}`)
      .join("|");

    return `${field.fieldId}|${valueHash}|${customStringify(field)}`;
  }

  public getFieldDependencies(field: FormFieldType): string[] {
    // Extract all dependencies from computed properties
    const dependencies = new Set<string>();

    // Check all possible computed properties
    const computedProps = [
      "label",
      "required",
      "disabled",
      "visibility",
      "options",
      "requiredMessage",
      "content",
    ];
    computedProps.forEach((prop) => {
      const fieldProp = field[prop as keyof FormFieldType];
      const propValue = convertLegacyFieldToNew(
        fieldProp as FieldPropFunction<unknown>
      );
      if (
        propValue &&
        typeof propValue === "object" &&
        "dependsOn" in propValue &&
        Array.isArray((propValue as any).dependsOn)
      ) {
        (propValue as { dependsOn: string[] }).dependsOn.forEach(
          (dep: string) => dependencies.add(dep)
        );
      }
    });

    // Add visibility dependencies if they exist
    if (
      typeof field.visibility === "object" &&
      "dependsOn" in field.visibility &&
      field.visibility.dependsOn
    ) {
      if (Array.isArray(field.visibility.dependsOn)) {
        if (field.visibility.dependsOn.length) {
          field.visibility.dependsOn.forEach((dep) => {
            dependencies.add(dep);
          });
        } else {
          dependencies.add(field.fieldId);
        }
      } else {
        dependencies.add(field.fieldId);
      }
    }

    return Array.from(dependencies);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public clearCacheForField(fieldId: string): void {
    Array.from(this.cache.keys())
      .filter((key) => key.startsWith(`${fieldId}|`))
      .forEach((key) => this.cache.delete(key));
  }
}
