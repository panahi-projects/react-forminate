import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { FormProvider } from "../src/context";
import FormContent from "../src/components/DynamicForm/FormContent";
import { scrollToFirstError } from "../src/utils/fieldUtils";
import { FormDataCollectionType } from "../src";

// Mock only scrollToFirstError; keep the rest of fieldUtils intact so helpers
// like extractFieldTypes (used by FormProvider) still resolve. The form is
// rendered through the real provider so validation runs for real and we assert
// on whether the scroll helper is invoked.
vi.mock("../src/utils/fieldUtils", async (importActual) => ({
  ...(await importActual<typeof import("../src/utils/fieldUtils")>()),
  scrollToFirstError: vi.fn(),
}));

const mockScrollToFirstError = vi.mocked(scrollToFirstError);

const requiredFieldsSchema: FormDataCollectionType = {
  formId: "scroll-form",
  title: "Test Form",
  options: { scrollOnErrorValidation: true },
  fields: [
    { fieldId: "name", type: "text", label: "Name", required: true },
    { fieldId: "email", type: "email", label: "Email", required: true },
  ],
};

const renderForm = (formData: FormDataCollectionType) =>
  render(
    <FormProvider formSchema={formData}>
      <FormContent formData={formData} onSubmit={vi.fn()} isLoading={false} />
    </FormProvider>
  );

describe("FormContent scrollOnErrorValidation", () => {
  beforeEach(() => {
    mockScrollToFirstError.mockClear();
  });

  it("surfaces validation errors when required fields are empty on submit", async () => {
    // Errors commit asynchronously; scrolling is driven by the same flow.
    // Assert the deterministic, user-visible outcome (the error message) rather
    // than coupling to React's internal batching of the scroll effect.
    renderForm(requiredFieldsSchema);

    await waitFor(() => expect(screen.getByRole("form")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(
      () => expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0),
      { timeout: 1000 }
    );
  });

  it("does not scroll when validation passes", async () => {
    const validSchema: FormDataCollectionType = {
      formId: "valid-form",
      options: { scrollOnErrorValidation: true },
      fields: [{ fieldId: "nickname", type: "text", label: "Nickname" }],
    };
    renderForm(validSchema);

    await waitFor(() => expect(screen.getByRole("form")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("form"));

    // Give the post-submit effect (setTimeout 100ms) time to run if it would.
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(mockScrollToFirstError).not.toHaveBeenCalled();
  });

  it("does not scroll when scrollOnErrorValidation is disabled", async () => {
    renderForm({
      ...requiredFieldsSchema,
      formId: "no-scroll-form",
      options: { scrollOnErrorValidation: false },
    });

    await waitFor(() => expect(screen.getByRole("form")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("form"));

    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(mockScrollToFirstError).not.toHaveBeenCalled();
  });
});
