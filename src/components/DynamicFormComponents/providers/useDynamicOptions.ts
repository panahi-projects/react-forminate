import { useState } from "react";
import { FormDataCollection } from "../types";
import { findFieldById } from "./fieldDependency";

export const useDynamicOptions = (formSchema: FormDataCollection) => {
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );

  const fetchDynamicOptions = async (
    fieldId: string,
    allValues: Record<string, any> = {}
  ) => {
    const field = findFieldById(fieldId, formSchema.fields);
    const config = field?.dynamicOptions;
    if (!config || !config.endpoint) return;

    let url = config.endpoint;

    // Replace placeholders in endpoint
    url = url.replace(/\{\{(.*?)\}\}/g, function (_match: string, key: string) {
      return allValues[key] ?? "";
    });

    // Append query params
    if (config.params) {
      const searchParams = new URLSearchParams();
      for (const [key, ref] of Object.entries(config.params)) {
        const val = allValues[ref as string];
        if (val !== undefined) searchParams.append(key, val);
      }
      if (searchParams.toString()) {
        url += (url.includes("?") ? "&" : "?") + searchParams.toString();
      }
    }

    try {
      const response = await fetch(url, {
        method: config.method || "GET",
        headers: config.headers || {},
      });

      let data = await response.json();

      // Traverse resultPath if provided (e.g., 'data.items')
      if (config.resultPath) {
        config.resultPath.split(".").forEach((key: string) => {
          data = data?.[key];
        });
      }

      const transformed = config.transformResponse
        ? config.transformResponse(data)
        : data;

      setDynamicOptions((prev) => ({
        ...prev,
        [fieldId]: transformed,
      }));
    } catch (err) {
      console.error(`Failed to fetch dynamicOptions for ${fieldId}`, err);
    }
  };

  return { dynamicOptions, fetchDynamicOptions };
};
