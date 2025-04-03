import React, { FC } from "react";
import CheckboxField from "../CheckboxField";
import { FormProvider } from "../../../providers/FormProvider";
import { CheckboxField as CheckboxFieldType } from "../../../types";

const checkboxParams: CheckboxFieldType = {
  id: "exampleCheckbox",
  label: "Example Checkbox",
  type: "checkbox",
  options: ["Option 1", "Option 2", "Option 3"],
};
const Example: FC<CheckboxFieldType> = (
  fieldParams = { ...checkboxParams }
) => {
  return (
    <FormProvider
      formSchema={{
        formId: "sampleFormIdForCheckboxField",
        title: "Sample Form For Checkbox Field",
        fields: [{ ...fieldParams }],
      }}
    >
      <CheckboxField {...fieldParams} />
    </FormProvider>
  );
};

export default Example;
