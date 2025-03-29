import { FormProvider, useForm } from "../providers/FormProvider";
import { DynamicFormField } from "../DynamicFormField";
import { FormDataCollection } from "../types";
import styled from "styled-components";

interface DynamicFormProps {
  formData: FormDataCollection;
  onSubmit?: (values: any, isValid: boolean) => void;
  isLoading?: boolean;
}

const StyledSubmitButton = styled.button`
  background-color: #0457aa; /* Green */
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  margin: 12px 0;
`;

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
        <div>
          <div></div>
        </div>
      )}
      {formData.fields.map((field: any) => (
        <DynamicFormField key={field.id} {...field} />
      ))}
      <div>
        <StyledSubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </StyledSubmitButton>
      </div>
    </form>
  );
};

export default DynamicForm;
