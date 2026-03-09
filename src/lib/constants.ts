// Cookie configuration
export const COOKIE_NAME = process.env.COOKIE_NAME ?? "user_id";
export const COOKIE_MAX_AGE = Number(process.env.COOKIE_MAX_AGE) || 60 * 60 * 24 * 30; // 30 days

// API configuration
export const API_BASE_PATH = "/api";
