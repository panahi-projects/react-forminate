import { useFieldEvents } from "@/hooks";
import { FieldIdType } from "@/types";
import { SupportedValueType } from "node:sqlite";
import React from "react";

export interface EventHandlersResult<T = HTMLElement> {
  htmlHandlers: React.HTMLAttributes<T>; // For standard HTML events
  customHandlers: {
    onUpload?: (files: File[], fieldId: FieldIdType) => void;
    onRemove?: (file: File | string, fieldId: FieldIdType) => void;
  };
}

interface BuildFieldEventHandlersParams<T = HTMLInputElement> {
  fieldId: string;
  value: any;
  type?: string;
  onCustomChange?: (e: React.ChangeEvent<T>, ...args: any[]) => void;
  onCustomClick?: (e: React.MouseEvent<T>, ...args: any[]) => void;
  onCustomBlur?: (e: React.FocusEvent<T>, ...args: any[]) => void;
  onCustomFocus?: (e: React.FocusEvent<T>, ...args: any[]) => void;
  onCustomKeyDown?: (e: React.KeyboardEvent<T>, ...args: any[]) => void;
  onCustomKeyUp?: (e: React.KeyboardEvent<T>, ...args: any[]) => void;
  onCustomMouseDown?: (e: React.MouseEvent<T>, ...args: any[]) => void;
  onCustomMouseEnter?: (e: React.MouseEvent<T>, ...args: any[]) => void;
  onCustomMouseLeave?: (e: React.MouseEvent<T>, ...args: any[]) => void;
  onCustomContextMenu?: (e: React.MouseEvent<T>, ...args: any[]) => void;
  onCustomUpload?: (
    files: File[],
    fieldId: string,
    event?: React.SyntheticEvent<T>,
    ...args: any[]
  ) => void;

  onCustomRemove?: (
    file: File | string, // Could be file object or file name/id
    fieldId: string,
    ...args: any[]
  ) => void;
}

export const buildFieldEventHandlers = <T = HTMLInputElement>({
  fieldId,
  value,
  type,
  onCustomChange,
  onCustomClick,
  onCustomBlur,
  onCustomFocus,
  onCustomKeyDown,
  onCustomKeyUp,
  onCustomMouseDown,
  onCustomMouseEnter,
  onCustomMouseLeave,
  onCustomContextMenu,
  onCustomUpload,
  onCustomRemove,
}: BuildFieldEventHandlersParams<T>): EventHandlersResult<T> => {
  const {
    formOptions,
    blurred,
    setBlurred,
    setValue,
    handleCustomEvent,
    setTouched,
    validateField,
  } = useFieldEvents();

  const handleFocus = (e: React.FocusEvent<T>) => {
    setTouched(fieldId, true);
    handleCustomEvent(onCustomFocus, e, fieldId);
  };

  const handleBlur = (e: React.FocusEvent<T>) => {
    setBlurred(fieldId, true);

    if (onCustomBlur) {
      handleCustomEvent(onCustomBlur, e, fieldId);
    }

    // Trigger validation on blur
    setTimeout(() => {
      // Validate on blur if the option is enabled
      if (formOptions?.validateFieldsOnBlur !== false) {
        validateField(fieldId, value);
      }
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<T>) => {
    const newValue =
      type === "number" ? +(e.target as any).value : (e.target as any).value;
    let newFieldValue: SupportedValueType = newValue;

    if (type === "checkbox") {
      const checked = (e.target as any).checked;
      const currentValue = value || [];
      const newValueArray = checked
        ? [...currentValue, newValue]
        : currentValue.filter((item: any) => item !== newValue);

      newFieldValue = newValueArray;
    }

    // Always update value
    setValue(fieldId, newFieldValue);

    // Validate immediately if validateFieldsOnBlur is false [OR] the field is touched once before
    if (formOptions?.validateFieldsOnBlur === false || blurred[fieldId]) {
      validateField(fieldId, newValue);
    }
    handleCustomEvent(onCustomChange, e, fieldId, newFieldValue);
  };

  const handleUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files instanceof FileList ? files : files);
    if (onCustomUpload) {
      onCustomUpload(fileArray, fieldId);
    }
    setValue(fieldId, fileArray);
  };

  const handleRemove = (file: File | string) => {
    if (onCustomRemove) {
      onCustomRemove(file, fieldId);
    }
    // Update form value logic would need current value
  };

  const wrapHandler = (handler: any) => {
    return (e: any) => handleCustomEvent(handler, e, fieldId, value);
  };

  return {
    htmlHandlers: {
      onChange: handleChange,
      onClick: wrapHandler(onCustomClick),
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: wrapHandler(onCustomKeyDown),
      onKeyUp: wrapHandler(onCustomKeyUp),
      onMouseDown: wrapHandler(onCustomMouseDown),
      onMouseEnter: wrapHandler(onCustomMouseEnter),
      onMouseLeave: wrapHandler(onCustomMouseLeave),
      onContextMenu: wrapHandler(onCustomContextMenu),
    },
    customHandlers: {
      onUpload: onCustomUpload ? handleUpload : undefined,
      onRemove: onCustomRemove ? handleRemove : undefined,
    },
  };
};
