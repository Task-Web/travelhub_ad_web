import type { UserState, DefaultStateData } from "../types";
import type { MemoryStorageConfig, StateStorage } from "./types";

export const DEFAULT_MEMORY_STORAGE_TTL_SECONDS = 12 * 60 * 60;
export const DEFAULT_MEMORY_STORAGE_MAX_ENTRIES = 1000;
export const DEFAULT_MEMORY_STORAGE_MAX_TOTAL_BYTES = 1024 * 1024 * 1024;

const TTL_ENV = "STATE_TTL_SECONDS";
const MAX_ENTRIES_ENV = "STATE_MAX_ENTRIES";
const MAX_TOTAL_BYTES_ENV = "STATE_MAX_TOTAL_BYTES";

interface MemoryStorageMetadata {
  lastAccessedAt: number;
  accessOrder: number;
  serializedBytes: number;
}

interface GlobalMemoryStorage {
  __memoryStorage?: Map<string, UserState<Record<string, unknown>>>;
  __memoryStorageMetadata?: Map<string, MemoryStorageMetadata>;
  __memoryStorageAccessCounter?: number;
}

function readEnvironmentLimit(name: string, fallback: number): number {
  const rawValue = process.env[name];
  if (rawValue === undefined || rawValue.trim() === "") return fallback;

  const value = Number(rawValue);
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}

function resolveLimit(value: number | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("Memory storage limits must be non-negative numbers");
  }
  return Math.floor(value);
}

function serializedByteLength(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}

/**
 * In-memory state storage using a process-global Map.
 *
 * Entries expire after an idle TTL and are evicted least-recently-used when the
 * configured entry count or aggregate serialized byte budget is exceeded.
 */
export class MemoryStorage<T extends Record<string, unknown> = DefaultStateData>
  implements StateStorage<T>
{
  private readonly store: Map<string, UserState<T>>;
  private readonly metadata: Map<string, MemoryStorageMetadata>;
  private readonly globalStore: GlobalMemoryStorage;
  private readonly ttlMs: number;
  private readonly maxEntries: number;
  private readonly maxTotalBytes: number;

  constructor(config: MemoryStorageConfig = {}) {
    this.globalStore = globalThis as unknown as GlobalMemoryStorage;

    // Preserve the original global Map so existing state survives hot reloads.
    if (!this.globalStore.__memoryStorage) {
      this.globalStore.__memoryStorage = new Map();
    }
    if (!this.globalStore.__memoryStorageMetadata) {
      this.globalStore.__memoryStorageMetadata = new Map();
    }

    this.store = this.globalStore.__memoryStorage as Map<
      string,
      UserState<T>
    >;
    this.metadata = this.globalStore.__memoryStorageMetadata;
    this.ttlMs =
      resolveLimit(
        config.ttl,
        readEnvironmentLimit(TTL_ENV, DEFAULT_MEMORY_STORAGE_TTL_SECONDS)
      ) * 1000;
    this.maxEntries = resolveLimit(
      config.maxEntries,
      readEnvironmentLimit(
        MAX_ENTRIES_ENV,
        DEFAULT_MEMORY_STORAGE_MAX_ENTRIES
      )
    );
    this.maxTotalBytes = resolveLimit(
      config.maxTotalBytes,
      readEnvironmentLimit(
        MAX_TOTAL_BYTES_ENV,
        DEFAULT_MEMORY_STORAGE_MAX_TOTAL_BYTES
      )
    );
  }

  async get(userId: string): Promise<UserState<T> | undefined> {
    const now = Date.now();
    this.removeExpired(now);

    const state = this.store.get(userId);
    if (!state) return undefined;

    this.touch(userId, now);
    return structuredClone(state);
  }

  async set(userId: string, state: UserState<T>): Promise<void> {
    const now = Date.now();
    this.removeExpired(now);

    const clonedState = structuredClone(state);
    const serializedBytes = serializedByteLength(clonedState);
    if (this.maxTotalBytes > 0 && serializedBytes > this.maxTotalBytes) {
      throw new RangeError(
        "Serialized state exceeds the memory storage total byte budget"
      );
    }

    this.store.set(userId, clonedState);
    this.metadata.set(userId, {
      lastAccessedAt: now,
      accessOrder: this.nextAccessOrder(),
      serializedBytes,
    });
    this.enforceCapacity();
  }

  async delete(userId: string): Promise<void> {
    this.removeExpired(Date.now());
    this.remove(userId);
  }

  async has(userId: string): Promise<boolean> {
    const now = Date.now();
    this.removeExpired(now);
    if (!this.store.has(userId)) return false;

    this.touch(userId, now);
    return true;
  }

  async keys(): Promise<string[]> {
    this.removeExpired(Date.now());
    return Array.from(this.store.keys());
  }

  async clear(): Promise<void> {
    this.store.clear();
    this.metadata.clear();
    this.globalStore.__memoryStorageAccessCounter = 0;
  }

  /** Get the current number of non-expired states. */
  get size(): number {
    this.removeExpired(Date.now());
    return this.store.size;
  }

  private removeExpired(now: number): void {
    this.reconcileMetadata(now);
    if (this.ttlMs > 0) {
      for (const [userId, entry] of this.metadata) {
        if (now - entry.lastAccessedAt >= this.ttlMs) {
          this.remove(userId);
        }
      }
    }
    this.enforceCapacity();
  }

  private reconcileMetadata(now: number): void {
    for (const userId of this.metadata.keys()) {
      if (!this.store.has(userId)) this.metadata.delete(userId);
    }

    // Maps created by the previous implementation have no metadata. Register
    // them lazily so their idle TTL starts when this implementation first runs.
    for (const [userId, state] of this.store) {
      if (!this.metadata.has(userId)) {
        this.metadata.set(userId, {
          lastAccessedAt: now,
          accessOrder: this.nextAccessOrder(),
          serializedBytes: serializedByteLength(state),
        });
      }
    }
  }

  private touch(userId: string, now: number): void {
    const entry = this.metadata.get(userId);
    if (!entry) return;

    entry.lastAccessedAt = now;
    entry.accessOrder = this.nextAccessOrder();
  }

  private enforceCapacity(): void {
    let totalBytes = 0;
    const entries = Array.from(this.metadata.entries());
    for (const [, entry] of entries) totalBytes += entry.serializedBytes;

    entries.sort((left, right) => left[1].accessOrder - right[1].accessOrder);
    let evictionIndex = 0;
    while (
      (this.maxEntries > 0 && this.store.size > this.maxEntries) ||
      (this.maxTotalBytes > 0 && totalBytes > this.maxTotalBytes)
    ) {
      const candidate = entries[evictionIndex++];
      if (!candidate) break;

      const [userId, entry] = candidate;
      if (this.store.has(userId)) {
        totalBytes -= entry.serializedBytes;
        this.remove(userId);
      }
    }
  }

  private remove(userId: string): void {
    this.store.delete(userId);
    this.metadata.delete(userId);
  }

  private nextAccessOrder(): number {
    const next = (this.globalStore.__memoryStorageAccessCounter ?? 0) + 1;
    this.globalStore.__memoryStorageAccessCounter = next;
    return next;
  }
}

/** Create a singleton memory storage instance. */
let defaultInstance: MemoryStorage<Record<string, unknown>> | null = null;

export function getMemoryStorage<
  T extends Record<string, unknown> = DefaultStateData
>(): MemoryStorage<T> {
  if (!defaultInstance) {
    defaultInstance = new MemoryStorage<Record<string, unknown>>();
  }
  return defaultInstance as unknown as MemoryStorage<T>;
}
