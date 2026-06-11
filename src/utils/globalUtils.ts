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
/**
 * Schedules a low-priority task without assuming `requestIdleCallback` exists.
 *
 * `requestIdleCallback` is unavailable in SSR (e.g. Next.js server render),
 * in jsdom/test environments, and in some browsers (notably older Safari).
 * Calling it directly throws a ReferenceError. This wrapper uses it when
 * present and falls back to `setTimeout`, and is a no-op outside the browser.
 *
 * @returns a function that cancels the scheduled task.
 */
export const scheduleIdleTask = (callback: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const ric = (
    window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (handle: number) => void;
    }
  ).requestIdleCallback;

  if (typeof ric === "function") {
    const handle = ric(callback);
    return () => window.cancelIdleCallback?.(handle);
  }

  const timeout = window.setTimeout(callback, 1);
  return () => window.clearTimeout(timeout);
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
