import { afterEach, describe, expect, it } from "vitest";

import type { ReadinessProbe } from "../../src/application/ports/readiness-probe.js";
import { createApiRuntime, type ApiRuntime } from "../../src/composition-root.js";
import { MemoryLogger, MemoryMetrics, createTestConfig } from "../support/fakes.js";

interface StartedRuntime {
  readonly baseUrl: string;
  readonly logger: MemoryLogger;
  readonly metrics: MemoryMetrics;
  readonly runtime: ApiRuntime;
}

const activeRuntimes: ApiRuntime[] = [];

async function startRuntime(probes: readonly ReadinessProbe[] = []): Promise<StartedRuntime> {
  const logger = new MemoryLogger();
  const metrics = new MemoryMetrics();
  const runtime = createApiRuntime(createTestConfig(), {
    logger,
    metrics,
    readinessProbes: probes,
  });
  const address = await runtime.start();
  activeRuntimes.push(runtime);
  return {
    baseUrl: `http://127.0.0.1:${address.port.toString()}`,
    logger,
    metrics,
    runtime,
  };
}

afterEach(async () => {
  await Promise.allSettled(
    activeRuntimes.splice(0).map((runtime) => runtime.shutdown("test-cleanup")),
  );
});

describe("real HTTP runtime", () => {
  it("serves distinct liveness and readiness contracts with security headers", async () => {
    const started = await startRuntime([{ name: "database", check: () => Promise.resolve(true) }]);

    const liveResponse = await fetch(`${started.baseUrl}/health/live`);
    const readyResponse = await fetch(`${started.baseUrl}/health/ready`);

    expect(liveResponse.status).toBe(200);
    expect(await liveResponse.json()).toMatchObject({ status: "live" });
    expect(readyResponse.status).toBe(200);
    expect(await readyResponse.json()).toMatchObject({
      status: "ready",
      components: { database: { available: true } },
    });
    expect(liveResponse.headers.get("x-powered-by")).toBeNull();
    expect(liveResponse.headers.get("x-content-type-options")).toBe("nosniff");
    expect(liveResponse.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("preserves safe correlation IDs and replaces unsafe values", async () => {
    const started = await startRuntime();
    const preserved = await fetch(`${started.baseUrl}/health/live`, {
      headers: { "x-correlation-id": "safe-request-42" },
    });
    const replaced = await fetch(`${started.baseUrl}/health/live`, {
      headers: { "x-correlation-id": "<unsafe>" },
    });

    expect(preserved.headers.get("x-correlation-id")).toBe("safe-request-42");
    expect(replaced.headers.get("x-correlation-id")).toMatch(/^[0-9a-f-]{36}$/u);
    expect(
      started.logger.entries.some((entry) => entry.context.correlationId === "safe-request-42"),
    ).toBe(true);
  });

  it("returns safe 404, 405, malformed JSON, and body-limit errors", async () => {
    const started = await startRuntime();
    const notFound = await fetch(`${started.baseUrl}/private/path?token=secret`);
    const methodNotAllowed = await fetch(`${started.baseUrl}/health/live`, { method: "POST" });
    const malformed = await fetch(`${started.baseUrl}/unknown`, {
      body: "{broken",
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    const oversized = await fetch(`${started.baseUrl}/unknown`, {
      body: JSON.stringify({ payload: "x".repeat(2_000) }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    expect(notFound.status).toBe(404);
    expect(await notFound.json()).toEqual({
      error: { code: "NOT_FOUND", message: "The requested resource was not found." },
    });
    expect(methodNotAllowed.status).toBe(405);
    expect(await methodNotAllowed.json()).toMatchObject({ error: { code: "METHOD_NOT_ALLOWED" } });
    expect(malformed.status).toBe(400);
    expect(await malformed.json()).toMatchObject({ error: { code: "INVALID_JSON" } });
    expect(oversized.status).toBe(413);
    expect(await oversized.json()).toMatchObject({ error: { code: "REQUEST_BODY_TOO_LARGE" } });
    expect(JSON.stringify(started.logger.entries)).not.toContain("private/path");
    expect(JSON.stringify(started.logger.entries)).not.toContain("token=secret");
  });

  it("reports failed readiness safely and records bounded request telemetry", async () => {
    const started = await startRuntime([
      { name: "database", check: () => Promise.resolve(false) },
      { name: "cache", check: () => Promise.reject(new Error("redis://private-credential")) },
    ]);

    const response = await fetch(`${started.baseUrl}/health/ready`);
    const body: unknown = await response.json();

    expect(response.status).toBe(503);
    expect(body).toMatchObject({
      status: "not_ready",
      components: { database: { available: false }, cache: { available: false } },
    });
    expect(JSON.stringify(body)).not.toContain("redis://");
    expect(started.metrics.measurements).toContainEqual(
      expect.objectContaining({ method: "GET", route: "/health/ready", statusCode: 503 }),
    );
  });

  it("exposes metrics only when enabled", async () => {
    const started = await startRuntime();
    const response = await fetch(`${started.baseUrl}/metrics`);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("skygraph_test_metric 1\n");
  });
});
