import React from "react";

export const isConvertableToNumber = (value: number | string) => {
  if (typeof value === "number") return true;
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    //@ts-ignore
    return !isNaN(trimmedValue) && !isNaN(parseFloat(trimmedValue));
  }
  return false;
};
export const customStringify = (obj: unknown): string => {
  const seen = new WeakSet();

  return JSON.stringify(obj, (_, value) => {
    // Handle circular references
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }

    // Handle functions
    if (typeof value === "function") {
      return `[Function: ${value.name || "anonymous"}]`;
    }

    // Handle React elements specifically
    if (React.isValidElement(value)) {
      return "[ReactElement]";
    }
    return value;
  });
};
