<div align="center">
        <a href="#" title="React-Forminate">
            <img src="./public/assets/React-Forminate-Logo-800x800-bg-transparent.webp" width="300" alt="React Forminate Header" />
        </a>
</div>

<h1 align="center">React Forminate⚡️</h1>
<p align="center">The most dynamic form builder for React</p>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

<br />
<p align="center">The ultimate plug-and-play form engine for modern React apps. Build fully dynamic, schema-based forms in seconds with advanced features like conditional logic, file uploads, and real-time validation.</p>

## Features ✨

- **Schema-Driven Forms** - JSON-powered forms with zero boilerplate
- **Real-Time Validation** - Built-in validators + custom async validation
- **Conditional Logic** - Show/hide fields based on other fields' values
- **File Handling** - Uploads with previews (Base64/Blob/File)
- **API-Driven Fields** - Dynamic options from endpoints
- **TypeScript Ready** - Full type safety
- **Performance Optimized** - Debounced updates, lazy loading
- **Accessibility** - ARIA attributes out of the box
- **Extensible** - Add custom fields and validators
- **Styling Freedom** - Tailwind, CSS modules, or inline styles

## Installation 📦

```bash
npm install react-forminate
# or
yarn add react-forminate
```

## Basic Usage 🚀

```tsx
import { DynamicForm } from "react-forminate";

const formSchema = {
  formId: "userForm",
  fields: [
    {
      fieldId: "name",
      type: "text",
      label: "Full Name",
      required: true,
    },
    {
      fieldId: "email",
      type: "email",
      label: "Email",
      required: true,
      validation: [{ type: "email" }],
    },
    {
      fieldId: "subscribe",
      type: "checkbox",
      label: "Subscribe to newsletter",
      visibility: {
        dependsOn: "email",
        condition: "not_empty",
      },
    },
  ],
};

export default () => (
  <DynamicForm formData={formSchema} onSubmit={console.log} />
);
```

## Advanced Features 🛠

### Conditional Fields

```tsx
{
  fieldId: "company",
  type: "text",
  label: "Company Name",
  visibility: {
    dependsOn: "employmentStatus",
    condition: "equals",
    value: "employed"
  }
}
```

### File Uploads

```tsx
{
  fieldId: "avatar",
  type: "file",
  accept: "image/*",
  storageFormat: "base64",
  events: {
    onCustomUpload: (files) => uploadToServer(files)
  }
}
```

### API-Driven Select

```tsx
{
  fieldId: "products",
  type: "select",
  dynamicOptions: {
    endpoint: "/api/products",
    transformResponse: (res) =>
      res.map(product => ({ label: product.name, value: product.id }))
  }
}
```

### Custom Validation

```tsx
{
  fieldId: "username",
  type: "text",
  validation: [
    {
      custom: async (value) => {
        const available = await checkUsernameAvailability(value);
        return available;
      },
      message: "Username already taken"
    }
  ]
}
```

### Auto-Scroll on Validation Errors

```tsx
{
  formId: "userForm",
  options: {
    scrollOnErrorValidation: true, // Automatically scroll to first error field
  },
  fields: [
    // ... your fields
  ]
}
```

When enabled, clicking the submit button on an invalid form will automatically scroll to the first field with a validation error, providing better user experience for long forms.

## Field Types Supported 🏗️

**Input Fields**

| Type     | Description                 | Example Use Case         |
| -------- | --------------------------- | ------------------------ |
| text     | Standard text input         | Names, general text      |
| email    | Email input with validation | User emails              |
| password | Masked password input       | Login forms              |
| number   | Numeric input               | Age, quantity            |
| tel      | Telephone number input      | Phone numbers            |
| url      | URL input with validation   | Website links            |
| search   | Search-style input          | Search boxes             |
| date     | Date picker                 | Birthdates, appointments |
| file     | File upload with previews   | Avatars, documents       |

**Selection Fields**

| Type     | Description        | Special Features    |
| -------- | ------------------ | ------------------- |
| select   | Dropdown select    | Dynamic API options |
| radio    | Radio button group | Single selection    |
| checkbox | Checkbox group     | Multiple selection  |

**Layout & Structural Fields**

| Type      | Description                  | Configuration Options  |
| --------- | ---------------------------- | ---------------------- |
| group     | Logical field grouping       | Nested fields, legends |
| container | Visual wrapper (div/section) | Grid layouts, spacing  |
| spacer    | Vertical/horizontal spacing  | Pixel-perfect gaps     |

**Special Fields**

| Type     | Description               | Content Flexibility          |
| -------- | ------------------------- | ---------------------------- |
| gridview | Data grid with pagination | API-driven tables            |
| content  | Custom HTML/JSX content   | Terms, rich text, components |
| textarea | Multi-line text area      | Long-form content            |

## Hooks for Control 🎣

```tsx
import {
  useFormValue,
  useFormActions,
  FormRegistryProvider,
} from "react-forminate";

// Get single value
const email = useFormValue("email", "formId");

// Access all form actions
const { validateForm, setValue } = useFormActions("formId");

// Wrap your app to enable multi-form control
<FormRegistryProvider>
  <App />
</FormRegistryProvider>;
```

## Why React Forminate? 💡

**✔ Productivity** - Build complex forms in minutes<br />
**✔ Maintainability** - Schema-based = cleaner code<br />
**✔ Consistency** - Unified validation & styling<br />
**✔ Flexibility** - Extend with custom fields<br />

## Documentation 📖

For complete documentation and advanced examples, visit our [documentation site](https://react-forminate.netlify.app/).
