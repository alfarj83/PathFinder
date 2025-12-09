import Constants from "expo-constants";
import { Platform } from "react-native";


const ANDROID_LOCALHOST = "http://10.0.2.2:4000";
const IOS_LOCALHOST = "http://localhost:4000"; 
const DEFAULT_TIMEOUT_MS = 12000;

// Prefer config/env, otherwise pick the right localhost per platform.
export const BASE_URL =
  (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === "android" ? ANDROID_LOCALHOST : IOS_LOCALHOST);

function qs(params?: Record<string, any>) {
  if (!params) return "";
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    Array.isArray(v) ? v.forEach(x => u.append(k, String(x))) : u.append(k, String(v));
  });
  const s = u.toString();
  return s ? `?${s}` : "";
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// CRUD
class APIService {
  private baseURL = new String();
  private defaultHeaders: Record<string, string> = {
    "Content-type": "application/json"
  };

  // allows baseURL to be injected
  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL; 
  }

  // sets or updates auth token
  public setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders["Authorization"]
    }
  }

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
    const t = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders, // Use encapsulated default headers
          ...(opts.headers ?? {}),
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: ctrl.signal,
      });

      if (!res.ok) {
        // More descriptive error for OO class
        let errorBody = await res.text();
        try {
            errorBody = JSON.parse(errorBody);
        } catch {}
        throw new Error(`HTTP ${res.status}: ${res.statusText}. Response: ${errorBody}`);
      }
      
      if (res.status === 204) return undefined as T;
      return (await res.json()) as T;
    } finally {
      clearTimeout(t);
    }
  }

  // --- Public CRUD Methods ---

  public get<T>(path: string, params?: Record<string, any>) {
    return this.req<T>(path, "GET", { params });
  }

  public post<T>(path: string, body?: unknown) {
    return this.req<T>(path, "POST", { body });
  }

  public put<T>(path: string, body?: unknown) {
    return this.req<T>(path, "PUT", { body });
  }

  public patch<T>(path: string, body?: unknown) {
    return this.req<T>(path, "PATCH", { body });
  }

  public delete<T>(path: string, params?: Record<string, any>) {
    return this.req<T>(path, "DELETE", { params });
  }
}

export const APIObj = new APIService();
