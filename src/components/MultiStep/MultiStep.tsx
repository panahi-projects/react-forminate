// MultiStep.tsx
import { MultiStepFieldType, MultiStepRef, StepType } from "@/types";
import React, {
  Suspense,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import "./MultiStep.css";

const MultiStep = React.forwardRef<MultiStepRef, MultiStepFieldType>(
  (
    {
      steps,
      currentStep: controlledStep,
      onStepChange,
      onComplete,
      showNavigation = true,
      showPagination = true,
      showAside = true,
      asideCollapsible = false,
      animationType = "slide-horizontal",
      nextButton,
      prevButton,
      submitButton,
      paginationComponent: PaginationComponent,
      asideComponent: AsideComponent,
      validateStep,
      className = "",
    },
    ref
  ) => {
    const [internalStep, setInternalStep] = useState(0);
    const [asideCollapsed, setAsideCollapsed] = useState(false);
    const [direction, setDirection] = useState<"forward" | "backward">(
      "forward"
    );

    const isControlled = controlledStep !== undefined;
    const currentStep = isControlled ? controlledStep : internalStep;
    const isLastStep = currentStep === steps.length - 1;

    const goToStep = useCallback(
      (index: number) => {
        if (index < 0 || index >= steps.length) return;

        // Validate current step if needed
        if (validateStep && !validateStep(currentStep)) return;

        setDirection(index > currentStep ? "forward" : "backward");

        if (!isControlled) {
          setInternalStep(index);
        }

        onStepChange?.(index);
      },
      [currentStep, isControlled, onStepChange, validateStep, steps.length]
    );

    const goToNext = useCallback(() => {
      if (isLastStep) {
        onComplete?.();
      } else {
        goToStep(currentStep + 1);
      }
    }, [currentStep, isLastStep, goToStep, onComplete]);

    const goToPrev = useCallback(() => {
      if (currentStep > 0) {
        goToStep(currentStep - 1);
      }
    }, [currentStep, goToStep]);

    useImperativeHandle(
      ref,
      () => ({
        goToNext,
        goToPrev,
        goToStep: (index: number) => goToStep(index),
        currentStep,
      }),
      [goToNext, goToPrev, goToStep, currentStep]
    );

    // Default buttons
    const defaultNextButton = (
      <button className="multi-step-btn multi-step-btn-next" onClick={goToNext}>
        Next
      </button>
    );

    const defaultPrevButton = (
      <button
        className="multi-step-btn multi-step-btn-prev"
        onClick={goToPrev}
        disabled={currentStep === 0}
      >
        Previous
      </button>
    );

    const defaultSubmitButton = (
      <button
        className="multi-step-btn multi-step-btn-submit"
        onClick={onComplete}
      >
        Submit
      </button>
    );

    // Default pagination
    const DefaultPagination = ({
      steps,
      currentStep,
    }: {
      steps: StepType[];
      currentStep: number;
    }) => (
      <div className="multi-step-pagination">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`multi-step-pagination-item ${index === currentStep ? "active" : ""} ${index < currentStep ? "completed" : ""}`}
            onClick={() => goToStep(index)}
          >
            <div className="multi-step-pagination-indicator">
              {index < currentStep ? (
                <span className="multi-step-pagination-check">✓</span>
              ) : (
                <span className="multi-step-pagination-number">
                  {index + 1}
                </span>
              )}
            </div>
            <div className="multi-step-pagination-info">
              <div className="multi-step-pagination-title">{step.title}</div>
              {step.subtitle && (
                <div className="multi-step-pagination-subtitle">
                  {step.subtitle}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );

    // Default aside
    const DefaultAside = ({
      steps,
      currentStep,
      goToStep,
      disabled,
    }: {
      steps: StepType[];
      currentStep: number;
      goToStep: (index: number) => void;
      disabled?: boolean;
    }) => (
      <div className="multi-step-aside">
        <div className="multi-step-aside-header">
          <h3>Navigation</h3>
          {asideCollapsible && (
            <button
              className="multi-step-aside-toggle"
              onClick={() => setAsideCollapsed(!asideCollapsed)}
            >
              {asideCollapsed ? "→" : "←"}
            </button>
          )}
        </div>
        {!asideCollapsed && (
          <div className="multi-step-aside-items">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`multi-step-aside-item ${index === currentStep ? "active" : ""} ${disabled ? "disabled" : ""}`}
                onClick={() => !disabled && goToStep(index)}
              >
                {step.icon && (
                  <div className="multi-step-aside-icon">{step.icon}</div>
                )}
                <div className="multi-step-aside-content">
                  <div className="multi-step-aside-title">{step.title}</div>
                  {step.subtitle && (
                    <div className="multi-step-aside-subtitle">
                      {step.subtitle}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    const StepComponent = steps[currentStep].component;

    return (
      <div className={`multi-step-container ${className}`}>
        {showAside && (
          <div className="multi-step-aside-container">
            {AsideComponent ? (
              <AsideComponent
                steps={steps}
                currentStep={currentStep}
                goToStep={goToStep}
                disabled={!!validateStep && !validateStep(currentStep)}
              />
            ) : (
              <DefaultAside
                steps={steps}
                currentStep={currentStep}
                goToStep={goToStep}
                disabled={!!validateStep && !validateStep(currentStep)}
              />
            )}
          </div>
        )}

        <div className="multi-step-content">
          {showPagination && (
            <div className="multi-step-pagination-container">
              {PaginationComponent ? (
                <PaginationComponent steps={steps} currentStep={currentStep} />
              ) : (
                <DefaultPagination steps={steps} currentStep={currentStep} />
              )}
            </div>
          )}

          <div
            className={`multi-step-step-container animation-${animationType} direction-${direction}`}
          >
            <Suspense
              fallback={<div className="multi-step-loading">Loading...</div>}
            >
              {React.isValidElement(StepComponent) ? (
                StepComponent
              ) : (
                <StepComponent />
              )}
            </Suspense>
          </div>

          {showNavigation && (
            <div className="multi-step-navigation">
              {currentStep > 0 ? prevButton || defaultPrevButton : <div />}
              {isLastStep
                ? submitButton || defaultSubmitButton
                : nextButton || defaultNextButton}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MultiStep.displayName = "MultiStep";

export default MultiStep;
