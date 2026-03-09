import defaultStateDataJson from "./default-state.json";

// State metadata - tracks versioning and timestamps
export interface StateMeta {
  created_at: string;
  updated_at: string;
  version: number;
  type: string;
}

// File metadata for uploaded files
export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  filename: string;
  uploaded_at?: string;
}

// Default data structure for booking_web (state-driven content)
export interface DefaultStateData extends Record<string, unknown> {
  examples?: {
    huggingface_file?: {
      url: string;
      note?: string;
    };
  };
  uploads?: FileMetadata[];
  preferences?: {
    currency?: string;
    language?: string;
    dateFormat?: string;
    measurementUnit?: string;
  };
  airports?: Record<string, unknown>[];
  flights?: Record<string, unknown>[];
  hotels?: Record<string, unknown>[];
  cars?: Record<string, unknown>[];
  attractions?: Record<string, unknown>[];
  packages?: Record<string, unknown>[];
  bookings?: Record<string, unknown>[];
  disputes?: Record<string, unknown>[];
  cart?: { items: Record<string, unknown>[]; total: number };
  search?: {
    lastQuery?: Record<string, unknown> | null;
    filters?: Record<string, unknown>;
    history?: Record<string, unknown>[];
  };
  travelers?: Record<string, unknown>[];
  savedContacts?: Record<string, unknown>[];
  custom?: Record<string, unknown>;
}

// User state with envelope structure (meta, data, note)
// Generic T allows per-project typing of the data field
export interface UserState<T extends Record<string, unknown> = DefaultStateData> {
  meta: StateMeta;
  data: T;
  note: string | null;
}

// API response for state endpoints
export interface StateResponse<T extends Record<string, unknown> = DefaultStateData> {
  user_id: string;
  state: UserState<T>;
}

// Request body for PUT /api/state
export interface StateRequest<T extends Record<string, unknown> = Record<string, unknown>> {
  data: T;
  note?: string | null;
  meta?: Partial<StateMeta>;
}

// Request body for PATCH /api/state
export interface StatePatchRequest<T extends Record<string, unknown> = Record<string, unknown>> {
  data: Partial<T>;
  note?: string | null;
}

// Input for replaceState - allows partial meta
export interface ReplaceStateInput<T extends Record<string, unknown> = Record<string, unknown>> {
  data?: T;
  note?: string | null;
  meta?: Partial<StateMeta>;
}

// System info response
export interface InfoResponse {
  app_name: string;
  node_version: string;
  env: Record<string, string>;
  request: Record<string, unknown>;
}

export function createDefaultStateData(): DefaultStateData {
  return structuredClone(defaultStateDataJson) as DefaultStateData;
}

export function createDefaultState(): UserState<DefaultStateData> {
  const now = new Date().toISOString();
  return {
    meta: {
      created_at: now,
      updated_at: now,
      version: 1,
      type: "unrestricted",
    },
    data: createDefaultStateData(),
    note: null,
  };
}
