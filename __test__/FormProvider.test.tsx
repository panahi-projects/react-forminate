import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { FormProvider } from "../src/context";
import { FormDataCollectionType } from "../src";

const schema: FormDataCollectionType = {
  formId: "outer-form",
  fields: [{ fieldId: "name", type: "text", label: "Name" }],
};

// Regression coverage for the Rules-of-Hooks fix: the "already nested in a
// form context" early-return used to sit in the middle of the hook list. A
// nested FormProvider must render its children without throwing a hook-order
// error.
describe("FormProvider nesting", () => {
  it("renders children as-is when nested inside an existing form context", () => {
    render(
      <FormProvider formSchema={schema}>
        <FormProvider formSchema={schema}>
          <div data-testid="nested-child">nested content</div>
        </FormProvider>
      </FormProvider>
    );

    expect(screen.getByTestId("nested-child")).toBeInTheDocument();
    expect(screen.getByText("nested content")).toBeInTheDocument();
  });

  it("mounts a standalone provider without throwing (requestIdleCallback SSR-safety)", () => {
    expect(() =>
      render(
        <FormProvider formSchema={schema}>
          <div data-testid="child">ok</div>
        </FormProvider>
      )
    ).not.toThrow();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
