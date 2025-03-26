import { FormProvider, useForm } from "../providers/FormProvider";
import { DynamicFormField } from "../DynamicFormField";

interface DynamicFormProps {
  formData: any;
  onSubmit?: (values: any, isValid: boolean) => void;
  isLoading?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  formData,
  onSubmit,
  isLoading = false,
}) => {
  return (
    <FormProvider formSchema={formData}>
      <FormContent
        formData={formData}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </FormProvider>
  );
};

const FormContent: React.FC<DynamicFormProps> = ({
  formData,
  onSubmit,
  isLoading,
}) => {
  const { values, validateForm } = useForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm(formData.fields);
    if (onSubmit) {
      onSubmit(values, isValid);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
        </div>
      )}
      {formData.fields.map((field: any) => (
        <DynamicFormField key={field.id} {...field} />
      ))}
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-primary rounded-md text-white py-2 px-6 w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
