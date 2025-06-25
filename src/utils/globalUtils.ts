export const isConvertableToNumber = (value: number | string) => {
  if (typeof value === "number") return true;
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    //@ts-ignore
    return !isNaN(trimmedValue) && !isNaN(parseFloat(trimmedValue));
  }
  return false;
};
