import Constants from "expo-constants";
import { Platform } from "react-native";

const ANDROID_LOCALHOST = "http://10.0.2.2:4000";
const IOS_LOCALHOST = "http://localhost:4000";

// Prefer config/env, otherwise pick the right localhost per platform.
export const BASE_URL =
  (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === "android" ? ANDROID_LOCALHOST : IOS_LOCALHOST);

const DEFAULT_TIMEOUT_MS = 12000;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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

async function req<T>(
  path: string,
  method: Method,
  opts: {
    params?: Record<string, any>;
    body?: unknown;
    headers?: Record<string, string>;
    timeoutMs?: number;
  } = {}
): Promise<T> {
  const url = `${BASE_URL}${path}${qs(opts.params)}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export const api = {
  get:    <T>(path: string, params?: Record<string, any>) => req<T>(path, "GET", { params }),
  post:   <T>(path: string, body?: unknown)               => req<T>(path, "POST", { body }),
  put:    <T>(path: string, body?: unknown)               => req<T>(path, "PUT", { body }),
  patch:  <T>(path: string, body?: unknown)               => req<T>(path, "PATCH", { body }),
  delete: <T>(path: string, params?: Record<string, any>) => req<T>(path, "DELETE", { params }),
};

// Default mocks to FALSE unless explicitly enabled.
export const USE_MOCK =
  String(
    (Constants.expoConfig?.extra as any)?.EXPO_PUBLIC_USE_MOCK ??
      process.env.EXPO_PUBLIC_USE_MOCK ??
      "false"
  ).toLowerCase() === "true";

// Optional: log once on boot to verify.
console.log("BASE_URL =>", BASE_URL, "USE_MOCK =>", USE_MOCK);

