import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { FormProvider } from "../src/context";
import { DynamicFormField } from "../src/components/DynamicFormField";
import { FormDataCollectionType, FormFieldType } from "../src";

// Render a single field through the real provider, mirroring how the library
// actually wires fields (split contexts + lazy field registry). The previous
// version of this test imported a removed `DynamicFormComponents/` path and a
// renamed `FormField` type, so it never ran.
const renderField = (field: FormFieldType) => {
  const schema: FormDataCollectionType = {
    formId: "field-form",
    fields: [field],
  };
  return render(
    <FormProvider formSchema={schema}>
      <DynamicFormField {...field} />
    </FormProvider>
  );
};

describe("DynamicFormField", () => {
  it("renders a text input for type 'text'", async () => {
    renderField({ fieldId: "name", type: "text", label: "Name" });

    await waitFor(() =>
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    );
  });

  it("renders a textarea for type 'textarea'", async () => {
    renderField({ fieldId: "bio", type: "textarea", label: "Bio" });

    await waitFor(() =>
      expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument()
    );
  });

  it("does not render a field whose visibility is false", async () => {
    renderField({
      fieldId: "secret",
      type: "text",
      label: "Secret",
      visibility: false,
    });

    // Give the lazy component a chance to load if it were going to.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByLabelText(/Secret/i)).not.toBeInTheDocument();
  });
});
