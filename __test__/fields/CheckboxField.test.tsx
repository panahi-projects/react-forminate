import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { FormProvider } from "../../src/context";
import { DynamicFormField } from "../../src/components/DynamicFormField";
import { FormDataCollectionType, FormFieldType } from "../../src";

// The original test imported a removed `DynamicFormComponents/Fields` path and
// rendered against the legacy single-context model. CheckboxField now reads its
// value through the split contexts via `useField`, so it must be rendered
// inside a real FormProvider.
const field: FormFieldType = {
  fieldId: "choices",
  type: "checkbox",
  label: "Choices",
  options: ["Option 1", "Option 2"],
};

const schema: FormDataCollectionType = {
  formId: "checkbox-form",
  fields: [field],
};

const renderCheckbox = () =>
  render(
    <FormProvider formSchema={schema}>
      <DynamicFormField {...field} />
    </FormProvider>
  );

describe("CheckboxField", () => {
  it("renders every option", async () => {
    renderCheckbox();

    await waitFor(() =>
      expect(screen.getByLabelText(/Option 1/i)).toBeInTheDocument()
    );
    expect(screen.getByLabelText(/Option 2/i)).toBeInTheDocument();
  });

  it("checks an option when it is clicked", async () => {
    renderCheckbox();

    const option1 = await screen.findByLabelText(/Option 1/i);
    expect(option1).not.toBeChecked();

    fireEvent.click(option1);

    await waitFor(() =>
      expect(screen.getByLabelText(/Option 1/i)).toBeChecked()
    );
  });
});
