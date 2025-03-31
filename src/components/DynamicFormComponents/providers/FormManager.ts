const formRegistry = new Map<string, any>();

export const getFormInstance = (formId: string) => {
  return formRegistry.get(formId);
};

export const createFormInstance = (formId: string, instance: any) => {
  if (!formRegistry.has(formId)) {
    formRegistry.set(formId, instance);
  }
  return getFormInstance(formId);
};

export const removeFormInstance = (formId: string) => {
  formRegistry.delete(formId);
};
