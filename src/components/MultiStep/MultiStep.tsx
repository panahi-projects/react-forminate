// MultiStep.tsx
import { MultiStepFieldType, MultiStepRef, StepType } from "@/types";
import React, {
  Suspense,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
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
      enableUrlNavigation = false,
      stepParamName = "step",
      gridTemplateAreas,
      gridTemplateColumns,
      gridTemplateRows,
      gridGap,
    },
    ref
  ) => {
    // Helper function to create grid styles
    const getGridStyles = () => {
      const styles: React.CSSProperties = {};

      if (gridTemplateAreas) {
        styles.gridTemplateAreas = gridTemplateAreas;
      }
      if (gridTemplateColumns) {
        styles.gridTemplateColumns = gridTemplateColumns;
      }
      if (gridTemplateRows) {
        styles.gridTemplateRows = gridTemplateRows;
      }
      if (gridGap) {
        styles.gap = gridGap;
      }

      return styles;
    };

    // Initialize step from URL synchronously if enabled
    const getInitialStep = () => {
      if (enableUrlNavigation && controlledStep === undefined) {
        try {
          const url = new URL(window.location.href);
          const stepFromUrl = url.searchParams.get(stepParamName);
          if (stepFromUrl) {
            const stepIndex = parseInt(stepFromUrl, 10);
            if (
              !isNaN(stepIndex) &&
              stepIndex >= 1 &&
              stepIndex <= steps.length
            ) {
              return stepIndex - 1; // Convert to 0-based for internal use
            }
          }
        } catch (error) {
          console.warn("Error parsing URL for initial step:", error);
        }
      }
      return 0; // This will be step 1 when displayed
    };

    const [internalStep, setInternalStep] = useState(getInitialStep);
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

    // Initialize step from URL on mount
    useEffect(() => {
      if (!enableUrlNavigation || isControlled) return;

      const url = new URL(window.location.href);
      const stepFromUrl = url.searchParams.get(stepParamName);

      if (stepFromUrl) {
        const stepIndex = parseInt(stepFromUrl, 10);
        if (!isNaN(stepIndex) && stepIndex >= 1 && stepIndex <= steps.length) {
          setInternalStep(stepIndex - 1); // Convert to 0-based for internal use
          onStepChange?.(stepIndex - 1);
        }
      } else {
        // If no step in URL, ensure step 1 is properly represented
        url.searchParams.set(stepParamName, "1");
        window.history.replaceState({}, "", url.toString());
      }
    }, [
      enableUrlNavigation,
      isControlled,
      stepParamName,
      steps.length,
      onStepChange,
    ]);

    // URL navigation effect - update URL when step changes
    useEffect(() => {
      if (!enableUrlNavigation) return;

      // Update URL when step changes - always include the step parameter for consistency
      const url = new URL(window.location.href);
      url.searchParams.set(stepParamName, (currentStep + 1).toString()); // Convert to 1-based for URL

      // Update URL without triggering navigation
      window.history.replaceState({}, "", url.toString());
    }, [currentStep, enableUrlNavigation, stepParamName]);

    // Handle browser back/forward navigation
    useEffect(() => {
      if (!enableUrlNavigation || isControlled) return;

      const handlePopState = () => {
        const url = new URL(window.location.href);
        const stepFromUrl = url.searchParams.get(stepParamName);

        if (stepFromUrl) {
          const stepIndex = parseInt(stepFromUrl, 10);
          if (
            !isNaN(stepIndex) &&
            stepIndex >= 1 &&
            stepIndex <= steps.length
          ) {
            setInternalStep(stepIndex - 1); // Convert to 0-based for internal use
            onStepChange?.(stepIndex - 1);
          }
        } else {
          // No step param means step 1
          setInternalStep(0); // This represents step 1 when displayed
          onStepChange?.(0);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }, [
      enableUrlNavigation,
      isControlled,
      stepParamName,
      steps.length,
      onStepChange,
    ]);

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
      <div
        className={`multi-step-container ${className}`}
        style={getGridStyles()}
      >
        {showPagination && (
          <div
            className="multi-step-pagination-container"
            style={{
              gridArea: gridTemplateAreas ? "header" : "header",
            }}
          >
            {PaginationComponent ? (
              <PaginationComponent steps={steps} currentStep={currentStep} />
            ) : (
              <DefaultPagination steps={steps} currentStep={currentStep} />
            )}
          </div>
        )}

        <div
          className="multi-step-content"
          style={{
            gridArea: gridTemplateAreas ? "main" : "content",
          }}
        >
          <div
            className={`multi-step-step-container animation-${animationType}`}
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
        </div>

        {showNavigation && (
          <div
            className="multi-step-navigation"
            style={{
              gridArea: gridTemplateAreas ? "footer" : "footer",
            }}
          >
            {currentStep > 0 ? prevButton || defaultPrevButton : <div />}
            {isLastStep
              ? submitButton || defaultSubmitButton
              : nextButton || defaultNextButton}
          </div>
        )}

        {showAside && (
          <div
            className="multi-step-aside-container"
            style={{
              gridArea: gridTemplateAreas ? "sidebar" : "aside",
            }}
          >
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
      </div>
    );
  }
);

MultiStep.displayName = "MultiStep";

export default MultiStep;
