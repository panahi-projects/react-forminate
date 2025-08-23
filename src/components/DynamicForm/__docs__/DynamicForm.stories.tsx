import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";
import ScrollOnErrorExample from "./ScrollOnErrorExample";

const meta: Meta<typeof Example> = {
  title: "DynamicFormCore",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

const inputStyles: Record<string, React.CSSProperties> = {
  styles: {
    border: "1px solid #aaa3d2",
    borderRadius: "4px",
    padding: "8px",
    margin: "8px 0",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "16px",
    color: "#333",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
  },
  containerStyles: {
    display: "flex",
    flexDirection: "column",
    margin: "4px 0 12px",
    width: "100%",
    boxSizing: "border-box",
  },
  labelStyles: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "0",
    textAlign: "left",
    display: "block",
    width: "100%",
    fontFamily: "sans-serif",
  },
};

export const SimpleForm: Story = {
  args: {
    formId: "simple-form",
    formData: {
      formId: "simple-form",
      title: "Simple Form",
      fields: [
        {
          fieldId: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          ...inputStyles,
        },
        {
          fieldId: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          ...inputStyles,
        },
        {
          fieldId: "gender",
          label: "Gender",
          type: "radio",
          options: ["Male", "Female"],
        },
        {
          fieldId: "age",
          label: "Age",
          type: "number",
          ...inputStyles,
        },
        {
          fieldId: "email",
          label: "Email",
          type: "email",
          required: true,
          ...inputStyles,
        },
      ],
    },
    onSubmit: (data) => console.log("Form submitted with data:", data),
    isLoading: false,
    submitDetails: {
      text: "Submit",
    },
  },
};

export const FormWithCustomSubmit: Story = {
  args: {},
};

export const ScrollOnErrorValidation: Story = {
  render: () => <ScrollOnErrorExample />,
  parameters: {
    docs: {
      description: {
        story:
          "This form demonstrates the scrollOnErrorValidation feature. When you submit the form with validation errors, it will automatically scroll to the first field that has an error.",
      },
    },
  },
};
