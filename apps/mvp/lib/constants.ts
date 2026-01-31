/**
 * Application-wide constants.
 * Centralizes magic strings and configuration values.
 */

/** Base URL for the backend API. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Default timeout for API requests in milliseconds. */
export const API_TIMEOUT_MS = 15000;

/** Polling intervals for real-time data queries. */
export const POLLING_INTERVALS = {
  /** Jobs list - 5 seconds for real-time feel */
  JOBS: 5000,
  /** Approvals - 10 seconds */
  APPROVALS: 10000,
  /** Audit logs - 60 seconds (immutable, less frequent) */
  AUDIT: 60000,
} as const;

/** Cookie names used by the application. */
export const COOKIES = {
  SESSION: "session",
} as const;
