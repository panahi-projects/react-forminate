import { FieldProcessor } from "./fieldProcessor";
import { FormFieldType } from "../types";

export class DependencyManager {
  private dependencyMap: Map<string, Set<string>> = new Map();
  private processorSubscribers: Map<string, Set<() => void>> = new Map();
  private renderSubscribers: Map<string, Set<() => void>> = new Map();
  private fieldProcessor: FieldProcessor;

  constructor(fields: FormFieldType[]) {
    this.fieldProcessor = FieldProcessor.getInstance();
    this.buildDependencyMap(fields);
  }

  private buildDependencyMap(fields: FormFieldType[]): void {
    this.dependencyMap.clear();

    for (const field of fields) {
      const dependencies = this.fieldProcessor.getFieldDependencies(field);
      for (const dep of dependencies) {
        if (!this.dependencyMap.has(dep)) {
          this.dependencyMap.set(dep, new Set());
        }
        this.dependencyMap.get(dep)!.add(field.fieldId);
      }
    }
  }

  public getDependents(fieldId: string): string[] {
    return Array.from(this.dependencyMap.get(fieldId) || []);
  }

  public subscribeProcessor(fieldId: string, callback: () => void): () => void {
    const set = this.processorSubscribers.get(fieldId) ?? new Set();
    set.add(callback);
    this.processorSubscribers.set(fieldId, set);

    return () => {
      set.delete(callback);
      if (set.size === 0) this.processorSubscribers.delete(fieldId);
    };
  }

  public subscribeRender(fieldId: string, callback: () => void): () => void {
    const set = this.renderSubscribers.get(fieldId) ?? new Set();
    set.add(callback);
    this.renderSubscribers.set(fieldId, set);

    return () => {
      set.delete(callback);
      if (set.size === 0) this.renderSubscribers.delete(fieldId);
    };
  }

  public notify(fieldId: string): void {
    const dependents = this.getDependents(fieldId);

    for (const dependentId of dependents) {
      this.processorSubscribers.get(dependentId)?.forEach((cb) => cb());
      this.renderSubscribers.get(dependentId)?.forEach((cb) => cb());
    }

    // Notify the direct field renderers too (e.g. re-run evaluation on the same field)
    this.renderSubscribers.get(fieldId)?.forEach((cb) => cb());
  }

  public updateFields(fields: FormFieldType[]): void {
    this.buildDependencyMap(fields);
  }

  public clear(): void {
    this.processorSubscribers.clear();
    this.renderSubscribers.clear();
    this.dependencyMap.clear();
  }
}
