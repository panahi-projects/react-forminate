import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { FormContext, FormContextType, FormField } from "../src/components";
import { DynamicFormField } from "../src/components/DynamicFormComponents/DynamicFormField";

// Mock field components
vi.mock("../src/Fields", () => ({
  InputField: (props: any) => <input data-testid="input-field" {...props} />,
  DatePickerField: (props: any) => (
    <input data-testid="date-picker-field" {...props} />
  ),
  SelectField: (props: any) => <select data-testid="select-field" {...props} />,
  RadioField: (props: any) => (
    <input type="radio" data-testid="radio-field" {...props} />
  ),
  CheckboxField: (props: any) => (
    <input type="checkbox" data-testid="checkbox-field" {...props} />
  ),
}));

// Mock FormContext to control conditional visibility
const mockShouldShowField = vi.fn(() => true);
const mockContextValue: FormContextType = {
  shouldShowField: mockShouldShowField,
  values: {}, // Mock form values
  errors: {}, // Mock form errors
  dynamicOptions: {}, // Mock dynamic options
  setValue: vi.fn(), // Mock function to update form values
  fetchDynamicOptions(fieldId, value) {
    // Mock function to fetch dynamic options based on fieldId and value
    return Promise.resolve([]);
  },
  validateField: vi.fn(), // Mock function to validate a field
  validateForm: vi.fn(), // Mock function to validate the entire form
};

const renderWithContext = (fieldProps: FormField) => {
  return render(
    <FormContext.Provider value={mockContextValue}>
      <DynamicFormField {...fieldProps} />
    </FormContext.Provider>
  );
};

describe("DynamicFormField Component", () => {
  it("should render InputField for text type", async () => {
    renderWithContext({ id: "name", type: "text", label: "Name" });

    await waitFor(() =>
      expect(screen.getByTestId("input-field")).toBeInTheDocument()
    );
  });

  it("should render DatePickerField for date type", async () => {
    renderWithContext({ id: "dob", type: "date", label: "Date of Birth" });

    await waitFor(() =>
      expect(screen.getByTestId("date-picker-field")).toBeInTheDocument()
    );
  });

  it("should render SelectField for select type", async () => {
    renderWithContext({ id: "country", type: "select", label: "Country" });

    await waitFor(() =>
      expect(screen.getByTestId("select-field")).toBeInTheDocument()
    );
  });

  it("should render RadioField for radio type", async () => {
    renderWithContext({ id: "gender", type: "radio", label: "Gender" });

    await waitFor(() =>
      expect(screen.getByTestId("radio-field")).toBeInTheDocument()
    );
  });

  it("should render CheckboxField for checkbox type", async () => {
    renderWithContext({
      id: "agree",
      type: "checkbox",
      label: "Agree to terms",
    });

    await waitFor(() =>
      expect(screen.getByTestId("checkbox-field")).toBeInTheDocument()
    );
  });

  it("should not render field if shouldShowField returns false", async () => {
    mockShouldShowField.mockReturnValueOnce(false);
    renderWithContext({
      id: "hiddenField",
      type: "text",
      label: "Hidden Field",
    });

    expect(screen.queryByTestId("input-field")).not.toBeInTheDocument();
  });
});
