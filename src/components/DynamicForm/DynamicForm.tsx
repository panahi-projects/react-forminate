//External libraries & tools import
import { useContext } from "react";

//Global internal imports
import { FormProvider as DefaultFormProvider, FormContext } from "@/context";
import { DynamicFormType } from "@/types";

//Relative internal import
import FormContent from "./FormContent";

const DynamicForm: React.FC<DynamicFormType> = ({
  formId,
  formData,
  onSubmit,
  isLoading = false,
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
    />
  ) : (
    <Provider formSchema={formData} formId={formId}>
      <FormContent
        formId={formId}
        formData={formData}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Provider>
  );
};

export default DynamicForm;
