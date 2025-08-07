import { CustomChangeEvent } from "@/types";

export const createCustomEvent = <T = any>(
  value: T,
  name: string,
  type: string = "change"
): CustomChangeEvent<T> => {
  const nativeEvent = new Event(type, { bubbles: true });
  return {
    target: { value, name, type },
    currentTarget: { value, name },
    nativeEvent,
    preventDefault: () => nativeEvent.preventDefault(),
    stopPropagation: () => nativeEvent.stopPropagation(),
    isDefaultPrevented: () => nativeEvent.defaultPrevented,
    isPropagationStopped: () => false,
    persist: () => {},
    type,
    timeStamp: Date.now(),
  };
};
