# react-forminate

A dynamic form generator for React and Next.js, allowing you to define complex forms using JSON-like structures with built-in validation and grouped fields.

## Features

- 🚀 **Dynamic Form Rendering**: Define forms using a JSON-like structure.
- 📝 **Multiple Field Types**: Supports text, select, radio, checkbox, date, and more.
- 📂 **Grouped Fields**: Organize fields in logical sections using the `group` type.
- ✅ **Validation**: Supports required fields and conditional visibility.
- 📡 **API-Driven Options**: Fetch dynamic select options from an API.
- 🔄 **Dependency Management**: Show/hide or modify fields dynamically based on other fields.
- ⚡ **Lazy Loading**: Fields load only when needed, improving performance.
- 🛠 **Extensible Plugin System**: Add custom field components easily.

## Installation

```sh
npm install react-forminate
# or
yarn add react-forminate
```

## Usage

You can use react-forminate in different ways. Here are two examples:

#### Example 1: Basic Usage

```ts
"use client";
import { FormProvider, useForm } from "react-forminate";
import DynamicFormField from "./DynamicFormField";

const formData = {
  id: "my_form",
  fields: [
    { id: "name", label: "Name", type: "text", required: true },
    { id: "email", label: "Email", type: "text", required: true },
    { id: "dob", label: "Date of Birth", type: "date" },
  ],
};

const MyForm = () => {
  return (
    <FormProvider>
      <DynamicForm formData={formData} />
    </FormProvider>
  );
};

export default MyForm;
```

#### Example 2: Grouped Fields and Dynamic Options

```ts
import { DynamicForm } from "react-forminate";

const formData = {
  id: "main_form",
  label: "Main Form",
  type: "group",
  fields: [
    {
      id: "personal_info",
      label: "Personal Information",
      type: "group",
      fields: [
        { id: "first_name", label: "First Name", type: "text", required: true },
        { id: "last_name", label: "Last Name", type: "text", required: true },
        { id: "dob", label: "Date of Birth", type: "date", required: true },
      ],
    },
    {
      id: "address",
      label: "Address",
      type: "group",
      fields: [
        {
          id: "country",
          label: "Country",
          type: "select",
          options: ["USA", "Canada", "Germany", "France"],
          required: true,
        },
        {
          id: "state",
          label: "State",
          type: "select",
          required: false,
          dynamicOptions: {
            dependsOn: "country",
            endpoint: "/api/getStates",
            method: "GET",
          },
        },
        { id: "city", label: "City", type: "text", required: true },
      ],
    },
    {
      id: "health_info",
      label: "Health Information",
      type: "group",
      fields: [
        {
          id: "smoker",
          label: "Do you smoke?",
          type: "radio",
          options: ["Yes", "No"],
          required: true,
        },
        {
          id: "smoking_frequency",
          label: "How often do you smoke?",
          type: "select",
          options: ["Occasionally", "Daily", "Heavy"],
          required: true,
          visibility: {
            dependsOn: "smoker",
            condition: "equals",
            value: "Yes",
          },
        },
      ],
    },
  ],
};

function App() {
  const onSubmit = (value: any, isValid: boolean) => {
    console.log("Form is valid:", isValid);
    console.log("Submitted data:", value);
  };

  return (
    <div>
      <DynamicForm formData={formData} onSubmit={onSubmit} />
    </div>
  );
}

export default App;
```

## Supported Field Types

- Text (text): Standard input field.
- Number (number): Numeric input.
- Date (date): Date picker field.
- Select (select): Dropdown menu.
- Radio (radio): Radio button selection.
- Checkbox (checkbox): Checkbox selection.
- Group (group): Allows nesting of fields inside a structured section.

## ✅ Validation

Fields support built-in validation. Example:

```json
{
  "id": "email",
  "label": "Email",
  "type": "text",
  "required": true,
  "validation": {
    "pattern": "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
    "message": "Enter a valid email address"
  }
}
```

#### License

MIT
