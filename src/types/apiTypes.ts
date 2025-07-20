import {
  APIMethodType,
  APIDependsOnType,
  APIParamsType,
  APIHeadersType,
  APITransformResponseType,
  APIResultPathType,
  APIfetchOnInitType,
  APIEndpointType,
  APIForceRefreshType,
} from "./primitiveTypes";

// API Pagination
export type APIPaginationType = {
  limit?: number;
  maxPage?: number;
  pageKey?: string; // default: "page"
  limitKey?: string; // default: "limit"
  skipKey?: string; // optional, if using skip
  pageMode?: "page" | "skip"; // determines if using page or skip
  startPage?: number; // e.g., 0 or 1
  metadataPath?: string; // path to access metadata like total pages
};

export interface DynamicOptionsCache {
  lastValues?: Record<string, any>;
  lastFetchTime?: number;
}

export interface dynamicOptionsType {
  endpoint: APIEndpointType; // can contain placeholders like {{albumId}}
  method?: APIMethodType; // default to GET
  dependsOn?: APIDependsOnType; // support multiple dependencies
  params?: APIParamsType; // query params as fieldId references
  headers?: APIHeadersType; // optional headers
  transformResponse?: APITransformResponseType;
  resultPath?: APIResultPathType; // e.g., 'data.results' to extract nested result
  fetchOnInit?: APIfetchOnInitType; // to fetch options on mount
  pagination?: APIPaginationType;
  forceRefresh?: APIForceRefreshType;
  _cache?: DynamicOptionsCache;
  cacheTime?: number; // milliseconds (default: 30000)
}
