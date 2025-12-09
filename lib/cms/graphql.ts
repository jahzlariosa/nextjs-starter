import type { NextFetchRequestConfig } from "next/server";

export type GraphQLRequestOptions = {
  endpoint: string;
  query: string;
  variables?: Record<string, unknown>;
  token?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export type GraphQLError = {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
  status: number;
};

const defaultTimeoutMs = 8000;

export async function requestGraphQL<T>(
  options: GraphQLRequestOptions,
): Promise<GraphQLResponse<T>> {
  const {
    endpoint,
    query,
    variables,
    token,
    headers,
    timeoutMs = defaultTimeoutMs,
    cache = "no-store",
    next,
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ query, variables }),
      cache,
      next,
      signal: controller.signal,
    });

    const isJson = response.headers
      .get("content-type")
      ?.toLowerCase()
      .includes("application/json");

    const json = (isJson ? await response.json() : null) as
      | {
          data?: T;
          errors?: GraphQLError[];
        }
      | null;

    return {
      data: json?.data,
      errors:
        json?.errors ??
        (!response.ok
          ? [
              {
                message: `GraphQL request failed with status ${response.status}`,
              },
            ]
          : undefined),
      status: response.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown GraphQL request error";
    const isAbortError =
      error instanceof DOMException && error.name === "AbortError"
        ? true
        : message.toLowerCase().includes("aborted");

    return {
      status: isAbortError ? 504 : 500,
      errors: [
        {
          message: isAbortError
            ? `GraphQL request timed out after ${timeoutMs}ms`
            : message,
        },
      ],
    };
  } finally {
    clearTimeout(timeout);
  }
}
