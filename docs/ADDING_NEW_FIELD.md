# Adding New Fields to React Forminate

This guide explains how to add new custom fields to the React Forminate library. The library uses a flexible field registration system that allows you to create custom field components and integrate them seamlessly.

## Overview

React Forminate uses a **field registry system** where field types are mapped to their corresponding React components. When you add a new field, you need to:

1. Create the field component
2. Define the field type interface
3. Register the field in the system
4. Export it from the main Fields index

## Field Registration System

The core of the field registration system is in `src/components/DynamicFormField/DynamicFormField.tsx`. Fields are registered in the `fieldComponents` object:

```typescript
const fieldComponents: Record<string, ComponentType<any>> = {
  text: lazy(() => import("../Fields/InputField")),
  number: lazy(() => import("../Fields/InputField")),
  email: lazy(() => import("../Fields/InputField")),
  select: lazy(() => import("../Fields/SelectField")),
  checkbox: lazy(() => import("../Fields/CheckboxField")),
  // ... other fields
};
```

## Step-by-Step Guide

### 1. Create the Field Component

Create a new directory under `src/components/Fields/` for your field:

```
src/components/Fields/YourFieldName/
├── YourFieldName.tsx
├── index.ts
└── README.md (optional)
```

#### Field Component Structure

Your field component should follow this pattern:

```typescript
import { useField } from "@/hooks";
import { YourFieldType } from "@/types";
import React from "react";

const YourFieldName: React.FC<YourFieldType> = React.memo((props) => {
  const {
    eventHandlers,
    processedProps,
    fieldParams,
    fieldValue,
    fieldId,
    isTouched,
    setValue,
  } = useField(props);

  // Your field logic here

  return (
    <div>
      {/* Your field JSX */}
    </div>
  );
});

YourFieldName.displayName = "YourFieldName";
export default React.memo(YourFieldName);
```

#### Key Hooks to Use

- **`useField(props)`**: Provides field state, event handlers, and utilities
- **`useOptimizedField(props)`**: For simpler fields that don't need full field state
- **`useDynamicField(props)`**: For fields with dynamic behavior

### 2. Define the Field Type Interface

Add your field type to `src/types/fieldTypes.ts`:

```typescript
// Add to the FieldTypes union
export type FieldTypes =
  | FieldInputType
  | "select"
  | "checkbox"
  | "radio"
  | "yourFieldType" // Add your new type here
  | string;

// Create your field interface
export interface YourFieldType extends BaseField {
  type: "yourFieldType";
  // Add your specific props here
  customProp?: string;
  options?: string[];
}
```

### 3. Register the Field

#### Option A: Automatic Registration (Recommended)

Add your field to the `fieldComponents` object in `src/components/DynamicFormField/DynamicFormField.tsx`:

```typescript
const fieldComponents: Record<string, ComponentType<any>> = {
  // ... existing fields
  yourFieldType: lazy(() => import("../Fields/YourFieldName")),
};
```

#### Option B: Dynamic Registration

Use the `registerField` function exported from `DynamicFormField`:

```typescript
import { registerField } from "react-forminate";
import YourFieldComponent from "./YourFieldComponent";

// Register your field
registerField("yourFieldType", YourFieldComponent);
```

### 4. Export from Fields Index

Add your field to `src/components/Fields/index.ts`:

```typescript
import YourFieldName from "./YourFieldName";

export {
  // ... existing exports
  YourFieldName,
};
```

### 5. Update Main Library Exports

Ensure your field is available by updating `src/components/index.ts` if needed:

```typescript
export { YourFieldName } from "./Fields";
```

## Field Component Best Practices

### 1. Use React.memo for Performance

```typescript
export default React.memo(YourFieldName);
```

### 2. Implement Proper Event Handling

```typescript
const {
  eventHandlers,
  // ... other destructured values
} = useField(props);

// Use the provided event handlers
const inputProps = {
  ...fieldParams,
  ...eventHandlers.htmlHandlers,
  value: fieldValue,
};
```

### 3. Handle Field State Properly

```typescript
const { fieldValue, fieldErrors, isTouched, setValue } = useField(props);

// Use setValue for controlled inputs
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(fieldId, e.target.value);
};
```

### 4. Support Custom Styling

```typescript
const commonProps = {
  ...fieldParams,
  ...eventHandlers.htmlHandlers,
  value: fieldValue,
  className: processedProps.className,
  style: processedProps.style,
};
```

## Example: Creating a ToggleField

Here's a complete example of creating a toggle field:

### 1. Create ToggleField.tsx

```typescript
import { useField } from "@/hooks";
import { ToggleFieldType } from "@/types";
import React from "react";

const ToggleField: React.FC<ToggleFieldType> = React.memo((props) => {
  const {
    eventHandlers,
    processedProps,
    fieldParams,
    fieldValue,
    fieldId,
    setValue,
  } = useField(props);

  const handleToggle = () => {
    const newValue = !fieldValue;
    setValue(fieldId, newValue);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={processedProps.className}
      style={processedProps.style}
      aria-pressed={fieldValue}
      {...fieldParams}
    >
      {fieldValue ? "ON" : "OFF"}
    </button>
  );
});

ToggleField.displayName = "ToggleField";
export default React.memo(ToggleField);
```

### 2. Add Type Definition

```typescript
// In src/types/fieldTypes.ts
export interface ToggleFieldType extends BaseField {
  type: "toggle";
  onLabel?: string;
  offLabel?: string;
}
```

### 3. Register the Field

```typescript
// In DynamicFormField.tsx
const fieldComponents: Record<string, ComponentType<any>> = {
  // ... existing fields
  toggle: lazy(() => import("../Fields/ToggleField")),
};
```

### 4. Export

```typescript
// In src/components/Fields/index.ts
export { ToggleField } from "./ToggleField";
```

## Usage

Once registered, you can use your field in form configurations:

```typescript
const formConfig = {
  fields: [
    {
      fieldId: "user.agreement",
      type: "toggle",
      label: "I agree to the terms",
      required: true,
    },
  ],
};
```

## Advanced Features

### Custom Validation

```typescript
const formConfig = {
  fields: [
    {
      fieldId: "custom.field",
      type: "yourFieldType",
      validation: [
        {
          type: "custom",
          message: "Custom validation failed",
          validate: (value) => {
            // Your validation logic
            return value === "expected";
          },
        },
      ],
    },
  ],
};
```

### Dynamic Options

```typescript
const formConfig = {
  fields: [
    {
      fieldId: "dynamic.field",
      type: "yourFieldType",
      options: {
        source: "api",
        endpoint: "/api/options",
        dependsOn: ["other.field"],
      },
    },
  ],
};
```

### Conditional Visibility

```typescript
const formConfig = {
  fields: [
    {
      fieldId: "conditional.field",
      type: "yourFieldType",
      visibility: {
        dependsOn: "other.field",
        condition: (value) => value === "show",
      },
    },
  ],
};
```

## Testing Your Field

Create tests for your field component:

```typescript
// __test__/fields/YourFieldName.test.tsx
import { render, screen } from "@testing-library/react";
import YourFieldName from "../../src/components/Fields/YourFieldName";

describe("YourFieldName", () => {
  it("renders correctly", () => {
    const props = {
      fieldId: "test.field",
      type: "yourFieldType",
      label: "Test Field",
    };

    render(<YourFieldName {...props} />);
    expect(screen.getByText("Test Field")).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Field Not Rendering

1. Check if the field type is registered in `fieldComponents`
2. Verify the import path in the lazy loading
3. Ensure the field type is included in the `FieldTypes` union

### Type Errors

1. Make sure your field interface extends `BaseField`
2. Check that your field type is included in the `FieldTypes` union
3. Verify all required props are properly typed

### Performance Issues

1. Use `React.memo` for your component
2. Implement proper memoization with `useMemo` and `useCallback`
3. Avoid creating new objects in render functions

## Conclusion

Adding new fields to React Forminate is straightforward once you understand the registration system. Follow the established patterns, use the provided hooks, and ensure proper typing. The library's architecture makes it easy to extend with custom field types while maintaining consistency and performance.

For more complex fields, consider creating a plugin package that can be distributed separately and registered dynamically using the `registerField` function.
