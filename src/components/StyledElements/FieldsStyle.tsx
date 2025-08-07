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

// MultiSelect Styled Components
export const MultiSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const InputContainer = styled.div<{
  $hasError?: boolean;
  $isOpen?: boolean;
}>`
  ${baseFormStyles}
  ${({ $hasError }) => $hasError && errorStyles}
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  padding: 8px 12px;
  min-height: 40px;
  cursor: pointer;
  border-color: ${({ $isOpen }) => $isOpen && "#0066cc"};
  overflow: hidden;
`;

export const SelectedTag = styled.div`
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
`;

export const RemoveTag = styled.span`
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  margin-left: auto;
  transition: transform 0.2s;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  &:after {
    content: "▼";
    font-size: 0.8em;
  }
`;

export const ClearAllButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.8em;
  margin-left: auto;
  padding: 2px 4px;
  &:hover {
    color: #333;
  }
`;

export const Dropdown = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000; // Increased z-index
  margin-top: 4px;
`;

export const SearchContainer = styled.div`
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  &:focus {
    border-color: #0066cc;
  }
`;

export const OptionItem = styled.div<{
  $isSelected: boolean;
  $isFocused: boolean;
}>`
  padding: 8px 12px;
  cursor: pointer;
  background: ${({ $isSelected, $isFocused }) =>
    $isSelected ? "#f0f7ff" : $isFocused ? "#f5f5f5" : "transparent"};
  color: ${({ $isSelected }) => ($isSelected ? "#0066cc" : "inherit")};
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: #f5f5f5;
  }
`;

export const Placeholder = styled.span`
  color: #999;
`;
