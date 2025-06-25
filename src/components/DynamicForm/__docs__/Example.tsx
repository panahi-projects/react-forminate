import React, { FC } from "react";
import DynamicForm from "../DynamicForm";
import { DynamicFormProps } from "../../types";

const Example: FC<DynamicFormProps> = ({
  formId = "example-form",
  formData = {
    formId: "example-form",
    title: "Example Form",
    fields: [
      {
        fieldId: "exampleField",
        label: "Example Field",
        type: "text",
        required: true,
      },
    ],
  },
  onSubmit = (data) => console.log("Form submitted with data:", data),
  isLoading = false,
  submitDetails = {
    text: "Submit",
  },
}) => {
  return (
    <DynamicForm
      formId={formId}
      formData={formData}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitDetails={submitDetails}
    />
  );
};

export default Example;
