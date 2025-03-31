import { DynamicFormField } from "../DynamicFormField";
import { useForm } from "../providers/FormProvider";
import { DynamicFormProps } from "../types";
import { StyledSubmitButton } from "./StyledComponents";

const FormContent: React.FC<DynamicFormProps> = ({
  formData,
  onSubmit,
  isLoading,
  submitDetails,
}) => {
  const { values, validateForm } = useForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm(formData);
    if (onSubmit) {
      onSubmit(values, isValid);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isLoading && <div>{/* Loading animation goes here... */}</div>}
      {formData.fields.map((field: any) => (
        <DynamicFormField key={field.id} {...field} />
      ))}
      {submitDetails?.visibility !== false && (
        <div
          className={submitDetails?.containerClassName}
          style={submitDetails?.containerStyles}
        >
          <StyledSubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : submitDetails?.text || "Submit"}
          </StyledSubmitButton>
        </div>
      )}
    </form>
  );
};

export default FormContent;
