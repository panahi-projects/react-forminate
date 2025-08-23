# Scroll on Error Validation Feature Implementation

## Overview

This document describes the implementation of the `scrollOnErrorValidation` feature for the React Forminate form builder. This feature automatically scrolls to the first field with a validation error when a form is submitted and validation fails.

## Feature Description

When `scrollOnErrorValidation: true` is set in the form options, clicking the submit button on an invalid form will:

1. **Automatically scroll** to the first field with a validation error
2. **Smooth scrolling** with CSS `scroll-behavior: smooth`
3. **Center the field** in the viewport for optimal visibility
4. **Auto-focus** on the error field for better user experience
5. **Work with all field types** and validation rules

## Implementation Details

### 1. Type Definition

Added the new option to the `FormOptions` interface in `src/types/formTypes.ts`:

```typescript
export interface FormOptions {
  validateFieldsOnBlur?: boolean;
  disableDefaultStyling?: FieldDisableDefaultStyling;
  scrollOnErrorValidation?: boolean; // NEW OPTION
  // ... other options
}
```

### 2. Utility Function

Created `scrollToFirstError` utility in `src/utils/fieldUtils.ts`:

```typescript
export const scrollToFirstError = (
  errors: Record<string, string>,
  formFields: any[],
  values: Record<string, any>,
  formSchema: any
): void => {
  if (!errors || Object.keys(errors).length === 0) return;

  // Get the first field ID that has an error
  const firstErrorFieldId = Object.keys(errors)[0];

  // Find the field element by ID
  const fieldElement = document.getElementById(firstErrorFieldId);

  if (fieldElement) {
    // Smooth scroll to the field
    fieldElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    // Focus on the field for better UX
    const focusableElement = fieldElement.querySelector(
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElement && focusableElement instanceof HTMLElement) {
      focusableElement.focus();
    }
  }
};
```

### 3. FormContent Integration

Modified `src/components/DynamicForm/FormContent.tsx` to:

- Import the `useFormErrors` hook to access form errors
- Extract the `scrollOnErrorValidation` option from form data
- Implement scroll behavior in the submit handler
- Use `setTimeout` to ensure DOM updates before scrolling

```typescript
const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm(formData);

    // If form is not valid and scrollOnErrorValidation is enabled, scroll to first error
    if (!isValid && scrollOnErrorValidation) {
      // Use setTimeout to ensure the DOM has been updated with the new errors
      setTimeout(() => {
        scrollToFirstError(errors, formData.fields, values, formData);
      }, 100);
    }

    onSubmit?.(values, isValid);
  },
  [formData, onSubmit, validateForm, values, scrollOnErrorValidation, errors]
);
```

## Usage

### Basic Implementation

```tsx
import { DynamicForm } from "react-forminate";

const formData = {
  formId: "user-form",
  options: {
    scrollOnErrorValidation: true, // Enable auto-scroll
  },
  fields: [
    {
      fieldId: "firstName",
      type: "text",
      label: "First Name",
      required: true,
    },
    // ... more fields
  ],
};

export default () => (
  <DynamicForm formData={formData} onSubmit={handleSubmit} />
);
```

### Conditional Usage

```tsx
const formData = {
  formId: "user-form",
  options: {
    scrollOnErrorValidation: shouldEnableScroll, // Dynamic based on conditions
    validateFieldsOnBlur: true,
  },
  // ... fields
};
```

## Technical Considerations

### 1. Timing

The `setTimeout` with 100ms delay ensures that:

- Form validation completes
- Error states are updated in the DOM
- Error messages are rendered
- Then scrolling occurs

### 2. Element Selection

The utility function:

- Finds the first field with an error (first key in errors object)
- Uses `document.getElementById()` for reliable element selection
- Falls back gracefully if element is not found

### 3. Focus Management

After scrolling:

- Automatically focuses on the error field
- Improves accessibility and user experience
- Works with all input types (input, select, textarea, etc.)

### 4. Browser Compatibility

The implementation uses standard DOM APIs:

- `scrollIntoView()` with smooth behavior (modern browsers)
- `querySelector()` for finding focusable elements
- Graceful degradation for older browsers

## Testing

Created comprehensive tests in `__test__/FormContent.test.tsx`:

1. **Scroll on validation failure** - Verifies scroll behavior when form is invalid
2. **No scroll on validation success** - Ensures no scrolling when form is valid
3. **No scroll when disabled** - Confirms feature respects the option setting

## Documentation

### README.md

Added feature description in the Advanced Features section with code examples.

### Storybook

- Created `ScrollOnErrorExample.tsx` component demonstrating the feature
- Added new story `ScrollOnErrorValidation` to showcase functionality
- Updated MDX documentation with detailed usage instructions

## Benefits

1. **Improved UX** - Users don't need to manually scroll to find errors
2. **Accessibility** - Better screen reader experience with focused error fields
3. **Mobile Friendly** - Especially helpful on smaller screens
4. **Configurable** - Optional feature that doesn't affect existing forms
5. **Performance** - Lightweight implementation with minimal overhead

## Future Enhancements

Potential improvements could include:

1. **Custom scroll behavior** - Allow users to define scroll options
2. **Multiple error highlighting** - Visual indicators for all error fields
3. **Scroll animation customization** - Configurable scroll duration and easing
4. **Keyboard navigation** - Jump between error fields with keyboard shortcuts

## Conclusion

The `scrollOnErrorValidation` feature provides a significant improvement to user experience by automatically guiding users to validation errors. The implementation is clean, performant, and follows React Forminate's existing patterns and architecture.
