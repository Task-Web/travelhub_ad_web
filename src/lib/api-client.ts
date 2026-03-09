import { API_BASE_PATH } from "./constants";
import type { StateResponse, InfoResponse, FileMetadata, StateMeta } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_PATH}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.detail || response.statusText || "Request failed";
    throw new ApiError(message, response.status, errorBody.detail);
  }

  return response.json();
}

export interface ReplaceStateOptions {
  data: Record<string, unknown>;
  note?: string;
  meta?: Partial<StateMeta>;
}

export interface PatchStateOptions {
  data: Record<string, unknown>;
  note?: string;
}

export const api = {
  getState: () => apiRequest<StateResponse>("/state"),

  replaceState: (options: ReplaceStateOptions) =>
    apiRequest<StateResponse>("/state", {
      method: "PUT",
      body: JSON.stringify({
        data: options.data,
        note: options.note,
        meta: options.meta,
      }),
    }),

  patchState: (options: PatchStateOptions) =>
    apiRequest<StateResponse>("/state", {
      method: "PATCH",
      body: JSON.stringify({
        data: options.data,
        note: options.note,
      }),
    }),

  resetState: () => apiRequest<StateResponse>("/state", { method: "DELETE" }),

  getInfo: () => apiRequest<InfoResponse>("/info"),

  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiRequest<FileMetadata[]>("/files", {
      method: "POST",
      body: formData,
    });
  },

  listFiles: () => apiRequest<FileMetadata[]>("/files"),
};

export type Api = typeof api;
