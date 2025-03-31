export const findFieldById = (fieldId: string, fields: any[]): any | null => {
  for (const field of fields) {
    if (field.id === fieldId) return field;
    if (field.type === "group" && field.fields) {
      const found = findFieldById(fieldId, field.fields);
      if (found) return found;
    }
  }
  return null;
};

export const getInitialDependencies = (
  fields: any[]
): Record<string, string> => {
  const dependencies: Record<string, string> = {};

  const traverseFields = (fields: any[]) => {
    if (!fields || fields.length === 0) return;
    fields.forEach((field) => {
      if (field.dynamicOptions?.dependsOn) {
        dependencies[field.id] = field.dynamicOptions.dependsOn;
      }
      if (field.type === "group" && field.fields) {
        traverseFields(field.fields);
      }
    });
  };

  traverseFields(fields);
  return dependencies;
};
