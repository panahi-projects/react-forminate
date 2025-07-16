import { ValidationResponseType, ValidationRule } from "@/types";
import { isConvertableToNumber } from "@/utils";

interface ValidationStrategy {
  validate(
    value: any,
    rule: ValidationRule
  ): ValidationResponseType | Promise<ValidationResponseType>;
}

class PatternValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (typeof value !== "string") {
      return { isValid: false, message: "Value must be a string." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.pattern === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const regex = new RegExp(rule.pattern || "");
    const isValid = regex.test(value);
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || "Pattern validation failed.",
    };
  }
}
class MinLengthValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (typeof value !== "string") {
      return { isValid: false, message: "Value must be a string." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.minLength === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const isValid = value.length >= rule.minLength;
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || `Minimum length is ${rule.minLength}.`,
    };
  }
}
class MaxLengthValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (typeof value !== "string") {
      return { isValid: false, message: "Value must be a string." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.maxLength === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const isValid = value.length <= rule.maxLength;
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || `Maximum length is ${rule.maxLength}.`,
    };
  }
}

class MinNumberValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (isConvertableToNumber(value) === false) {
      return { isValid: false, message: "Value must be a number." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.min === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const isValid = numValue >= rule.min;
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || `Minimum value is ${rule.min}`,
    };
  }
}

class MaxNumberValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (isConvertableToNumber(value) === false) {
      return { isValid: false, message: "Value must be a number." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.max === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const isValid = numValue <= rule.max;
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || `Maximum value is ${rule.max}`,
    };
  }
}

class RangeValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (isConvertableToNumber(value) === false) {
      return { isValid: false, message: "Value must be a number." };
    }

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    let isValid = true;

    // Check min if defined
    if (rule.min !== undefined && numValue < rule.min) {
      isValid = false;
    }

    // Check max if defined
    if (rule.max !== undefined && numValue > rule.max) {
      isValid = false;
    }

    return {
      isValid,
      message: isValid ? undefined : rule.message,
    };
  }
}

class CustomValidationStrategy implements ValidationStrategy {
  async validate(
    value: any,
    rule: ValidationRule
  ): Promise<ValidationResponseType> {
    if (typeof rule.custom !== "function") {
      return { isValid: true };
    }

    const result = rule.custom(value);

    if (result instanceof Promise) {
      try {
        const isValid = await result;
        return {
          isValid,
          message: isValid
            ? undefined
            : rule.message || "Custom validation failed.",
        };
      } catch (error) {
        console.error(error);
        return {
          isValid: false,
          message: "Validation error occurred",
        };
      }
    }

    return {
      isValid: result,
      message: result ? undefined : rule.message || "Custom validation failed.",
    };
  }
}

class RequiredValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    const isValid =
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value.length !== 0;
    return {
      isValid,
      message: isValid ? undefined : rule.message || "This field is required.",
    };
  }
}

class MinDateValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    let dateValue;
    try {
      dateValue = new Date(value);
    } catch (err) {
      return { isValid: false, message: "Date format is not valid." };
    }

    if (!(dateValue instanceof Date)) {
      return { isValid: false, message: "Value must be a date." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.minDate === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const isValid = dateValue >= new Date(rule.minDate);
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || `Date must be after ${rule.minDate}.`,
    };
  }
}

class MaxDateValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    let dateValue;
    try {
      dateValue = new Date(value);
    } catch (err) {
      return { isValid: false, message: "Date format is not valid." };
    }

    if (!(dateValue instanceof Date)) {
      return { isValid: false, message: "Value must be a date." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.maxDate === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const isValid = dateValue <= new Date(rule.maxDate);
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || `Date must be before ${rule.maxDate}.`,
    };
  }
}

class DateRangeValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    let dateValue;
    try {
      dateValue = new Date(value);
    } catch (err) {
      return { isValid: false, message: "Date format is not valid." };
    }

    if (!(dateValue instanceof Date)) {
      return { isValid: false, message: "Value must be a date." };
    }
    let isValid = true;

    // Check minDate if defined
    if (rule.minDate !== undefined) {
      const minDate = new Date(rule.minDate);
      if (dateValue < minDate) {
        isValid = false;
      }
    }

    // Check maxDate if defined
    if (rule.maxDate !== undefined) {
      const maxDate = new Date(rule.maxDate);
      if (dateValue > maxDate) {
        isValid = false;
      }
    }

    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message ||
          `Date must be between ${rule.minDate} and ${rule.maxDate}.`,
    };
  }
}

class MinItemsValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (!Array.isArray(value)) {
      return { isValid: false, message: "Value must be an array." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.minItems === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const isValid = value.length >= rule.minItems;
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || `Minimum items required is ${rule.minItems}.`,
    };
  }
}

class MaxItemsValidationStrategy implements ValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (!Array.isArray(value)) {
      return { isValid: false, message: "Value must be an array." };
    }
    // ✅ Only apply rule if it's defined
    if (rule.maxItems === undefined) {
      return { isValid: true }; // Or throw an error if it's required in this context
    }
    const isValid = value.length <= rule.maxItems;
    return {
      isValid,
      message: isValid
        ? undefined
        : rule.message || `Maximum items allowed is ${rule.maxItems}.`,
    };
  }
}

export class ValidationEngine {
  private strategies: Record<string, ValidationStrategy> = {};
  private static instance: ValidationEngine;

  private constructor() {
    this.strategies = {};
    this.registerDefaultStrategies();
  }

  private registerDefaultStrategies() {
    this.registerStrategy("pattern", new PatternValidationStrategy());
    this.registerStrategy("minLength", new MinLengthValidationStrategy());
    this.registerStrategy("maxLength", new MaxLengthValidationStrategy());
    this.registerStrategy("min", new MinNumberValidationStrategy());
    this.registerStrategy("max", new MaxNumberValidationStrategy());
    this.registerStrategy("range", new RangeValidationStrategy());
    this.registerStrategy("custom", new CustomValidationStrategy());
    this.registerStrategy("required", new RequiredValidationStrategy());
    this.registerStrategy("minDate", new MinDateValidationStrategy());
    this.registerStrategy("maxDate", new MaxDateValidationStrategy());
    this.registerStrategy("dateRange", new DateRangeValidationStrategy());
    this.registerStrategy("minItems", new MinItemsValidationStrategy());
    this.registerStrategy("maxItems", new MaxItemsValidationStrategy());
  }

  private determineRuleType(rule: ValidationRule): string {
    // If rule has explicit type, use that
    if (rule.type) return rule.type;

    // Check for range validation (both min and max)
    if (rule.min !== undefined && rule.max !== undefined) return "range";

    // Check for date range validation (both minDate and maxDate)
    if (rule.minDate !== undefined && rule.maxDate !== undefined)
      return "dateRange";

    // Otherwise infer from rule properties
    if (rule.pattern) return "pattern";
    if (rule.minLength !== undefined) return "minLength";
    if (rule.maxLength !== undefined) return "maxLength";
    if (rule.min !== undefined) return "min";
    if (rule.max !== undefined) return "max";
    if (rule.custom) return "custom";
    if (rule.minDate) return "minDate";
    if (rule.maxDate) return "maxDate";
    if (rule.minItems !== undefined) return "minItems";
    if (rule.maxItems !== undefined) return "maxItems";

    return "unknown";
  }

  public registerStrategy(name: string, strategy: ValidationStrategy): void {
    this.strategies[name] = strategy;
  }

  public async validate(
    value: any,
    rules: ValidationRule[]
  ): Promise<ValidationResponseType> {
    if (!rules || rules.length === 0) {
      return { isValid: true };
    }

    for (const rule of rules) {
      const ruleType = this.determineRuleType(rule);
      const strategy = this.strategies[ruleType];

      if (strategy) {
        const validationResult = strategy.validate(value, rule);

        // Handle both sync and async results
        const result =
          validationResult instanceof Promise
            ? await validationResult
            : validationResult;

        if (!result.isValid) {
          return result;
        }
      }
    }

    return { isValid: true };
  }

  public static getInstance(): ValidationEngine {
    if (!ValidationEngine.instance) {
      ValidationEngine.instance = new ValidationEngine();
    }
    return ValidationEngine.instance;
  }
}

// Singleton instance export for easy use
export const validationEngine = ValidationEngine.getInstance();
