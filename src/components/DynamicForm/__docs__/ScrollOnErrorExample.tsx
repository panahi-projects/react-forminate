import React from "react";
import { DynamicForm, FormDataCollectionType } from "../../..";

const ScrollOnErrorExample: React.FC = () => {
  const formData: FormDataCollectionType = {
    formId: "scroll-error-example",
    title: "Form with Auto-Scroll on Validation Errors",
    description:
      "This form demonstrates the scrollOnErrorValidation feature. Try submitting without filling required fields to see the auto-scroll behavior.",
    options: {
      scrollOnErrorValidation: true, // Enable auto-scroll to first error
      validateFieldsOnBlur: true,
    },
    fields: [
      {
        fieldId: "firstName",
        type: "text",
        label: "First Name",
        required: true,
        containerClassName: "field-spacing",
      },
      {
        fieldId: "lastName",
        type: "text",
        label: "Last Name",
        required: true,
        containerClassName: "field-spacing",
      },
      {
        fieldId: "email",
        type: "email",
        label: "Email Address",
        required: true,
        containerClassName: "field-spacing",
      },
      {
        fieldId: "phone",
        type: "tel",
        label: "Phone Number",
        required: true,
        containerClassName: "field-spacing",
      },
      {
        fieldId: "company",
        type: "text",
        label: "Company",
        required: false,
        containerClassName: "field-spacing",
      },
      {
        fieldId: "message",
        type: "textarea",
        label: "Message",
        required: true,
        containerClassName: "field-spacing",
      },
      {
        fieldId: "terms",
        type: "checkbox",
        label: "I agree to the terms and conditions",
        required: true,
        containerClassName: "field-spacing",
      },
    ],
  };

  const handleSubmit = (values: any, isValid: boolean) => {
    if (isValid) {
      console.log("Form submitted successfully:", values);
      alert("Form submitted successfully! Check the console for values.");
    } else {
      console.log("Form has validation errors");
      // The form will automatically scroll to the first error field
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Scroll on Error Validation Example</h1>
      <p>
        This form demonstrates the <code>scrollOnErrorValidation</code> feature.
        When you submit the form with validation errors, it will automatically
        scroll to the first field that has an error.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <h3>Features:</h3>
        <ul>
          <li>✅ Auto-scroll to first error field</li>
          <li>✅ Smooth scrolling animation</li>
          <li>✅ Automatic focus on the error field</li>
          <li>✅ Configurable via form options</li>
        </ul>
      </div>

      <DynamicForm formData={formData} onSubmit={handleSubmit} />

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h4>How to enable:</h4>
        <pre
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {`// In your form options
options: {
  scrollOnErrorValidation: true, // Enable auto-scroll
  // ... other options
}`}
        </pre>
      </div>
    </div>
  );
};

export default ScrollOnErrorExample;
