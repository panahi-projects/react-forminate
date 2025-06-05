import { flattenSchema } from ".";
import {
  DependencyMap,
  DependencyMapTuple,
  FieldIdType,
  FormFieldType,
} from "../types";

export const buildDependencyMap = (
  fields: FormFieldType[],
  excludedProps: string[] = ["fieldId", "type", "fields"]
): DependencyMap => {
  const dependencyMap: DependencyMap = {};

  const traverseFields = (fields: FormFieldType[]) => {
    fields.forEach((field) => {
      dependencyMap[field.fieldId] = new Set();

      Object.entries(field).forEach(([propName, propValue]) => {
        if (excludedProps.includes(propName)) return;

        // Handle both new { dependsOn, fn } and legacy function formats
        if (
          propValue &&
          typeof propValue === "object" &&
          "fn" in propValue &&
          typeof propValue.fn === "function"
        ) {
          if ("dependsOn" in propValue && Array.isArray(propValue.dependsOn)) {
            // New format
            if (propValue.dependsOn.length > 0) {
              propValue.dependsOn?.forEach((dep: FieldIdType) => {
                dependencyMap[field.fieldId].add(dep);
              });
            } else if (propValue.dependsOn.length === 0) {
              const { fieldIds } = flattenSchema(fields);
              // If dependsOn is empty, add all fieldIds as dependencies
              fieldIds.forEach((dep: FieldIdType) => {
                dependencyMap[field.fieldId].add(dep);
              });
            }
          } else {
            dependencyMap[field.fieldId].add("_ALL_FIELDS_");
          }
        } else if (typeof propValue === "function") {
          // Legacy format - enhanced detection
          const funcStr = propValue.toString();

          // Detect both values.xxx and formValues.xxx and values?.xxx patterns
          const matches = funcStr.match(
            /(values|formValues|values\?)\.([a-zA-Z0-9_]+)/g
          );
          if (matches) {
            matches.forEach((match: string) => {
              const dep: FieldIdType = match.split(".")[1]; // Extract the field name
              dependencyMap[field.fieldId].add(dep);
            });
          }
        }
      });

      if (field.fields?.length) traverseFields(field.fields);
    });
  };

  traverseFields(fields);

  return dependencyMap;
};
