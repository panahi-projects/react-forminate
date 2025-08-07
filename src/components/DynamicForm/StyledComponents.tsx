import styled from "styled-components";

export const StyledSubmitButton = styled.button`
  background-color: #0457aa;
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

  &:hover,
  &:focus {
    background-color: #034b94;
    outline: none;
    box-shadow: 0 0 0 3px rgba(4, 87, 170, 0.4);
  }

  &:active {
    background-color: #023b77;
    transform: scale(0.98);
  }
`;
