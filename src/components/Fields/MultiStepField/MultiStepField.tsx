import { MultiStep } from "@/components/MultiStep";
import { useField } from "@/hooks";
import { MultiStepFieldType, MultiStepRef } from "@/types";
import React, { useCallback, useMemo } from "react";

/**
 * MultiStepField component - Renders a multi-step form with customizable steps
 */
const MultiStepField: React.FC<MultiStepFieldType> = (props) => {
  const {
    fieldId,
    fieldParams,
    fieldValue,
    processedProps,
    eventHandlers,
    setValue,
  } = useField<MultiStepFieldType>(props);

  const multiStepRef = React.useRef<MultiStepRef>(null);

  // Get current step from field value or default to 0 (which displays as step 1)
  const currentStep = useMemo(() => {
    return typeof fieldValue === "number" ? fieldValue : 0;
  }, [fieldValue]);

  // Handle step changes
  const handleStepChange = useCallback(
    (stepIndex: number) => {
      setValue(fieldId, stepIndex);

      // Call custom step change handler if provided
      if (processedProps.onStepChange) {
        processedProps.onStepChange(stepIndex);
      }

      // Call custom event handler if provided
      if (eventHandlers.customHandlers?.onChangeItems) {
        eventHandlers.customHandlers.onChangeItems([stepIndex], fieldId);
      }
    },
    [fieldId, setValue, processedProps, eventHandlers, fieldValue]
  );

  // Handle step completion
  const handleStepComplete = useCallback(
    (step: number) => {
      if (processedProps.onStepComplete) {
        processedProps.onStepComplete(step);
      }
    },
    [processedProps]
  );

  // Handle step skip
  const handleStepSkip = useCallback(
    (step: number) => {
      if (processedProps.onStepSkip) {
        processedProps.onStepSkip(step);
      }
    },
    [processedProps]
  );

  // Handle form completion
  const handleComplete = useCallback(() => {
    if (processedProps.onComplete) {
      processedProps.onComplete();
    }

    // Call custom event handler if provided
    if (eventHandlers.customHandlers?.onChangeItems) {
      eventHandlers.customHandlers.onChangeItems([currentStep], fieldId);
    }
  }, [processedProps, eventHandlers, fieldId, fieldValue, currentStep]);

  // Step validation
  const validateStep = useCallback(
    (stepIndex: number) => {
      if (processedProps.validateStep) {
        return processedProps.validateStep(stepIndex);
      }
      return true;
    },
    [processedProps]
  );

  // Memoize grid layout props
  const gridLayoutProps = useMemo(() => {
    const layout: any = {};

    if (processedProps.gridTemplateAreas) {
      layout.gridTemplateAreas = processedProps.gridTemplateAreas;
    }
    if (processedProps.gridTemplateColumns) {
      layout.gridTemplateColumns = processedProps.gridTemplateColumns;
    }
    if (processedProps.gridTemplateRows) {
      layout.gridTemplateRows = processedProps.gridTemplateRows;
    }
    if (processedProps.gridGap) {
      layout.gridGap = processedProps.gridGap;
    }

    return layout;
  }, [
    processedProps.gridTemplateAreas,
    processedProps.gridTemplateColumns,
    processedProps.gridTemplateRows,
    processedProps.gridGap,
  ]);

  return (
    <div id={fieldId} {...fieldParams}>
      <MultiStep
        ref={multiStepRef}
        steps={processedProps.steps || []}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onComplete={handleComplete}
        onStepComplete={handleStepComplete}
        onStepSkip={handleStepSkip}
        showNavigation={processedProps.showNavigation ?? true}
        showPagination={processedProps.showPagination ?? true}
        showAside={processedProps.showAside ?? true}
        asideCollapsible={processedProps.asideCollapsible ?? false}
        animationType={processedProps.animationType || "slide-horizontal"}
        nextButton={processedProps.nextButton}
        prevButton={processedProps.prevButton}
        submitButton={processedProps.submitButton}
        paginationComponent={processedProps.paginationComponent}
        asideComponent={processedProps.asideComponent}
        validateStep={validateStep}
        className={processedProps.className || ""}
        enableUrlNavigation={processedProps.enableUrlNavigation ?? false}
        stepParamName={processedProps.stepParamName || "step"}
        {...gridLayoutProps}
      />
    </div>
  );
};

MultiStepField.displayName = "MultiStepField";

export default React.memo(MultiStepField);
