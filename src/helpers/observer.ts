type Identifier = string;

type Callback = () => void;

export class Observer {
  private subscribers: Map<Identifier, Set<Callback>> = new Map();

  subscribe(fieldId: Identifier, callback: Callback): () => void {
    if (!this.subscribers.has(fieldId)) {
      this.subscribers.set(fieldId, new Set());
    }
    this.subscribers.get(fieldId)!.add(callback);
    return () => this.subscribers.get(fieldId)?.delete(callback);
  }

  notify(fieldId: Identifier): void {
    const subs = this.subscribers.get(fieldId);
    if (subs) {
      subs.forEach((cb) => cb());
    }
  }

  unsubscribeAll(fieldId: Identifier): void {
    this.subscribers.delete(fieldId);
  }

  clear(): void {
    this.subscribers.clear();
  }
}
