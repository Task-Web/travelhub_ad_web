import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserState } from "../types";
import {
  DEFAULT_MEMORY_STORAGE_MAX_ENTRIES,
  DEFAULT_MEMORY_STORAGE_MAX_TOTAL_BYTES,
  DEFAULT_MEMORY_STORAGE_TTL_SECONDS,
  MemoryStorage,
} from "./memory-storage";

type TestStateData = Record<string, unknown>;

function makeState(payload: string): UserState<TestStateData> {
  const now = "2024-01-01T00:00:00.000Z";
  return {
    meta: {
      created_at: now,
      updated_at: now,
      version: 1,
      type: "unrestricted",
    },
    data: { payload },
    note: null,
  };
}

function byteLength(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}

describe("MemoryStorage capacity controls", () => {
  let storage: MemoryStorage<TestStateData>;

  beforeEach(async () => {
    storage = new MemoryStorage<TestStateData>();
    await storage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the requested production defaults", () => {
    expect(DEFAULT_MEMORY_STORAGE_TTL_SECONDS).toBe(43_200);
    expect(DEFAULT_MEMORY_STORAGE_MAX_ENTRIES).toBe(1_000);
    expect(DEFAULT_MEMORY_STORAGE_MAX_TOTAL_BYTES).toBe(1_073_741_824);
  });

  it("expires an entry after exactly 12 idle hours by default", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));

    await storage.set("user", makeState("value"));
    vi.advanceTimersByTime(43_200 * 1000);

    await expect(storage.get("user")).resolves.toBeUndefined();
  });

  it("refreshes the idle TTL when an entry is read", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    storage = new MemoryStorage<TestStateData>({
      ttl: 10,
      maxEntries: 0,
      maxTotalBytes: 0,
    });

    await storage.set("user", makeState("value"));
    vi.advanceTimersByTime(9_000);
    await expect(storage.get("user")).resolves.toBeDefined();
    vi.advanceTimersByTime(9_000);
    await expect(storage.get("user")).resolves.toBeDefined();
    vi.advanceTimersByTime(10_000);
    await expect(storage.get("user")).resolves.toBeUndefined();
  });

  it("evicts the least recently used entry when count is exceeded", async () => {
    storage = new MemoryStorage<TestStateData>({
      ttl: 0,
      maxEntries: 2,
      maxTotalBytes: 0,
    });

    await storage.set("old", makeState("old"));
    await storage.set("recent", makeState("recent"));
    await storage.get("old");
    await storage.set("new", makeState("new"));

    await expect(storage.has("recent")).resolves.toBe(false);
    await expect(storage.has("old")).resolves.toBe(true);
    await expect(storage.has("new")).resolves.toBe(true);
  });

  it("evicts least recently used entries to meet the total byte budget", async () => {
    const state = makeState("same-size");
    storage = new MemoryStorage<TestStateData>({
      ttl: 0,
      maxEntries: 0,
      maxTotalBytes: byteLength(state) * 2,
    });

    await storage.set("old", state);
    await storage.set("recent", state);
    await storage.get("old");
    await storage.set("new", state);

    await expect(storage.has("recent")).resolves.toBe(false);
    await expect(storage.has("old")).resolves.toBe(true);
    await expect(storage.has("new")).resolves.toBe(true);
  });

  it("rejects a write that cannot fit within the total budget", async () => {
    const state = makeState("too-large-for-budget");
    storage = new MemoryStorage<TestStateData>({
      ttl: 0,
      maxEntries: 0,
      maxTotalBytes: byteLength(state) - 1,
    });

    await expect(storage.set("user", state)).rejects.toThrow(RangeError);
    expect(storage.size).toBe(0);
  });

  it("removes expired entries before enforcing capacity on a write", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    storage = new MemoryStorage<TestStateData>({
      ttl: 1,
      maxEntries: 1,
      maxTotalBytes: 0,
    });

    await storage.set("expired", makeState("expired"));
    vi.advanceTimersByTime(1_000);
    await storage.set("fresh", makeState("fresh"));

    await expect(storage.has("expired")).resolves.toBe(false);
    await expect(storage.has("fresh")).resolves.toBe(true);
  });

  it("lazily registers entries from the legacy global Map", async () => {
    const legacyState = makeState("legacy");
    const globals = globalThis as unknown as {
      __memoryStorage: Map<string, UserState<TestStateData>>;
      __memoryStorageMetadata: Map<string, unknown>;
    };
    globals.__memoryStorage.set("legacy", legacyState);
    globals.__memoryStorageMetadata.clear();

    const reloadedStorage = new MemoryStorage<TestStateData>({
      ttl: 60,
      maxEntries: 10,
      maxTotalBytes: 10_000,
    });

    await expect(reloadedStorage.get("legacy")).resolves.toEqual(legacyState);
  });

  it("bounds a legacy global Map on its first read", async () => {
    const globals = globalThis as unknown as {
      __memoryStorage: Map<string, UserState<TestStateData>>;
      __memoryStorageMetadata: Map<string, unknown>;
    };
    globals.__memoryStorage.set("legacy-old", makeState("old"));
    globals.__memoryStorage.set("legacy-middle", makeState("middle"));
    globals.__memoryStorage.set("legacy-recent", makeState("recent"));
    globals.__memoryStorageMetadata.clear();

    const reloadedStorage = new MemoryStorage<TestStateData>({
      ttl: 0,
      maxEntries: 2,
      maxTotalBytes: 0,
    });

    await expect(reloadedStorage.keys()).resolves.toEqual([
      "legacy-middle",
      "legacy-recent",
    ]);
  });
});
