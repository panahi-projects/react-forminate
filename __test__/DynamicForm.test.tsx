import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { DynamicForm, FormDataCollection } from "../src/components";

// Mock form data
const mockFormData: FormDataCollection = {
  formId: "test-form",
  title: "Test Form",
  fields: [
    { fieldId: "name", type: "text", label: "Name", required: true },
    { fieldId: "email", type: "email", label: "Email" },
  ],
};

describe("DynamicForm component", () => {
  it("should render correctly with provided form data", async () => {
    render(
      <DynamicForm
        formId="test-form"
        formData={mockFormData}
        onSubmit={() => {}}
      />
    );

    // Wait until the form fields are loaded
    await waitFor(() =>
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    );
  });

  it("should call onSubmit when form is submitted", async () => {
    const handleSubmit = vi.fn();
    render(
      <DynamicForm
        formId={mockFormData.formId}
        formData={mockFormData}
        onSubmit={handleSubmit}
      />
    );

    // Wait for form fields to be available
    await waitFor(() =>
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    );

    fireEvent.submit(screen.getByRole("form"));
    expect(handleSubmit).toHaveBeenCalled();
  });
});
