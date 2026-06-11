import { afterEach, describe, expect, it, vi } from "vitest";
import { scheduleIdleTask } from "../src/utils";

// Regression coverage for the SSR/jsdom crash: `requestIdleCallback` is not
// defined in Node, jsdom, or during server-side rendering, so calling it
// directly throws. `scheduleIdleTask` must degrade gracefully instead.
describe("scheduleIdleTask", () => {
  afterEach(() => {
    vi.useRealTimers();
    delete (window as any).requestIdleCallback;
    delete (window as any).cancelIdleCallback;
  });

  it("falls back to setTimeout when requestIdleCallback is unavailable", () => {
    delete (window as any).requestIdleCallback; // ensure the fallback path
    vi.useFakeTimers();
    const cb = vi.fn();

    const cancel = scheduleIdleTask(cb);

    expect(typeof cancel).toBe("function");
    expect(cb).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("does not invoke the callback if cancelled before it fires", () => {
    delete (window as any).requestIdleCallback;
    vi.useFakeTimers();
    const cb = vi.fn();

    const cancel = scheduleIdleTask(cb);
    cancel();
    vi.runAllTimers();

    expect(cb).not.toHaveBeenCalled();
  });

  it("uses requestIdleCallback when present and cancels via cancelIdleCallback", () => {
    const ric = vi.fn((fn: () => void) => {
      fn();
      return 42;
    });
    const cic = vi.fn();
    (window as any).requestIdleCallback = ric;
    (window as any).cancelIdleCallback = cic;
    const cb = vi.fn();

    const cancel = scheduleIdleTask(cb);

    expect(ric).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledTimes(1);
    cancel();
    expect(cic).toHaveBeenCalledWith(42);
  });

  it("never throws and always returns a canceller (SSR-safe)", () => {
    expect(() => scheduleIdleTask(() => {})()).not.toThrow();
  });
});
