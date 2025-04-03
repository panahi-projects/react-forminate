import type { Meta, StoryObj } from "@storybook/react";
import Example from "./Example";

const meta: Meta<typeof Example> = {
  title: "CheckboxField",
  component: Example,
};

export default meta;
type Story = StoryObj<typeof Example>;

const fieldStyles: Record<string, React.CSSProperties> = {
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
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "5px",
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
  itemsStyles: {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    padding: "5px",
    marginTop: "5px",
    fontFamily: "sans-serif",
    fontSize: "14px",
    color: "#4b4b4b",
  },
};

export const SampleField: Story = {
  args: {
    id: "exampleCheckbox",
    label: "Example Checkbox",
    type: "checkbox",
    options: ["Option 1", "Option 2", "Option 3"],
    containerStyles: fieldStyles.containerStyles,
    itemsStyles: fieldStyles.itemsStyles,
    labelStyles: fieldStyles.labelStyles,
  },
};
