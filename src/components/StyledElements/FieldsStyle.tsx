import styled from "styled-components";
import { errorStyles } from "./ErrorStyle";
import { baseFormStyles, checkboxRadioStyles } from "./BaseFormStyle";
import { InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  $hasError?: boolean;
}
interface StyledSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  $hasError?: boolean;
}

// Input fields
const InputBase = styled.input<StyledInputProps>`
  ${baseFormStyles}
  height: 2.5rem;

  &[type="color"] {
    height: 3rem;
    padding: 0.25rem;
  }

  &[type="date"],
  &[type="time"],
  &[type="datetime-local"],
  &[type="month"],
  &[type="week"] {
    padding: 0.5rem;
  }
`;

// Select dropdown
export const SelectBase = styled.select<StyledSelectProps>`
  ${baseFormStyles}
  height: 2.5rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2rem;
`;

// Textarea
const TextareaBase = styled.textarea`
  ${baseFormStyles}
  min-height: 6rem;
  resize: vertical;
`;

export const Input = styled(InputBase)<{ $hasError?: boolean }>`
  ${({ $hasError }) => $hasError && errorStyles}
`;

export const Select = styled(SelectBase)<{ $hasError?: boolean }>`
  ${({ $hasError }) => $hasError && errorStyles}
`;

export const Textarea = styled(TextareaBase)<{ $hasError?: boolean }>`
  ${({ $hasError }) => $hasError && errorStyles}
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  ${checkboxRadioStyles}
`;

export const RadioContainer = styled.div<{ $layout: "inline" | "column" }>`
  display: flex;
  flex-direction: ${(props) => (props.$layout === "inline" ? "row" : "column")};
  gap: ${(props) => (props.$layout === "inline" ? "24px" : "8px")};
  flex-wrap: wrap;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const RadioInput = styled.input.attrs({ type: "radio" })`
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin: 0;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:checked {
    border-color: #646cff;
    background-color: white;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #646cff;
      transform: translate(-50%, -50%);
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RadioLabelText = styled.span`
  font-size: 14px;
  color: #333;
`;
