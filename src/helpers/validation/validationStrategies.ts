import { ValidationResponseType, ValidationRule } from "@/types";
import { isConvertableToNumber } from "@/utils";

interface ValidationStrategy {
  validate(
    value: any,
    rule: ValidationRule,
    context?: any
  ): ValidationResponseType | Promise<ValidationResponseType>;
}

abstract class BaseValidationStrategy implements ValidationStrategy {
  abstract validate(
    value: any,
    rule: ValidationRule,
    context?: any
  ): ValidationResponseType | Promise<ValidationResponseType>;

  protected isEmpty(value: any): boolean {
    return value === undefined || value === null || value === "";
  }

  protected isString(value: any): boolean {
    return typeof value === "string";
  }

  protected isNumber(value: any): boolean {
    return typeof value === "number" || isConvertableToNumber(value);
  }

  protected isArray(value: any): boolean {
    return Array.isArray(value);
  }

  protected isDate(value: any): boolean {
    return !isNaN(new Date(value).getTime());
  }

  protected createResponse(
    isValid: boolean,
    message?: string
  ): ValidationResponseType {
    return { isValid, message: isValid ? undefined : message };
  }
}

class TypeValidationStrategy extends BaseValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (this.isEmpty(value)) return this.createResponse(true);

    const typeChecks: Record<string, () => boolean> = {
      string: () => this.isString(value),
      number: () => this.isNumber(value),
      array: () => this.isArray(value),
      date: () => this.isDate(value),
    };

    if (rule.type && typeChecks[rule.type] && !typeChecks[rule.type]()) {
      return this.createResponse(false, `Value must be a ${rule.type}.`);
    }
    return this.createResponse(true);
  }
}

class PasswordValidationStrategy extends BaseValidationStrategy {
  private readonly defaultSpecialChars = /[!@#$%^&*(),.?":{}|<>]/;

  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (this.isEmpty(value)) return this.createResponse(true);
    if (!this.isString(value))
      return this.createResponse(false, "Value must be a string.");

    const requirements = {
      minLength: rule.minLength ?? 8,
      requireUpperCase: rule.requireUpperCase ?? true,
      requireLowerCase: rule.requireLowerCase ?? true,
      requireNumber: rule.requireNumber ?? true,
      requireSpecialChar: rule.requireSpecialChar ?? true,
      specialChars: rule.specialCharsPattern ?? this.defaultSpecialChars,
    };

    // Convert specialChars to RegExp if it's a string
    const specialCharsRegex =
      typeof requirements.specialChars === "string"
        ? new RegExp(requirements.specialChars)
        : requirements.specialChars;

    const checks = {
      length: value.length >= requirements.minLength,
      upperCase: !requirements.requireUpperCase || /[A-Z]/.test(value),
      lowerCase: !requirements.requireLowerCase || /[a-z]/.test(value),
      number: !requirements.requireNumber || /\d/.test(value),
      specialChar:
        !requirements.requireSpecialChar || specialCharsRegex.test(value),
    };

    if (Object.values(checks).every(Boolean)) return this.createResponse(true);

    const messages = [
      !checks.length && `at least ${requirements.minLength} characters`,
      !checks.upperCase && "one uppercase letter",
      !checks.lowerCase && "one lowercase letter",
      !checks.number && "one number",
      !checks.specialChar && "one special character",
    ].filter(Boolean);

    return this.createResponse(
      false,
      rule.message || `Password must contain ${messages.join(", ")}.`
    );
  }
}

class EqualToValidationStrategy extends BaseValidationStrategy {
  validate(
    value: any,
    rule: ValidationRule,
    context?: any
  ): ValidationResponseType {
    if (this.isEmpty(value)) return this.createResponse(true);

    const compareValue =
      typeof rule.equalTo === "function" ? rule.equalTo(context) : rule.equalTo;

    if (compareValue === undefined) return this.createResponse(true);

    const caseSensitive = rule.caseSensitive ?? true;
    const isValid = caseSensitive
      ? value === compareValue
      : String(value).toLowerCase() === String(compareValue).toLowerCase();

    return this.createResponse(isValid, rule.message || "Values do not match.");
  }
}

class EmailValidationStrategy extends BaseValidationStrategy {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (this.isEmpty(value)) return this.createResponse(true);
    if (!this.isString(value))
      return this.createResponse(false, "Value must be a string.");

    return this.createResponse(
      this.emailRegex.test(value),
      rule.message || "Invalid email format."
    );
  }
}

class UrlValidationStrategy extends BaseValidationStrategy {
  private readonly patterns = {
    ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ipPort:
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(\d{1,5})$/,
    absolute: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
    relative: /^([\/\w.-]+)+(\/)?(\?[\w.%-=&]*)?(#[\w-]*)?$/,
    protocolRelative: /^\/\/[\w.-]+\.[a-z]{2,}(\/.*)?$/,
    localhost: /^(https?:\/\/)?localhost(:\d+)?([\/\w.-]*)*\/?$/,
    ipUrl: /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(:\d+)?([\/\w.-]*)*\/?$/,
  };

  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (this.isEmpty(value)) return this.createResponse(true);
    if (!this.isString(value))
      return this.createResponse(false, "Value must be a string.");

    const trimmedValue = value.trim();

    // Handle IP validation
    if (rule.validateAs === "ip" || this.patterns.ip.test(trimmedValue)) {
      return this.createResponse(
        this.patterns.ip.test(trimmedValue),
        rule.message || "Invalid IP address format (e.g., 192.168.1.1)"
      );
    }

    // Handle IP:Port validation
    if (
      rule.validateAs === "ipPort" ||
      this.patterns.ipPort.test(trimmedValue)
    ) {
      if (!this.patterns.ipPort.test(trimmedValue)) {
        return this.createResponse(
          false,
          rule.message || "Invalid IP:Port format (e.g., 192.168.1.1:8080)"
        );
      }

      const port = parseInt(trimmedValue.split(":")[1]);
      if (port < 1 || port > 65535) {
        return this.createResponse(
          false,
          rule.message || "Port must be between 1 and 65535"
        );
      }
      return this.createResponse(true);
    }

    // Handle URL validation
    const isAbsolute =
      this.patterns.absolute.test(trimmedValue) ||
      this.patterns.protocolRelative.test(trimmedValue) ||
      this.patterns.ipUrl.test(trimmedValue);
    const isRelative = this.patterns.relative.test(trimmedValue);
    const isHttps = trimmedValue.startsWith("https://");
    const hasProtocol = /^https?:\/\//i.test(trimmedValue);

    if (rule.requireAbsolute && !isAbsolute) {
      return this.createResponse(
        false,
        rule.message || "Absolute URL with http:// or https:// is required."
      );
    }

    if (rule.requireHttps && (!isHttps || !hasProtocol)) {
      return this.createResponse(
        false,
        rule.message || "HTTPS URL is required."
      );
    }

    if (rule.allowRelative === false && isRelative) {
      return this.createResponse(
        false,
        rule.message || "Relative paths are not allowed."
      );
    }

    const isValid =
      isAbsolute ||
      isRelative ||
      this.patterns.localhost.test(trimmedValue) ||
      this.patterns.ipUrl.test(trimmedValue);

    return this.createResponse(isValid, rule.message || "Invalid URL format");
  }
}

class PatternValidationStrategy extends BaseValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (!this.isString(value))
      return this.createResponse(false, "Value must be a string.");
    if (!rule.pattern) return this.createResponse(true);

    return this.createResponse(
      new RegExp(rule.pattern).test(value),
      rule.message || "Pattern validation failed."
    );
  }
}

class LengthValidationStrategy extends BaseValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (!this.isString(value))
      return this.createResponse(false, "Value must be a string.");

    const checks = {
      min: rule.minLength !== undefined && value.length >= rule.minLength,
      max: rule.maxLength !== undefined && value.length <= rule.maxLength,
    };

    if (
      (rule.minLength === undefined || checks.min) &&
      (rule.maxLength === undefined || checks.max)
    ) {
      return this.createResponse(true);
    }

    const messages = [
      rule.minLength !== undefined &&
        !checks.min &&
        `minimum ${rule.minLength} characters`,
      rule.maxLength !== undefined &&
        !checks.max &&
        `maximum ${rule.maxLength} characters`,
    ].filter(Boolean);

    return this.createResponse(
      false,
      rule.message || `Length must be ${messages.join(" and ")}.`
    );
  }
}

class NumberValidationStrategy extends BaseValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (!this.isNumber(value))
      return this.createResponse(false, "Value must be a number.");

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const checks = {
      min: rule.min !== undefined && numValue >= rule.min,
      max: rule.max !== undefined && numValue <= rule.max,
    };

    if (
      (rule.min === undefined || checks.min) &&
      (rule.max === undefined || checks.max)
    ) {
      return this.createResponse(true);
    }

    const messages = [
      rule.min !== undefined && !checks.min && `minimum ${rule.min}`,
      rule.max !== undefined && !checks.max && `maximum ${rule.max}`,
    ].filter(Boolean);

    return this.createResponse(
      false,
      rule.message || `Value must be ${messages.join(" and ")}.`
    );
  }
}

class DateValidationStrategy extends BaseValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    const dateValue = new Date(value);
    if (!this.isDate(dateValue))
      return this.createResponse(false, "Invalid date format.");

    const checks = {
      min: rule.minDate !== undefined && dateValue >= new Date(rule.minDate),
      max: rule.maxDate !== undefined && dateValue <= new Date(rule.maxDate),
    };

    if (
      (rule.minDate === undefined || checks.min) &&
      (rule.maxDate === undefined || checks.max)
    ) {
      return this.createResponse(true);
    }

    const messages = [
      rule.minDate !== undefined && !checks.min && `after ${rule.minDate}`,
      rule.maxDate !== undefined && !checks.max && `before ${rule.maxDate}`,
    ].filter(Boolean);

    return this.createResponse(
      false,
      rule.message || `Date must be ${messages.join(" and ")}.`
    );
  }
}

class ArrayValidationStrategy extends BaseValidationStrategy {
  validate(value: any, rule: ValidationRule): ValidationResponseType {
    if (!this.isArray(value))
      return this.createResponse(false, "Value must be an array.");

    const checks = {
      min: rule.minItems !== undefined && value.length >= rule.minItems,
      max: rule.maxItems !== undefined && value.length <= rule.maxItems,
    };

    if (
      (rule.minItems === undefined || checks.min) &&
      (rule.maxItems === undefined || checks.max)
    ) {
      return this.createResponse(true);
    }

    const messages = [
      rule.minItems !== undefined &&
        !checks.min &&
        `minimum ${rule.minItems} items`,
      rule.maxItems !== undefined &&
        !checks.max &&
        `maximum ${rule.maxItems} items`,
    ].filter(Boolean);

    return this.createResponse(
      false,
      rule.message || `Array must contain ${messages.join(" and ")}.`
    );
  }
}

class CustomValidationStrategy extends BaseValidationStrategy {
  async validate(
    value: any,
    rule: ValidationRule
  ): Promise<ValidationResponseType> {
    if (typeof rule.custom !== "function") return this.createResponse(true);

    try {
      const result = rule.custom(value);
      const isValid = result instanceof Promise ? await result : result;
      return this.createResponse(
        isValid,
        isValid ? undefined : rule.message || "Custom validation failed."
      );
    } catch (error) {
      console.error(error);
      return this.createResponse(false, "Validation error occurred");
    }
  }
}

class RequiredValidationStrategy extends BaseValidationStrategy {
  validate(value: any): ValidationResponseType {
    const isValid =
      !this.isEmpty(value) && (!this.isArray(value) || value.length > 0);
    return this.createResponse(isValid, "This field is required.");
  }
}

export class ValidationEngine {
  private static instance: ValidationEngine;
  private strategies: Record<string, ValidationStrategy> = {};

  private constructor() {
    this.registerDefaultStrategies();
  }

  private registerDefaultStrategies() {
    this.registerStrategy("type", new TypeValidationStrategy());
    this.registerStrategy("password", new PasswordValidationStrategy());
    this.registerStrategy("equalTo", new EqualToValidationStrategy());
    this.registerStrategy("email", new EmailValidationStrategy());
    this.registerStrategy("url", new UrlValidationStrategy());
    this.registerStrategy("pattern", new PatternValidationStrategy());
    this.registerStrategy("length", new LengthValidationStrategy());
    this.registerStrategy("number", new NumberValidationStrategy());
    this.registerStrategy("date", new DateValidationStrategy());
    this.registerStrategy("array", new ArrayValidationStrategy());
    this.registerStrategy("custom", new CustomValidationStrategy());
    this.registerStrategy("required", new RequiredValidationStrategy());
  }

  private determineRuleType(rule: ValidationRule): string {
    if (rule.type) return rule.type;

    const typeMappings: Record<string, string> = {
      minLength: "length",
      maxLength: "length",
      min: "number",
      max: "number",
      minDate: "date",
      maxDate: "date",
      minItems: "array",
      maxItems: "array",
      pattern: "pattern",
      custom: "custom",
      equalTo: "equalTo",
      email: "email",
      url: "url",
      password: "password",
      required: "required",
    };

    for (const [key, strategy] of Object.entries(typeMappings)) {
      if (rule[key as keyof ValidationRule] !== undefined) return strategy;
    }

    return "type";
  }

  public registerStrategy(name: string, strategy: ValidationStrategy): void {
    this.strategies[name] = strategy;
  }

  public async validate(
    value: any,
    rules: ValidationRule[],
    context?: any
  ): Promise<ValidationResponseType> {
    if (!rules?.length) return { isValid: true };

    for (const rule of rules) {
      const ruleType = this.determineRuleType(rule);
      const strategy = this.strategies[ruleType];

      if (strategy) {
        const result = await Promise.resolve(
          strategy.validate(value, rule, context)
        );
        if (!result.isValid) return result;
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

export const validationEngine = ValidationEngine.getInstance();
