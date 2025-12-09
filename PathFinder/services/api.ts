import Constants from "expo-constants";
import { Platform } from "react-native";

const ANDROID_LOCALHOST = "http://10.0.2.2:4000";
const IOS_LOCALHOST = "http://localhost:4000";
const DEFAULT_TIMEOUT_MS = 12000;

// Resolve the API base URL from config, env, or platform-localhost
export const BASE_URL =
  (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === "android" ? ANDROID_LOCALHOST : IOS_LOCALHOST);

// Build a query string from a params object
function qs(params?: Record<string, any>) {
  if (!params) return "";
  const u = new URLSearchParams();

  // Skip nullish values and support arrays by appending multiple entries
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    Array.isArray(v) ? v.forEach(x => u.append(k, String(x))) : u.append(k, String(v));
  });

  const s = u.toString();
  return s ? `?${s}` : "";
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Thin HTTP client for talking to the backend API
class APIService {
  private baseURL = new String();

  // Default headers applied to all requests
  private defaultHeaders: Record<string, string> = {
    "Content-type": "application/json"
  };

  // Allow the base URL to be injected for tests or alternate environments
  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  // Set or clear the Authorization header used for authenticated requests
  public setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders["Authorization"];
    }
  }

  // Core request helper that handles timeout, headers, and JSON parsing
  private async req<T>(
    path: string,
    method: Method,
    opts: {
      params?: Record<string, any>;
      body?: unknown;
      headers?: Record<string, string>;
      timeoutMs?: number;
    } = {}
  ): Promise<T> {
    const url = `${this.baseURL}${path}${qs(opts.params)}`;
    const ctrl = new AbortController();

    // Abort the request if it takes longer than the configured timeout
    const t = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...(opts.headers ?? {}),
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: ctrl.signal,
      });

      if (!res.ok) {
        // Try to include response body for easier debugging
        let errorBody = await res.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch {
          // Leave errorBody as plain text if JSON parsing fails
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}. Response: ${errorBody}`);
      }

      // Return undefined for 204 No Content responses
      if (res.status === 204) return undefined as T;

      return (await res.json()) as T;
    } finally {
      clearTimeout(t);
    }
  }

  // ---------------- Public CRUD helpers ----------------

  // Issue a GET request with optional query parameters
  public get<T>(path: string, params?: Record<string, any>) {
    return this.req<T>(path, "GET", { params });
  }

  // Issue a POST request with an optional JSON body
  public post<T>(path: string, body?: unknown) {
    return this.req<T>(path, "POST", { body });
  }

  // Issue a PUT request with an optional JSON body
  public put<T>(path: string, body?: unknown) {
    return this.req<T>(path, "PUT", { body });
  }

  // Issue a PATCH request with an optional JSON body
  public patch<T>(path: string, body?: unknown) {
    return this.req<T>(path, "PATCH", { body });
  }

  // Issue a DELETE request with optional query parameters
  public delete<T>(path: string, params?: Record<string, any>) {
    return this.req<T>(path, "DELETE", { params });
  }
}

// Shared API client instance used throughout the app
export const APIObj = new APIService();

// // Default mocks to FALSE unless explicitly enabled.
// export const USE_MOCK =
//   String(
//     (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_USE_MOCK ??
//       process.env.EXPO_PUBLIC_USE_MOCK ??
//       "false"
//   ).toLowerCase() === "true";

// Optional: log once on boot to verify base URL resolution
// console.log("BASE_URL =>", BASE_URL, "USE_MOCK =>", USE_MOCK);
