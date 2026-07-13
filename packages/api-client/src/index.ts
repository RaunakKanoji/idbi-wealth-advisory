/**
 * @idbi/api-client — the one HTTP client every surface uses (F005).
 * Timeout + cancellation built in so screens never hang on a spinner (F111).
 */
import { API_TIMEOUT_MS } from "@idbi/config";

export type ApiErrorKind = "timeout" | "network" | "http";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T>;
}

export function createApiClient(config: { baseUrl?: string; timeoutMs?: number } = {}): ApiClient {
  const baseUrl = config.baseUrl ?? "";
  const defaultTimeout = config.timeoutMs ?? API_TIMEOUT_MS;

  async function request<T>(path: string, init: RequestInit, options: RequestOptions = {}): Promise<T> {
    const timeoutMs = options.timeoutMs ?? defaultTimeout;
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;

    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, { ...init, signal });
    } catch (error) {
      if (timeoutSignal.aborted) {
        throw new ApiError("timeout", `Request timed out after ${timeoutMs}ms: ${path}`);
      }
      if (options.signal?.aborted) {
        throw error; // caller-initiated cancellation propagates as-is
      }
      throw new ApiError("network", `Network request failed: ${path}`);
    }

    if (!response.ok) {
      throw new ApiError("http", `Request failed with status ${response.status}: ${path}`, response.status);
    }
    return (await response.json()) as T;
  }

  return {
    get: (path, options) => request(path, { method: "GET" }, options),
    post: (path, body, options) =>
      request(
        path,
        { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) },
        options,
      ),
  };
}
