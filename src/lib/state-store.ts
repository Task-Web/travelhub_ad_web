import type { UserState, ReplaceStateInput, DefaultStateData } from "./types";
import { createDefaultState } from "./types";
import type { StateStorage } from "./storage/types";
import { getMemoryStorage } from "./storage/memory-storage";

// Deep merge utility for PATCH operations
function deepMerge(
  dest: Record<string, unknown>,
  src: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...dest };
  for (const key of Object.keys(src)) {
    const srcValue = src[key];
    const destValue = result[key];
    if (
      typeof destValue === "object" &&
      destValue !== null &&
      !Array.isArray(destValue) &&
      typeof srcValue === "object" &&
      srcValue !== null &&
      !Array.isArray(srcValue)
    ) {
      result[key] = deepMerge(
        destValue as Record<string, unknown>,
        srcValue as Record<string, unknown>
      );
    } else {
      result[key] = structuredClone(srcValue);
    }
  }
  return result;
}

/**
 * State store factory that creates a store with the given storage backend.
 * Allows swapping storage implementations (memory, file, Redis, etc.)
 */
export function createStateStore<
  T extends Record<string, unknown> = DefaultStateData
>(storage: StateStorage<T>) {
  return {
    /**
     * Get state for a user. Creates default state if none exists.
     */
    async getState(userId: string): Promise<UserState<T>> {
      const state = await storage.get(userId);
      if (state) {
        return state;
      }
      // Create and store default state
      const defaultState = createDefaultState() as UserState<T>;
      await storage.set(userId, defaultState);
      return defaultState;
    },

    /**
     * Replace entire state for a user.
     */
    async replaceState(
      userId: string,
      newState: ReplaceStateInput<Record<string, unknown>>
    ): Promise<UserState<T>> {
      const now = new Date().toISOString();
      const state: UserState<T> = {
        meta: newState.meta
          ? {
              created_at: newState.meta.created_at || now,
              updated_at: now,
              version: newState.meta.version || 1,
              type: newState.meta.type || "unrestricted",
            }
          : {
              created_at: now,
              updated_at: now,
              version: 1,
              type: "unrestricted",
            },
        data: (newState.data || { uploads: [] }) as T,
        note: newState.note ?? null,
      };
      await storage.set(userId, state);
      return structuredClone(state);
    },

    /**
     * Patch (deep merge) into existing state.
     */
    async patchState(
      userId: string,
      patch: Record<string, unknown>,
      note?: string | null
    ): Promise<UserState<T>> {
      let state = await storage.get(userId);
      if (!state) {
        state = createDefaultState() as UserState<T>;
      }

      const updatedData = deepMerge(
        state.data as Record<string, unknown>,
        patch
      ) as T;

      const updatedState: UserState<T> = {
        meta: {
          ...state.meta,
          updated_at: new Date().toISOString(),
          version: state.meta.version + 1,
        },
        data: updatedData,
        note: note !== undefined ? note : state.note,
      };

      await storage.set(userId, updatedState);
      return structuredClone(updatedState);
    },

    /**
     * Reset state to defaults.
     */
    async resetState(userId: string): Promise<UserState<T>> {
      const state = createDefaultState() as UserState<T>;
      await storage.set(userId, state);
      return structuredClone(state);
    },

    /**
     * Delete state entirely.
     */
    async deleteState(userId: string): Promise<void> {
      await storage.delete(userId);
    },

    /**
     * Check if user has stored state.
     */
    async hasState(userId: string): Promise<boolean> {
      return storage.has(userId);
    },

    /**
     * Get the underlying storage adapter.
     */
    getStorage(): StateStorage<T> {
      return storage;
    },
  };
}

export type StateStore<T extends Record<string, unknown> = DefaultStateData> =
  ReturnType<typeof createStateStore<T>>;

// Default store instance using memory storage
export const stateStore = createStateStore<DefaultStateData>(
  getMemoryStorage<DefaultStateData>()
);
