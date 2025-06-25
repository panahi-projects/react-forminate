import {
  ValidationPatternType,
  MessageType,
  MinType,
  MaxType,
  MinLengthType,
  MaxLengthType,
  ValidationCustomRuleType,
} from "./primitiveTypes";

export type DateTimePatternType =
  // 📅 ISO 8601 Date Formats
  | `${number}-${number}-${number}` // e.g. 2025-06-06 (YYYY-MM-DD)
  | `${number}-${number}-${number}T${number}:${number}:${number}Z` // e.g. 2025-06-06T14:30:00Z
  | `${number}-${number}-${number}T${number}:${number}` // e.g. 2025-06-06T14:30
  | `${number}-${number}-${number}T${number}:${number}:${number}` // e.g. 2025-06-06T14:30:00
  | `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z` // e.g. 2025-06-06T14:30:00.000Z

  // 📅 Slash-separated Dates
  | `${number}/${number}/${number}` // e.g. 06/06/2025 or 2025/06/06

  // 📅 Dot-separated Dates
  | `${number}.${number}.${number}` // e.g. 06.06.2025 or 2025.06.06

  // 📅 Dates with Month Names
  | `${string} ${number}, ${number}` // e.g. June 6, 2025
  | `${number} ${string} ${number}` // e.g. 6 June 2025

  // 📅 Compact and Partial Formats
  | `${number}${number}${number}` // e.g. 20250606
  | `${number}-${number}` // e.g. 2025-06 (year and month)

  // ⏰ Time Only Formats
  | `${number}:${number}` // e.g. 14:30
  | `${number}:${number}:${number}` // e.g. 14:30:00

  // 📅 Full Date-Time Combinations (non-ISO)
  | `${number}/${number}/${number} ${number}:${number}` // e.g. 06/06/2025 14:30
  | `${number}-${number}-${number} ${number}:${number}` // e.g. 2025-06-06 14:30
  | `${number}-${number}-${number} ${number}:${number}:${number}` // e.g. 2025-06-06 14:30:00
  | `${number}.${number}.${number} ${number}:${number}` // e.g. 06.06.2025 14:30
  | `${string} ${number}, ${number} ${number}:${number}`; // e.g. June 6, 2025 14:30

export interface ValidationRule {
  pattern?: ValidationPatternType;
  message?: MessageType;
  min?: MinType;
  max?: MaxType;
  minLength?: MinLengthType;
  maxLength?: MaxLengthType;
  custom?: ValidationCustomRuleType;
  type?: string; // Optional type to specify the validation type
  minDate?: DateTimePatternType;
  maxDate?: DateTimePatternType;
  minItems?: number;
  maxItems?: number;
}

export interface ValidationResponseType {
  isValid: boolean;
  message?: string;
}
