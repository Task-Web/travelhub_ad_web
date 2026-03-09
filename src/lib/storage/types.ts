import type { UserState, DefaultStateData } from "../types";

/**
 * Storage adapter interface for user state persistence.
 * Implement this interface to create custom storage backends
 * (e.g., Redis, PostgreSQL, file-based).
 */
export interface StateStorage<T extends Record<string, unknown> = DefaultStateData> {
  /**
   * Retrieve state for a user. Returns undefined if not found.
   */
  get(userId: string): Promise<UserState<T> | undefined>;

  /**
   * Store state for a user. Overwrites existing state.
   */
  set(userId: string, state: UserState<T>): Promise<void>;

  /**
   * Delete state for a user.
   */
  delete(userId: string): Promise<void>;

  /**
   * Check if state exists for a user.
   */
  has(userId: string): Promise<boolean>;

  /**
   * List all user IDs with stored state.
   * Optional - may not be efficient for all storage backends.
   */
  keys?(): Promise<string[]>;

  /**
   * Clear all stored state.
   * Optional - use with caution.
   */
  clear?(): Promise<void>;
}

/**
 * Configuration for storage adapters.
 */
export interface StorageConfig {
  /** Storage type identifier */
  type: "memory" | "custom";
  /** TTL in seconds for state expiration (0 = no expiration) */
  ttl?: number;
}
