import { useFieldEvents } from "@/hooks";
import React from "react";

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
}: BuildFieldEventHandlersParams<T>) => {
  const { setValue, handleCustomEvent } = useFieldEvents();

  const handleChange = (e: React.ChangeEvent<T>) => {
    const newValue =
      type === "number" ? +(e.target as any).value : (e.target as any).value;
    if (type === "checkbox") {
      const checked = (e.target as any).checked;
      const currentValue = value || [];
      const newValueArray = checked
        ? [...currentValue, newValue]
        : currentValue.filter((item: any) => item !== newValue);
      setValue(fieldId, newValueArray);
      handleCustomEvent(onCustomChange, e, fieldId, newValueArray);
    } else {
      setValue(fieldId, newValue);
      handleCustomEvent(onCustomChange, e, fieldId, newValue);
    }
  };

  const wrapHandler = (handler: any) => {
    return (e: any) => handleCustomEvent(handler, e, fieldId, value);
  };

  return {
    onChange: handleChange,
    onClick: wrapHandler(onCustomClick),
    onBlur: wrapHandler(onCustomBlur),
    onFocus: wrapHandler(onCustomFocus),
    onKeyDown: wrapHandler(onCustomKeyDown),
    onKeyUp: wrapHandler(onCustomKeyUp),
    onMouseDown: wrapHandler(onCustomMouseDown),
    onMouseEnter: wrapHandler(onCustomMouseEnter),
    onMouseLeave: wrapHandler(onCustomMouseLeave),
    onContextMenu: wrapHandler(onCustomContextMenu),
  };
};
