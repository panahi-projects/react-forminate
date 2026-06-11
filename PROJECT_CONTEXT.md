# Project Context — react-forminate

> Onboarding map for Claude. Basis: `develop` @ `95cec02`, package `1.1.0-beta.15`, generated 2026-06-11.
> Refresh if `package.json` deps/version drift, new top-level dirs appear, or the field/hook architecture below stops matching the code.

## What it is

`react-forminate` is a **published npm library** (not an app): a schema-driven dynamic form engine for React + TypeScript. You hand it a JSON schema (`formId` + `fields[]`) and it renders a fully functional form with validation, conditional visibility, dynamic (API-driven) options, file uploads, grid/flex layout, and multi-form support. Authored by Saeed Panahi (MIT). Docs site: https://react-forminate.netlify.app/, repo: github.com/panahi-projects/react-forminate.

Consumers use it like:
```tsx
import { DynamicForm } from "react-forminate";
<DynamicForm formData={schema} onSubmit={(values, isValid) => ...} />
```

## Stack & tooling

- **Language:** TypeScript 5.8 (strict, `noUnusedLocals/Parameters`), ESM (`"type": "module"`), target ES2020.
- **UI:** React ≥18 as a **peerDependency** (externalized from the bundle). Only runtime dep: `react-loading-skeleton`.
- **Build:** Vite 6 library mode (`vite build` + `tsc`). Outputs CJS (`dist/index.cjs.js`) + ESM (`dist/index.es.js`) + types (`dist/index.d.ts`) + CSS. `vite-plugin-dts` for declarations; gzip + brotli compression plugins.
- **Test:** Vitest 3 + Testing Library + jsdom. Tests live in top-level `__test__/` (note: `vite.config.ts` `test.exclude` blocks `src/**`, so tests run from `__test__/`, and `setupTests.ts` is the setup file). `npm test` uses `--passWithNoTests`.
- **Docs/dev harness:** Storybook 8 (`*.stories.tsx` + `*.mdx` under `__docs__/` folders next to components).
- **Quality gates:** ESLint 9 (flat config `eslint.config.js`) + Prettier. Husky + lint-staged on commit (`format` + `lint`, and `test` for non-component changes).
- **Path alias:** `@/` → `src/` (configured in both `tsconfig.json` and `vite.config.ts`). Import via `@/types`, `@/hooks`, etc.

Scripts: `build`, `test` / `test-watch` / `test:ui`, `storybook`, `lint`, `format`, `analyze` (bundle visualizer).

## Architecture

The public entry is [src/index.ts](src/index.ts), re-exporting `context`, `components`, `DynamicForm`, `hooks`, `types`, and `validationEngine`.

**Render pipeline:**
`DynamicForm` → (wraps in) `FormProvider` → `FormContent` → maps `fields[]` → `DynamicFormField` (per field) → looks up component in a **lazy-loaded registry** → wraps in `FieldWrapper` → renders the concrete field (`InputField`, `SelectField`, …).

- **[DynamicForm](src/components/DynamicForm/DynamicForm.tsx)** — top component. If already inside a form context, skips re-providing. Accepts a `customProvider`.
- **[FormProvider](src/context/FormProvider.tsx)** — the heart. Holds all state (`values`, `errors`, `touched`, `blurred`), wires validation, debounced updates (500ms), dynamic-option fetching, dependency tracking, and an `Observer` for cross-field notifications. Exposes state through **four split contexts** (`FormValuesContext`, `FormActionsContext`, `FormErrorsContext`, `FormMetaContext`) **plus** a legacy combined `FormContext` for backwards compat — splitting minimizes re-renders.
- **[FormRegistryProvider](src/context/FormRegistryProvider.tsx)** — optional outer provider enabling **multi-form control**: each `FormProvider` registers its context under `formId`, so hooks can target any form by id.
- **[DynamicFormField](src/components/DynamicFormField/DynamicFormField.tsx)** — the field-type registry (`fieldComponents` map, all `React.lazy`). Exposes **`registerField(type, component)` / `unregisterField(type)`** — the public plugin extension point for custom field types. Heavily memoized with a custom comparator; renders skeletons via `<Suspense>`.

**Field-processing pipeline (the "computed props" system):**
Schema props can be static **or** dynamic. A prop can be a `ComputedValue` (`{ fn: (ctx) => value, dependsOn: [...] }`) or legacy function form. [PropertyProcessor](src/helpers/propertyProcessor.ts) resolves these against current form values; [FieldProcessor](src/utils/fieldProcessorUtils.ts) (a **singleton with a serialization-based cache** keyed by fieldId + dependency values) processes whole fields recursively. Processable props: `label, required, disabled, visibility, className, options, placeholder, validation, requiredMessage, content`. The [useFieldProcessor](src/hooks/useFieldProcessor.ts) hook surfaces processed props to components.

**Validation** — [src/helpers/validation/](src/helpers/validation/) uses a **Strategy pattern**. [ValidationEngine](src/helpers/validation/validationStrategies.ts) is a singleton registry of strategies (`required, type, password, equalTo, email, url, pattern, length, number, date, array, custom`); `validateField`/`validateForm` in [validation.ts](src/helpers/validation/validation.ts) prepare rules and skip hidden/disabled/empty-non-required fields. Custom strategies can be registered. `validateForm` recurses into nested `fields`.

**Visibility** — `shouldShowField` (in validation.ts) supports boolean, function, `ComputedValue`, and declarative `{ dependsOn, condition, value }` objects with a rich operator set (`equals, not_equals, greater_than, contains, in, …`).

## Layout / src map

```
src/
  index.ts                 public entry (re-exports everything)
  components/
    DynamicForm/           top-level form + FormContent (submit, loading, layout grid/flex)
    DynamicFormField/      field-type registry + lazy dispatch + plugin hooks
    FieldWrapper/          label/error/description/grid-offset wrapper (CSS module)
    Fields/                one folder per field type (Input, Select, Radio, Checkbox,
                           DatePicker, GridView, Group, Container, Textarea, Spacer,
                           InputFile, Content, MultiSelect, Button) — each index.ts + .tsx
    StyledElements/        default-styled primitives (Input, etc.) + FieldStyles.css
    ui/                    SkeletonComponent
  context/                 FormProvider, FormRegistryProvider, FormRegistryContext
  helpers/                 propertyProcessor, validation/, observer, caches, init/default-value
  hooks/                   formHooks (public useForm* hooks), useOptimizedField,
                           useDynamicField, useFieldProcessor, useDynamicOptions,
                           useDebouncedCallback, useField, useFieldEvents
  types/                   split by concern: primitiveTypes, fieldTypes, formTypes,
                           apiTypes, functionTypes, validationsTypes, global.d.ts
  utils/                   field lookup/processing, events, preload, formUtils, globalUtils
  constants/               shared constants (ARRAY_FIELD_TYPES, REACT_NODE_PROPS, …)
```

## Public API surface (what consumers import)

- **Components:** `DynamicForm`, `DynamicFormField`, `FieldWrapper`, field components, `FormRegistryProvider`, `FormProvider`.
- **Plugin hooks:** `registerField` / `unregisterField` (add custom field types).
- **Hooks** ([formHooks.ts](src/hooks/formHooks.ts)) — all accept an optional `formId` to target a specific registered form:
  `useFormValues`, `useFormValue`, `useFormActions`, `useFormErrors`, `useFormError`, `useFormMeta`, `useForm` (legacy combined), `useFormTouched`, `useFormBlurred`, `useFormSchema`, `useFormOptions`, `useFormDynamicOptions`, `useFormObserver`, `useFormFieldSchema`, `useShouldShowField`.
- **Engine:** `validationEngine` (register custom strategies).
- **Types:** everything from `@/types`.

## Domain vocabulary

- **Field schema** — one entry in `fields[]`; has `fieldId` (unique), `type`, and type-specific props. Container/group types nest a `fields[]`.
- **ComputedValue / computed prop** — `{ fn, dependsOn }` making a prop reactive to other field values.
- **Dynamic options** — select/gridview options fetched from an `endpoint` (`dynamicOptions`), with `fetchOnInit`, dependency-driven refetch, and a cache ([dynamicOptionsCache](src/helpers/dynamicOptionsCache.ts)).
- **Form registry** — the `formId → context` map enabling multi-form control.
- **Observer** — lightweight pub/sub ([observer.ts](src/helpers/observer.ts)) notifying dependent fields on change.
- **Field types:** `text/email/password/number/tel/url/search` (all → InputField), `date, select, multiSelect, radio, checkbox, file, textarea, gridview, group, container, spacer, content, button`.

## Conventions

- Each field type = its own folder under `Fields/` with `index.ts` (default export) + `<Name>Field.tsx`, optionally `__docs__/`.
- Components are `React.memo`'d; performance is a first-class concern (split contexts, singleton caches, lazy loading, debouncing, `requestIdleCallback` preloading).
- Field components consume **[useOptimizedField](src/hooks/useOptimizedField.ts)** (value/error/handlers/params) rather than touching context directly.
- Types are split by concern under `types/` and re-exported from `types/index.ts`; import from `@/types`.
- Styling: ships CSS (CSS modules + plain CSS files imported by components). Consumers can opt out via `disableDefaultStyling` (per-field or form-level) and bring Tailwind/their own.
- Commits: conventional-commit style (`feat(scope):`, `chore(scope):`). Husky enforces format/lint pre-commit.

## How to run / develop

```bash
npm install
npm run storybook     # primary dev harness (port 6006)
npm test              # vitest (tests in __test__/)
npm run build         # tsc + vite library build → dist/
npm run lint          # eslint --fix
```
No app server / no env vars required (it's a library). No secrets in repo.

## Gotchas & notes

- **Current checked-out branch is `develop`.** A `feature/multi-step-field` branch exists with in-progress multi-step/wizard work (`enableUrlNavigation`, `currentStep` starting at 1, sidebar repositioning) — **those files are NOT in the working tree on `develop`**, so don't expect a multi-step field component until that branch is checked out/merged.
- **Tests live in top-level `__test__/`, not in `src/`** — `vite.config.ts` explicitly excludes `src/**` from the test run.
- `FieldProcessor` cache key is built via `JSON.stringify` of the field minus `REACT_NODE_PROPS` — passing non-serializable props outside that list can bloat/poison the cache; React nodes belong in the excluded list. The cache is bounded (`maxCacheSize = 1000`, FIFO eviction) and exposes a `cacheSize` getter.
- The legacy combined `FormContext` is kept **only** for backwards compatibility; new code should read the split contexts via the `useForm*` hooks. The `useForm*` hooks read **both** the registry and the local context unconditionally (Rules of Hooks) and branch on `formId` afterwards — don't reintroduce a `useContext` inside an `if (formId)`.
- `FormProvider` calls **all** hooks before its `if (existingContext) return children` early-return; the side-effecting effects are individually guarded with `if (existingContext) return`. Keep that ordering when editing.
- Low-priority work that should run "when idle" must go through `scheduleIdleTask` (`@/utils`), never `requestIdleCallback` directly — the latter is undefined in SSR/jsdom and some browsers.
- `version` is `-beta`; API may still shift. Bundle size is tracked (compression plugins + `analyze` script) — keep an eye on it when adding deps.
