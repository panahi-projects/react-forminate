import { MultiStep } from "@/components/MultiStep";
import { useField } from "@/hooks";
import { MultiStepFieldType, MultiStepRef, StepType } from "@/types";
import React from "react";

const Step1 = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Step 1</h1>
    </div>
  );
};
const Step2 = () => {
  return <div>Step 2</div>;
};
const Step3 = () => {
  return <div>Step 3</div>;
};

const steps: StepType[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    subtitle: "Your contact details",
    component: Step1,
  },
  {
    id: "payment",
    title: "Payment Details",
    subtitle: "Credit card information",
    component: Step2,
  },
  {
    id: "confirmation",
    title: "Confirmation",
    subtitle: "Review and submit",
    component: Step3,
  },
];

/**
 * MultiStepField component - Renders a multi-step form with customizable steps
 */
const MultiStepField: React.FC<MultiStepFieldType> = (props) => {
  const { fieldId, fieldParams, fieldValue, processedProps } = useField(props);
  const multiStepRef = React.useRef<MultiStepRef>(null);

  const handleStepChange = (stepIndex: number) => {
    console.log(`Changed to step ${stepIndex}`);
  };

  const handleComplete = () => {
    console.log("Form completed!");
  };

  const validateStep = (stepIndex: number) => {
    // Add validation logic here
    return true;
  };

  const customNextButton = (
    <button className="custom-next-btn">
      Continue <span>→</span>
    </button>
  );

  return (
    <div id={fieldId} {...fieldParams}>
      <MultiStep
        ref={multiStepRef}
        steps={steps}
        onStepChange={handleStepChange}
        onComplete={handleComplete}
        animationType="slide-horizontal"
        validateStep={validateStep}
        className="my-multi-step"
        fieldId={fieldId}
        type={fieldParams.type}
      />
    </div>
  );
};

MultiStepField.displayName = "MultiStepField";

export default React.memo(MultiStepField);
