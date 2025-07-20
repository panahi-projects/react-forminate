import { DynamicOptionsCache, SelectFieldType } from "@/types";

// helpers/dynamicOptionsCache.ts
export const getFieldCache = (field: SelectFieldType): DynamicOptionsCache => {
  if (!field.dynamicOptions) return {};
  if (!field.dynamicOptions._cache) {
    field.dynamicOptions._cache = {};
  }
  return field.dynamicOptions._cache;
};

export const shouldRefetchOptions = (
  field: SelectFieldType,
  currentValues: Record<string, any>
): boolean => {
  const cache = getFieldCache(field);
  const dependsOn = field.dynamicOptions?.dependsOn;
  const cacheTime = field.dynamicOptions?.cacheTime || 30000;

  // Always fetch if forced
  if (field.dynamicOptions?.forceRefresh) {
    field.dynamicOptions.forceRefresh = false;
    return true;
  }

  // First fetch
  if (!cache.lastFetchTime) return true;

  // Cache expired
  if (Date.now() - cache.lastFetchTime > cacheTime) return true;

  // Check dependency changes
  if (dependsOn) {
    const dependencies =
      typeof dependsOn === "string" ? [dependsOn] : dependsOn;
    const hasChanged = dependencies.some((dep) => {
      return currentValues[dep] !== cache.lastValues?.[dep];
    });

    if (hasChanged) return true;
  }

  return false;
};

export const updateFieldCache = (
  field: SelectFieldType,
  currentValues: Record<string, any>
) => {
  const cache = getFieldCache(field);
  const dependsOn = field.dynamicOptions?.dependsOn;

  cache.lastFetchTime = Date.now();

  if (dependsOn) {
    const dependencies =
      typeof dependsOn === "string" ? [dependsOn] : dependsOn;
    cache.lastValues = dependencies.reduce(
      (acc, dep) => {
        acc[dep] = currentValues[dep];
        return acc;
      },
      {} as Record<string, any>
    );
  }
};
