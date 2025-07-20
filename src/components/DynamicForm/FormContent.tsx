import { useFormActions, useFormValues } from "@/context";
import { DynamicFormType, FormFieldType } from "@/types";
import { DynamicFormField } from "../DynamicFormField";
import { StyledSubmitButton } from "./StyledComponents";

const FormContent: React.FC<DynamicFormType> = ({
  formData,
  onSubmit,
  isLoading,
  submitDetails,
}) => {
  const values = useFormValues();
  const { validateForm } = useFormActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm(formData);
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
          skeleton={formData.options?.skeleton?.component}
          showSkeletonLoading={formData.options?.skeleton?.showSkeletonLoading}
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
