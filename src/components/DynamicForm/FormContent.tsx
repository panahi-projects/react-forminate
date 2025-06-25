import { useForm } from "@/context";
import { DynamicFormType, FormFieldType } from "@/types";
import { DynamicFormField } from "../DynamicFormField";
import { StyledSubmitButton } from "./StyledComponents";

const FormContent: React.FC<DynamicFormType> = ({
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
      {formData.fields.map((field: FormFieldType) => (
        <DynamicFormField
          key={field.fieldId}
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
