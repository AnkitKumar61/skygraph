import { useQuery } from "@tanstack/react-query";

import { toApiError } from "../../shared/api/api-error.js";
import { parsePublicConfig } from "../../shared/api/config.js";
import { StatePanel } from "../../shared/ui/States.js";

export function ServiceStatus() {
  const query = useQuery({
    queryKey: ["service", "liveness"],
    queryFn: async ({ signal }) => {
      const config = parsePublicConfig(import.meta.env);
      const url = new URL("/health/live", config.apiBaseUrl);
      const response = await fetch(url, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(5_000)]),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw toApiError(response.status, body);
      if (
        typeof body !== "object" ||
        body === null ||
        !("status" in body) ||
        body.status !== "live"
      ) {
        throw new Error("The service returned an unexpected health response.");
      }
      return "live" as const;
    },
  });
  return (
    <section>
      <header className="page-heading">
        <h1>Service status</h1>
        <p>Check whether the API can be reached from this browser.</p>
      </header>
      {query.isPending && query.errorUpdateCount === 0 ? (
        <StatePanel kind="loading" title="Checking the service">
          Waiting for a health response…
        </StatePanel>
      ) : query.isError || query.isPending ? (
        <StatePanel
          kind={query.isFetching ? "loading" : "offline"}
          title="Service health could not be confirmed"
          action={
            <button
              className="button"
              disabled={query.isFetching}
              onClick={() => {
                void query.refetch();
              }}
            >
              {query.isFetching ? "Checking the service…" : "Retry connection"}
            </button>
          }
        >
          {query.isFetching
            ? "Checking for a valid health response…"
            : "The API did not return a valid health response. Check your connection or try again. Your workspace remains available."}
        </StatePanel>
      ) : (
        <StatePanel
          title="The API is reachable"
          action={
            <button
              className="button secondary"
              onClick={() => {
                void query.refetch();
              }}
              disabled={query.isFetching}
            >
              {query.isFetching ? "Checking…" : "Check again"}
            </button>
          }
        >
          The process is responding. This check does not indicate that flight data is available.
        </StatePanel>
      )}
    </section>
  );
}
