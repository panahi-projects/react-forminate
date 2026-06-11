import { beforeEach, describe, expect, it } from "vitest";
import { FieldProcessor } from "../src/utils";
import { FormDataCollectionType } from "../src";

const makeSchema = (fieldId: string): FormDataCollectionType => ({
  formId: "test-form",
  fields: [{ fieldId, type: "text" }],
});

describe("FieldProcessor cache", () => {
  const processor = FieldProcessor.getInstance();

  beforeEach(() => {
    processor.clearCache();
  });

  it("is a singleton", () => {
    expect(FieldProcessor.getInstance()).toBe(processor);
  });

  it("caches a processed field and reuses the entry for the same key", () => {
    const schema = makeSchema("a");
    processor.process(schema.fields[0], {}, schema);
    expect(processor.cacheSize).toBe(1);

    // Same field + same values => same cache key, no growth.
    processor.process(schema.fields[0], {}, schema);
    expect(processor.cacheSize).toBe(1);
  });

  it("never grows beyond the bounded max size (FIFO eviction)", () => {
    for (let i = 0; i < 1100; i++) {
      const schema = makeSchema(`field-${i}`);
      processor.process(schema.fields[0], {}, schema);
    }
    // maxCacheSize is 1000; the cache must not grow unbounded.
    expect(processor.cacheSize).toBe(1000);
  });

  it("clearCache empties the cache", () => {
    const schema = makeSchema("a");
    processor.process(schema.fields[0], {}, schema);
    expect(processor.cacheSize).toBeGreaterThan(0);

    processor.clearCache();
    expect(processor.cacheSize).toBe(0);
  });
});
