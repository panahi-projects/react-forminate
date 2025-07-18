import { FieldTypes } from "@/types";
import { FIELD_COMPONENT_MAP } from "./fieldTypes";

export const preloadFields = async (
  fieldTypes: FieldTypes[]
): Promise<void> => {
  if (typeof window === "undefined") return;

  // Micro-optimization: Check for empty array early
  if (fieldTypes.length === 0) return;

  try {
    const uniqueTypes = Array.from(new Set(fieldTypes)) as FieldTypes[];
    const preloadPromises = [];

    for (const type of uniqueTypes) {
      const loader = FIELD_COMPONENT_MAP[type];
      if (loader) {
        // Start loading without waiting for previous to complete
        preloadPromises.push(loader().catch(() => null));
      }
    }

    await Promise.all(preloadPromises);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Field preloading failed:", error);
    }
  }
};
