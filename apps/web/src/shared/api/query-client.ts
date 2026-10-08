import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./api-error.js";

export function retryRequest(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }
  return failureCount < 2;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 300_000,
        retry: retryRequest,
        retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 2_000),
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  });
}
