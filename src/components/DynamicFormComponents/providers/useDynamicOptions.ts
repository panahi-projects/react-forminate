import { useRef, useState } from "react";
import { FormDataCollection } from "../types";
import { findFieldById } from "./fieldDependency";

export const useDynamicOptions = (formSchema: FormDataCollection) => {
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );
  const abortControllers = useRef<Record<string, AbortController>>({});

  const fetchDynamicOptions = async (
    fieldId: string,
    allValues: Record<string, any> = {},
    pagination?: { page?: number; limit?: number }
  ) => {
    const field = findFieldById(fieldId, formSchema.fields);
    const config = field?.dynamicOptions;
    if (!config || !config.endpoint) return;

    // Abort any previous request for this field
    abortControllers.current[fieldId]?.abort();
    const controller = new AbortController();
    abortControllers.current[fieldId] = controller;

    let url = config.endpoint;

    // Replace placeholders like {{albumId}}
    url = url.replace(
      /\{\{(.*?)\}\}/g,
      (_: string, key: string) => allValues[key] ?? ""
    );

    const searchParams = new URLSearchParams();

    // Handle custom query params
    if (config.params) {
      for (const [key, ref] of Object.entries(config.params)) {
        const val = allValues[ref as string];
        if (val !== undefined) searchParams.append(key, val);
      }
    }

    // Handle pagination
    if (pagination?.page !== undefined)
      searchParams.set("page", String(pagination.page));
    if (pagination?.limit !== undefined)
      searchParams.set("limit", String(pagination.limit));

    const finalUrl = searchParams.toString()
      ? `${url}${url.includes("?") ? "&" : "?"}${searchParams.toString()}`
      : url;

    const attemptFetch = async (): Promise<any> => {
      const response = await fetch(finalUrl, {
        method: config.method || "GET",
        headers: config.headers || {},
        signal: controller.signal,
      });
      return response.json();
    };

    try {
      let data;
      try {
        data = await attemptFetch();
      } catch (err) {
        // Retry once if first attempt fails
        console.warn(`[Retry] Failed fetching ${fieldId}, retrying...`);
        data = await attemptFetch();
      }

      // Traverse nested response path (e.g. 'data.results')
      if (config.resultPath) {
        for (const key of config.resultPath.split(".")) {
          data = data?.[key];
        }
      }

      const transformed = config.transformResponse
        ? config.transformResponse(data)
        : data;

      setDynamicOptions((prev) => ({
        ...prev,
        [fieldId]: transformed,
      }));
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log(`[Aborted] Fetch for ${fieldId} was cancelled.`);
      } else {
        console.error(`Failed to fetch dynamicOptions for ${fieldId}`, err);
      }
    }
  };

  return { dynamicOptions, fetchDynamicOptions };
};
