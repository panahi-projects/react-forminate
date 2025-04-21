import { useContext } from "react";
import { FormProvider as DefaultFormProvider } from "../providers/FormProvider";
import { DynamicFormType } from "../types";
import FormContent from "./FormContent";
import { FormContext } from "../providers/formContext";

const DynamicForm: React.FC<DynamicFormType> = ({
  formId,
  formData,
  onSubmit,
  isLoading = false,
  submitDetails,
  customProvider,
  showSkeletonLoading = true,
  skeleton,
}) => {
  const existingContext = useContext(FormContext);
  const Provider = customProvider || DefaultFormProvider; // Use the custom provider if available

  return existingContext ? (
    <FormContent
      formId={formId}
      formData={formData}
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitDetails={submitDetails}
      showSkeletonLoading={showSkeletonLoading}
      skeleton={skeleton}
    />
  ) : (
    <Provider formSchema={formData} formId={formId}>
      <FormContent
        formId={formId}
        formData={formData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitDetails={submitDetails}
        showSkeletonLoading={showSkeletonLoading}
        skeleton={skeleton}
      />
    </Provider>
  );
};

export default DynamicForm;
