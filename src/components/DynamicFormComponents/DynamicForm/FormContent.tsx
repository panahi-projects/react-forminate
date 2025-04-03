import { DynamicFormField } from "../DynamicFormField";
import { useForm } from "../providers/formContext";
import { DynamicFormProps } from "../types";
import { StyledSubmitButton } from "./StyledComponents";

const FormContent: React.FC<DynamicFormProps> = ({
  formData,
  onSubmit,
  isLoading,
  submitDetails,
  showSkeletonLoading = true,
  skeleton,
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
    <form onSubmit={handleSubmit} role="form">
      {isLoading && <div>{/* Loading animation goes here... */}</div>}
      {formData.fields.map((field: any) => (
        <DynamicFormField
          key={field.id}
          {...field}
          skeleton={skeleton}
          showSkeletonLoading={showSkeletonLoading}
        />
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
