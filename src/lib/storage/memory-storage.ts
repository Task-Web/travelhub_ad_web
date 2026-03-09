import type { UserState, DefaultStateData } from "../types";
import type { StateStorage } from "./types";

/**
 * In-memory state storage using a Map.
 * State persists across requests in development but is lost on server restart.
 * Good for development and testing.
 */
export class MemoryStorage<T extends Record<string, unknown> = DefaultStateData>
  implements StateStorage<T>
{
  private store: Map<string, UserState<T>>;

  constructor() {
    // Use global to persist across hot reloads in development
    const globalStore = globalThis as unknown as {
      __memoryStorage?: Map<string, UserState<T>>;
    };

    if (!globalStore.__memoryStorage) {
      globalStore.__memoryStorage = new Map<string, UserState<T>>();
    }

    this.store = globalStore.__memoryStorage;
  }

  async get(userId: string): Promise<UserState<T> | undefined> {
    const state = this.store.get(userId);
    if (!state) return undefined;
    // Return a clone to prevent external mutations
    return structuredClone(state);
  }

  async set(userId: string, state: UserState<T>): Promise<void> {
    // Store a clone to prevent external mutations
    this.store.set(userId, structuredClone(state));
  }

  async delete(userId: string): Promise<void> {
    this.store.delete(userId);
  }

  async has(userId: string): Promise<boolean> {
    return this.store.has(userId);
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  /**
   * Get the current number of stored states.
   */
  get size(): number {
    return this.store.size;
  }
}

/**
 * Create a singleton memory storage instance.
 */
let defaultInstance: MemoryStorage | null = null;

export function getMemoryStorage<
  T extends Record<string, unknown> = DefaultStateData
>(): MemoryStorage<T> {
  if (!defaultInstance) {
    defaultInstance = new MemoryStorage<T>();
  }
  return defaultInstance as MemoryStorage<T>;
}
