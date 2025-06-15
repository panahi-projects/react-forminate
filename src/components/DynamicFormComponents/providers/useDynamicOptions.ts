import { useRef, useState } from "react";
import {
  FormDataCollectionType,
  GridViewFieldType,
  SelectFieldType,
} from "../types";
import { findFieldById } from "./fieldDependency";

export const useDynamicOptions = (formSchema: FormDataCollectionType) => {
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
    const config = (field as GridViewFieldType | SelectFieldType)
      ?.dynamicOptions;
    if (!config || !config.endpoint) return;

    abortControllers.current[fieldId]?.abort();
    const controller = new AbortController();
    abortControllers.current[fieldId] = controller;

    let url = config.endpoint;
    url = url.replace(
      /\{\{(.*?)\}\}/g,
      (_: string, key: string) => allValues[key] ?? ""
    );

    const searchParams = new URLSearchParams();

    if (config.params) {
      for (const [key, ref] of Object.entries(config.params)) {
        const val = allValues[ref as string];
        if (val !== undefined) searchParams.append(key, val);
      }
    }

    const paginationCfg = config.pagination;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? paginationCfg?.limit ?? 10;
    const startPage = paginationCfg?.startPage ?? 1;
    const pageMode = paginationCfg?.pageMode ?? "page";

    if (pageMode === "skip") {
      const skipKey = paginationCfg?.skipKey || "skip";
      const skip = (page - startPage) * limit;
      searchParams.set(skipKey, String(skip));
    } else {
      const pageKey = paginationCfg?.pageKey || "page";
      searchParams.set(pageKey, String(page));
    }

    const limitKey = paginationCfg?.limitKey || "limit";
    searchParams.set(limitKey, String(limit));

    const finalUrl = searchParams.toString()
      ? `${url}${url.includes("?") ? "&" : "?"}${searchParams.toString()}`
      : url;

    const attemptFetch = async (): Promise<any> => {
      if (paginationCfg?.maxPage && page > paginationCfg.maxPage) {
        throw new Error("Max page limit reached");
      }
      const response = await fetch(finalUrl, {
        method: config.method || "GET",
        headers: config.headers || {},
        signal: controller.signal,
      });
      return response.json();
    };

    try {
      let data = await attemptFetch().catch(() => {
        console.warn(`[Retry] Failed fetching ${fieldId}, retrying...`);
        return attemptFetch();
      });
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

      // Save metadata if required
      // if (paginationCfg?.metadataPath) {
      //   let meta = await attemptFetch(); // don't retry again
      //   for (const key of paginationCfg.metadataPath.split(".")) {
      //     meta = meta?.[key];
      //   }
      //   setDynamicOptions((prev) => ({
      //     ...prev,
      //     [`${fieldId}__meta`]: meta,
      //   }));
      // }
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
