import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { FormProvider } from "../src/context";
import FormContent from "../src/components/DynamicForm/FormContent";
import { FormDataCollectionType } from "../src";

// Mock the scrollToFirstError utility
vi.mock("../src/utils/fieldUtils", () => ({
  scrollToFirstError: vi.fn(),
}));

// Mock the scrollIntoView method
const mockScrollIntoView = vi.fn();
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  value: mockScrollIntoView,
  writable: true,
});

// Mock the focus method
const mockFocus = vi.fn();
Object.defineProperty(HTMLElement.prototype, "focus", {
  value: mockFocus,
  writable: true,
});

// Mock form data with validation
const mockFormData: FormDataCollectionType = {
  formId: "test-form",
  title: "Test Form",
  options: {
    scrollOnErrorValidation: true,
  },
  fields: [
    { fieldId: "name", type: "text", label: "Name", required: true },
    { fieldId: "email", type: "email", label: "Email", required: true },
  ],
};

// Mock form context values
const mockFormContext = {
  values: {},
  errors: {},
  dynamicOptions: {},
  formSchema: mockFormData,
  observer: {
    subscribe: vi.fn(() => vi.fn()),
    unsubscribe: vi.fn(),
    notify: vi.fn(),
  },
  formOptions: mockFormData.options,
  touched: {},
  setTouched: vi.fn(),
  blurred: {},
  setBlurred: vi.fn(),
  setValue: vi.fn(),
  validateField: vi.fn(),
  validateForm: vi.fn(),
  shouldShowField: vi.fn(() => true),
  fetchDynamicOptions: vi.fn(),
  getFieldSchema: vi.fn(),
};

describe("FormContent component with scrollOnErrorValidation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock document.getElementById to return a mock element
    document.getElementById = vi.fn(
      () =>
        ({
          scrollIntoView: mockScrollIntoView,
          querySelector: vi.fn(() => ({
            focus: mockFocus,
          })),
        }) as any
    );
  });

  it("should scroll to first error when form validation fails and scrollOnErrorValidation is enabled", async () => {
    const mockValidateForm = vi.fn().mockResolvedValue(false);
    const mockOnSubmit = vi.fn();

    // Mock the useFormActions hook
    vi.doMock("../src/hooks", () => ({
      useFormActions: () => ({
        validateForm: mockValidateForm,
      }),
      useFormValues: () => ({}),
      useFormErrors: () => ({ name: "Name is required" }),
    }));

    render(
      <FormProvider formSchema={mockFormData}>
        <FormContent
          formData={mockFormData}
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      </FormProvider>
    );

    // Wait for form to be rendered
    await waitFor(() => {
      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("form"));

    // Wait for validation and scroll behavior
    await waitFor(() => {
      expect(mockValidateForm).toHaveBeenCalled();
    });

    // Check that scrollToFirstError was called (with setTimeout delay)
    await waitFor(
      () => {
        expect(mockScrollIntoView).toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  it("should not scroll when form validation passes", async () => {
    const mockValidateForm = vi.fn().mockResolvedValue(true);
    const mockOnSubmit = vi.fn();

    // Mock the useFormActions hook
    vi.doMock("../src/hooks", () => ({
      useFormActions: () => ({
        validateForm: mockValidateForm,
      }),
      useFormValues: () => ({}),
      useFormErrors: () => ({}),
    }));

    render(
      <FormProvider formSchema={mockFormData}>
        <FormContent
          formData={mockFormData}
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      </FormProvider>
    );

    // Wait for form to be rendered
    await waitFor(() => {
      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("form"));

    // Wait for validation
    await waitFor(() => {
      expect(mockValidateForm).toHaveBeenCalled();
    });

    // Check that scrollToFirstError was not called
    await waitFor(
      () => {
        expect(mockScrollIntoView).not.toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });

  it("should not scroll when scrollOnErrorValidation is disabled", async () => {
    const formDataWithoutScroll = {
      ...mockFormData,
      options: {
        ...mockFormData.options,
        scrollOnErrorValidation: false,
      },
    };

    const mockValidateForm = vi.fn().mockResolvedValue(false);
    const mockOnSubmit = vi.fn();

    // Mock the useFormActions hook
    vi.doMock("../src/hooks", () => ({
      useFormActions: () => ({
        validateForm: mockValidateForm,
      }),
      useFormValues: () => ({}),
      useFormErrors: () => ({ name: "Name is required" }),
    }));

    render(
      <FormProvider formSchema={formDataWithoutScroll}>
        <FormContent
          formData={formDataWithoutScroll}
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      </FormProvider>
    );

    // Wait for form to be rendered
    await waitFor(() => {
      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.submit(screen.getByRole("form"));

    // Wait for validation
    await waitFor(() => {
      expect(mockValidateForm).toHaveBeenCalled();
    });

    // Check that scrollToFirstError was not called
    await waitFor(
      () => {
        expect(mockScrollIntoView).not.toHaveBeenCalled();
      },
      { timeout: 200 }
    );
  });
});
