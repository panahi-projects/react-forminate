import React, { FC } from "react";
import { FormProvider } from "../../providers/FormProvider";
import { FormField } from "../../types";
import DynamicFormField from "../DynamicFormField";

const fieldData: FormField = {
  id: "exampleField",
  label: "Example Field",
  type: "text",
  placeholder: "Enter text here",
};
const Example: FC<FormField> = (field = fieldData) => {
  return (
    <FormProvider
      formSchema={{ formId: "example", title: "example", fields: [field] }}
    >
      <DynamicFormField {...field} />
    </FormProvider>
  );
};

export default Example;
