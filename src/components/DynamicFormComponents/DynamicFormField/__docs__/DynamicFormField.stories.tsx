import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "DynamicFormField",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

const styles: Record<string, React.CSSProperties> = {
  containerStyles: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "5px",
  },
  labelStyles: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px",
  },
  styles: {
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
};

export const InputField: Story = {
  args: {
    id: "sampleInputField",
    label: "Sample Input Field",
    type: "text",
    required: true,
    placeholder: "Enter text here",
    labelClassName: "label-class",
    containerClassName: "container-class",
    className: "input-class",
    ...styles,
  },
};
export const SelectField: Story = {
  args: {
    id: "sampleSelectField",
    label: "Sample Select Field",
    type: "select",
    required: false,
    labelClassName: "label-class",
    containerClassName: "container-class",
    className: "input-class",
    ...styles,
    options: ["Option 1", "Option 2", "Option 3"],
  },
};

export const RadioField: Story = {
  args: {
    id: "sampleRadioField",
    label: "Sample Radio Field",
    type: "radio",
    required: false,
    labelClassName: "label-class",
    containerClassName: "container-class",
    className: "input-class",
    ...styles,
    options: ["Option 1", "Option 2", "Option 3"],
  },
};

export const CheckboxField: Story = {
  args: {
    id: "sampleCheckboxField",
    label: "Sample Checkbox Field",
    type: "checkbox",
    required: false,
    labelClassName: "label-class",
    containerClassName: "container-class",
    className: "input-class",
    ...styles,
    options: ["Option 1", "Option 2", "Option 3"],
  },
};

export const DatepickerField: Story = {
  args: {
    id: "sampleDatepickerField",
    label: "Sample Datepicker Field",
    type: "date",
    required: false,
    labelClassName: "label-class",
    containerClassName: "container-class",
    className: "input-class",
    ...styles,
  },
};

export const GroupField: Story = {
  args: {
    id: "sampleGroupField",
    label: "Sample Group Field",
    type: "group",
    required: false,
    labelClassName: "label-class",
    containerClassName: "container-class",
    className: "input-class",
    ...styles,
    fields: [
      {
        id: "sampleInputField1",
        label: "Sample Input Field 1",
        type: "text",
        required: true,
        placeholder: "Enter text here",
        labelClassName: "label-class",
        containerClassName: "container-class",
        className: "input-class",
        ...styles,
      },
      {
        id: "sampleInputField2",
        label: "Sample Input Field 2",
        type: "text",
        required: true,
        placeholder: "Enter text here",
        labelClassName: "label-class",
        containerClassName: "container-class",
        className: "input-class",
        ...styles,
      },
    ],
  },
};
