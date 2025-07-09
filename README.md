<div align="center">
        <a href="#" title="React-Forminate">
            <img src="./public/assets/React-Forminate-Logo-800x800-bg-transparent.webp" width="300" alt="React Forminate Header" />
        </a>
</div>

<h1 align="center">React Forminate⚡️</h1>
<br />

The ultimate plug-and-play form engine for modern React apps. Build fully dynamic, schema-based forms in seconds with advanced features like conditional logic, file uploads, and real-time validation.

## ✨ What's New

- File Upload Support with multiple storage formats (Base64, Blob URLs, etc.)
- Enhanced Validation with blur/change timing control
- Improved TypeScript Support for all field types
- Custom Event Handlers for file operations
- Dynamic Field Processing with function-based properties

## 💡 Key Features?

- ✅ **Zero-Boilerplate Forms** - JSON schema to fully functional forms
- ⚡ **Real-Time Validation** - Control when validation triggers (on blur or change)
- 📁 **File Handling** - Multiple storage formats with previews
- 🧠 **Smart Dependencies** - Fields that react to other fields' values
- 🛠️ **Extensible Architecture** - Add custom components and validators
- 🎨 **Style Control** - Tailwind, CSS modules, or inline styles

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
import { DynamicForm } from "react-forminate";

const formData = {
  formId: "userProfile",
  fields: [
    {
      fieldId: "name",
      type: "text",
      label: "Full Name",
      required: true
    },
    {
      fieldId: "avatar",
      type: "file",
      accept: "image/*",
      storageFormat: "base64"
    }
  ]
};

export default () => <DynamicForm formData={formData} onSubmit={console.log} />;
```

### 📂 Advanced Example

Grouped + API Options

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
      onSubmit={(value, isValid) => console.log(value, isValid)}
    />
  );
};

export default AdvancedGroupAndAPIForm;
```

File Uploads with Custom Handlers:

```ts
{
  fieldId: "documents",
  type: "file",
  multiple: true,
  accept: ".pdf,.docx",
  storageFormat: "blobUrl", // or "base64", "file", etc.
  events: {
    onCustomUpload: (files, fieldId) => {
      console.log(`${files.length} files uploaded to ${fieldId}`);
      // Upload to server here
    },
    onCustomRemove: (file) => {
      console.log("Removed file:", file.name);
    }
  }
}
```

Dynamic Field Properties:

```ts
{
  fieldId: "dynamicLabel",
  type: "text",
  label: {
    fn: ({ values }) => values.firstName
      ? `${values.firstName}'s Custom Field`
      : "Default Label"
  },
  required: {
    fn: ({ values }) => values.requireExtraFields
  }
}
```

Validation Control:

```ts
{
  formId: "myForm",
  options: {
    validateFieldsOnBlur: false // Validate immediately on change
  },
  fields: [
    {
      fieldId: "username",
      type: "text",
      validation: [
        {
          pattern: "^\\w{4,20}$",
          message: "4-20 alphanumeric characters"
        }
      ]
    }
  ]
}
```

### 🎨 TailwindCSS Styling Support

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
| `text`      | Single-line input field: text, email, password, etc.                     |
| `number`    | Numeric input                                                            |
| `date`      | Date picker                                                              |
| `file`      | File uploader                                                            |
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

Custom Validation Function:

```ts
{
  fieldId: "password",
  type: "password",
  validation: [
    {
      custom: (value) => value.length >= 8,
      message: "Password must be 8+ characters"
    }
  ]
}
```

## 📖 Documentation

For full documentation, advanced schema examples, and plugin development: 👉 Visit Full Docs

## 🧪 Contributions & Feedback

This library is in active development. Please try it out and submit issues for any bugs or feature requests. Contributions are welcome! <br /><br />

---

#### 💬 Need help or want to collaborate?

Feel free to reach out or contribute to improve `react-forminate`!
