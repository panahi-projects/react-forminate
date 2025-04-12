# 🧩 React Forminate

The ultimate plug-and-play form engine for modern React apps.

Build fully dynamic, schema-based forms in seconds — no boilerplate, no repetitive wiring, and full TypeScript support out of the box.

A dynamic form generator for React and Next.js, enabling you to build powerful forms using JSON-like structures. It supports validation, grouping, API-driven select fields, custom styling (including Tailwind CSS), and dynamic field behaviors.

## 💡 Why use `react-forminate`?

- ✅ Zero setup required – Just provide a JSON schema and you're good to go.
- ⚙️ Highly customizable – Use your own field components, layouts, and skeletons.
- 🔌 API-powered fields – Support for dynamic options, remote filtering, and paginated data.
- 🧠 Smart schema system – Add logic, validation, conditions, and dynamic queries right in your config.
- 🧱 Composable – Works great with any UI library (Tailwind, shadcn, Material UI, etc.)
- 🛠️ Built for real-world apps – Perfect for dashboards, admin panels, CMS forms, onboarding flows, and more.
- 🔄 Live preview + local development support – Test your custom fields and forms locally before publishing.

## ✨ Features

- 🧩 **Dynamic Form Rendering** using JSON schema (`FormDataCollection`)
- 🧠 **Built-in Validation** with custom messages and regex
- 🧱 **Grouped Fields** for logical sections
- 📅 **Date, Text, Select, Radio, Checkbox** support
- 🔁 **API-Driven Selects** with dependent fields
- 🧩 **Extensible with Plugins** for custom components
- 🎯 **Conditional Visibility** & dependencies
- 💨 **Lazy Field Loading** to boost performance
- 🎨 **Custom Styling** via TailwindCSS or inline styles

---

## 📦 Installation

```bash
npm install react-forminate
# or
yarn add react-forminate
```

## 🚀 Quick Start

**✅ Basic Usage**

```ts
import { DynamicForm, FormProvider } from "react-forminate";

const formData = {
  formId: "SimpleForm",
  title: "Simple Form Example",
  fields: [
    {
      fieldId: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter your name",
    },
    {
      fieldId: "email",
      label: "Email",
      type: "text",
      required: true,
      placeholder: "Enter your email",
    },
    {
      fieldId: "dob",
      label: "Date of Birth",
      type: "date",
    },
  ],
};

const App = () => {
  const handleSubmit = (values: any, isValid: boolean) => {
    console.log("Form Data:", values, "Is Valid:", isValid);
  };

  return <DynamicForm formData={formData} onSubmit={handleSubmit} />;
};

export default App;
```

## 📂 Advanced Example (Grouped + API Options)

```ts
import { DynamicForm, FormDataCollection } from "react-forminate";

const formData: FormDataCollection = {
  formId: "ApiDrivenFormData",
  title: "API Driven Form Example",
  fields: [
    {
      fieldId: "group1",
      label: "Photo Album",
      type: "group",
      className: "p-4 border-2 border-gray-300 rounded-lg",
      legendClassName: "block text-sm font-medium text-gray-200 px-2",
      fields: [
        {
          fieldId: "album",
          label: "Album",
          type: "select",
          dynamicOptions: {
            endpoint: "https://jsonplaceholder.typicode.com/albums",
            transformResponse: (res) =>
              res.map((item: { title: string; id: string }) => ({
                label: item.title,
                value: item.id,
              })),
            fetchOnInit: true,
          },
          className:
            "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          labelClassName:
            "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        },
        {
          fieldId: "photo",
          label: "Photo",
          type: "select",
          dynamicOptions: {
            dependsOn: "album",
            endpoint: "https://jsonplaceholder.typicode.com/photos",
            params: { albumId: "album" },
            transformResponse: (res) =>
              res.map((item: { title: string; id: string }) => ({
                label: item.title,
                value: item.id,
              })),
          },
          className:
            "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          labelClassName:
            "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        },
      ],
    },
  ],
};
const AdvancedGroupAndAPIForm = () => {
  return (
    <DynamicForm
      formData={formData}
      onSubmit={(value, valid) => console.log(value, valid)}
    />
  );
};

export default AdvancedGroupAndAPIForm;
```

## 🎨 TailwindCSS Styling Support

Fields support custom `className`, `labelClassName`, and even inline `styles`.

```ts
{
  fieldId: "email",
  label: "Email",
  type: "text",
  className: "bg-gray-100 p-2 rounded-md w-full",
  labelClassName: "text-sm text-gray-700",
  placeholder: "Enter your email",
}
```

You can also apply inline styles:

```ts
{
  type: "radio",
  fieldId: "subscribe",
  label: "Subscribe",
  styles: {
    backgroundColor: "#fff",
    padding: "10px",
  },
  labelStyles: {
    fontWeight: "bold",
    color: "#000",
  },
}
```

## 🛠 Supported Field Types

| Type        | Description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `text`      | Single-line input field                                                  |
| `number`    | Numeric input                                                            |
| `date`      | Date picker                                                              |
| `select`    | Dropdown select (static/dynamic)                                         |
| `radio`     | Radio button group                                                       |
| `checkbox`  | Checkbox list                                                            |
| `textarea`  | Multi-line text area                                                     |
| `group`     | Logical grouping of fields                                               |
| `container` | Logical wrapper to group fields visually or structurally                 |
| `gridview`  | Displays dynamic API data in a grid layout with pagination and filtering |
| `spacer`    | Adds visual spacing in the form layout                                   |
| `custom`    | Custom component (via plugin)                                            |

## ✅ Validation Example

```ts
...
{
  fieldId: "name",
  label: "Name",
  type: "text",
  required: true,
  placeholder: "Enter your name",
  requiredMessage: "Name is required", //Custom required text message
  validation: [
    {
      pattern: "^[a-zA-Z ]+$",
      message: "Name should contain only letters and spaces",
    },
    {
      minLength: 3,
      message: "Name should be at least 3 characters long",
    },
  ],
},
...
```

or

```ts
{
  fieldId: "email",
  label: "Email",
  type: "text",
  required: true,
  placeholder: "Enter your email",
  validation: [{
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Invalid email format",
  }],
}
```

## 📖 Documentation

For full documentation, advanced schema examples, and plugin development: 👉 Visit Full Docs

## 🧪 Contributions & Feedback

This library is in active development. Please try it out and submit issues for any bugs or feature requests. Contributions are welcome! <br /><br />

---

#### 💬 Need help or want to collaborate?

Feel free to reach out or contribute to improve `react-forminate`!
