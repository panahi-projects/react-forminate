import { css } from "styled-components";

// Base styles for all form elements
export const baseFormStyles = css`
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  transition:
    border-color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  width: 100%;
  box-sizing: border-box;
  margin: 0.25rem 0;

  &:focus {
    outline: none;
    border-color: #646cff;
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

// Checkbox and Radio buttons
export const checkboxRadioStyles = css`
  width: auto;
  height: 1rem;
  width: 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0;
  vertical-align: middle;
`;
