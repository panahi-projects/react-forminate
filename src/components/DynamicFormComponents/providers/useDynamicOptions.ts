import { useState } from "react";
import { FormDataCollection } from "../types";
import { findFieldById } from "./fieldDependency";

export const useDynamicOptions = (formSchema: FormDataCollection) => {
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );
  const fetchDynamicOptions = async (fieldId: string, value: string) => {
    const field = findFieldById(fieldId, formSchema.fields);
    if (!field || !field.dynamicOptions) return;

    const { dependsOn, endpoint } = field.dynamicOptions;
    if (!dependsOn) return;

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          endpoint +
          `?${dependsOn}=${value}`
      );
      if (response?.ok) {
        const data = await response.json();
        setDynamicOptions((prev) => ({
          ...prev,
          [fieldId]: data,
        }));
      } else {
        console.log("Failed to fetch dynamic options");
      }
    } catch (err: any) {
      console.error("Error fetching dynamic options:", err);
    }
  };
  return { dynamicOptions, fetchDynamicOptions };
};
