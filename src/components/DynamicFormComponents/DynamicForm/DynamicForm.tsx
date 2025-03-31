import { useContext } from "react";
import { FormProvider as DefaultFormProvider } from "../providers/FormProvider";
import { DynamicFormProps } from "../types";
import FormContent from "./FormContent";
import { FormContext } from "../providers/formContext";

const DynamicForm: React.FC<DynamicFormProps> = ({
  formId,
  formData,
  onSubmit,
  isLoading = false,
  submitDetails,
  customProvider,
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
    />
  ) : (
    <Provider formSchema={formData} formId={formId}>
      <FormContent
        formId={formId}
        formData={formData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitDetails={submitDetails}
      />
    </Provider>
  );
};

export default DynamicForm;
