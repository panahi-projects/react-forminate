import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxField } from "../../src/components/DynamicFormComponents/Fields";
import {
  CheckboxField as CheckboxFieldType,
  FormContext,
  FormContextType,
} from "../../src/components";

// Mock checkbox field params
const mockParams: CheckboxFieldType = {
  fieldId: "checkbox",
  type: "checkbox",
  label: "Checkbox",
  required: false,
  options: ["Option 1", "Option 2"],
};

// Mock FormContext
const mockSetValue = vi.fn();
const mockShouldShowField = vi.fn(() => true);
const mockContextValue: FormContextType = {
  shouldShowField: mockShouldShowField,
  values: {}, // Mock form values
  errors: {}, // Mock form errors
  dynamicOptions: {}, // Mock dynamic options
  setValue: mockSetValue, // Mock function to update form values
  fetchDynamicOptions(fieldId, value) {
    // Mock function to fetch dynamic options based on fieldId and value
    return Promise.resolve([]);
  },
  validateField: vi.fn(), // Mock function to validate a field
  validateForm: vi.fn(), // Mock function to validate the entire form
};
describe("CheckboxField Component", () => {
  it("renders CheckboxField correctly", async () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <CheckboxField {...mockParams} />
      </FormContext.Provider>
    );

    // Ensure the checkbox is in the document
    await waitFor(() =>
      expect(screen.getByLabelText(/Option 1/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByLabelText(/Option 2/i)).toBeInTheDocument()
    );
  });

  it("calls setValue when checkbox is clicked", async () => {
    render(
      <FormContext.Provider value={mockContextValue}>
        <CheckboxField {...mockParams} />
      </FormContext.Provider>
    );

    const option1 = screen.getByLabelText(/Option 1/i);

    // Click the checkbox and wait for state update
    await waitFor(() => fireEvent.click(option1));

    // Ensure the mock function was called with the expected value
    await waitFor(() =>
      expect(mockSetValue).toHaveBeenCalledWith("checkbox", ["Option 1"])
    );
  });
});
