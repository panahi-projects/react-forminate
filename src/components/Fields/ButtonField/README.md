# ButtonField Component

The ButtonField component is a versatile button field that can be used as a regular button or as a submit button for forms. It automatically integrates with the form validation system when configured as a submit button.

## Features

- **Multiple Button Types**: Supports `button`, `submit`, and `reset` types
- **Form Integration**: Seamlessly integrates with DynamicForm validation
- **Form Values Access**: Submit buttons provide access to current form values
- **Customizable Styling**: Supports both default and custom styling
- **Event Handling**: Flexible onClick handlers for custom logic

## Usage Examples

### Basic Button

```tsx
<ButtonField
  fieldId="my-button"
  type="button"
  label="Click Me"
  onClick={() => console.log("Button clicked!")}
/>
```

### Submit Button with Form Values Access

```tsx
<ButtonField
  fieldId="submit-btn"
  type="button"
  label="Submit Form"
  buttonType="submit"
  onClick={(event) => {
    // Access form values from the custom event
    const { formValues, fieldId, buttonType } = event;
    console.log("Form values:", formValues);

    // Perform additional validation or processing
    // The form will continue with submission after this
  }}
/>
```

### Form Integration

```tsx
const formData = {
  formId: "my-form",
  fields: [
    {
      fieldId: "name",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      fieldId: "submit-btn",
      type: "button",
      label: "Submit",
      buttonType: "submit",
      onClick: (event) => {
        const { formValues } = event;
        // Custom logic here
      },
    },
  ],
  options: {
    submit: { visible: false }, // Hide default submit button
  },
};

<DynamicForm formData={formData} onSubmit={handleSubmit} />;
```

## Submit Button Behavior

When `buttonType="submit"` is set:

1. **Form Validation**: Clicking the button triggers form validation
2. **Form Values Access**: The onClick handler receives form values through a custom event
3. **Natural Submission**: The form continues with its natural submission process
4. **Integration**: Works seamlessly with the form's onSubmit callback

## Props

| Prop         | Type                                                   | Default     | Description                     |
| ------------ | ------------------------------------------------------ | ----------- | ------------------------------- |
| `fieldId`    | `string`                                               | -           | Unique identifier for the field |
| `type`       | `"button"`                                             | -           | Field type (always "button")    |
| `label`      | `string \| ReactNode`                                  | -           | Button text or content          |
| `onClick`    | `(event: React.MouseEvent<HTMLButtonElement>) => void` | -           | Click event handler             |
| `buttonType` | `"button" \| "submit" \| "reset"`                      | `"button"`  | HTML button type                |
| `variant`    | `"primary" \| "secondary" \| "tertiary" \| "link"`     | `"primary"` | Button style variant            |
| `size`       | `"small" \| "medium" \| "large"`                       | `"medium"`  | Button size                     |
| `disabled`   | `boolean \| function`                                  | `false`     | Whether the button is disabled  |
| `loading`    | `boolean`                                              | `false`     | Shows loading state             |

## Custom Event Properties (Submit Buttons)

When used as a submit button, the `onClick` handler receives an enhanced event object:

```tsx
const handleButtonClick = (event: any) => {
  const {
    formValues, // Current form values
    fieldId, // Button field ID
    buttonType, // Button type ("submit")
    // ... all standard MouseEvent properties
  } = event;

  // Your custom logic here
};
```

## Styling

The component supports both default styling and custom styling:

- **Default Styling**: Uses built-in CSS classes (`.form-element`, `.form-button`)
- **Custom Styling**: Set `disableDefaultStyling={true}` for native button styling

## Best Practices

1. Use `buttonType="submit"` for form submission buttons
2. Use the onClick handler for custom logic, not for form submission
3. Access form values through the custom event properties in submit buttons
4. Provide clear, descriptive labels for buttons
5. Consider accessibility with proper ARIA labels

## Testing

The component includes comprehensive tests covering:

- Basic rendering and props
- Click event handling
- Submit button functionality
- Form values access
- Different button types
- Error state handling

Run tests with: `npm test -- ButtonField.test.tsx`
