import {
  ValidationPatternType,
  MessageType,
  MinType,
  MaxType,
  MinLengthType,
  MaxLengthType,
  ValidationCustomRuleType,
} from "./primitiveTypes";

export interface ValidationRule {
  pattern?: ValidationPatternType;
  message?: MessageType;
  min?: MinType;
  max?: MaxType;
  minLength?: MinLengthType;
  maxLength?: MaxLengthType;
  custom?: ValidationCustomRuleType;
}
