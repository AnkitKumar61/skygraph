import { describe, expect, it } from "vitest";

import type { ReadinessProbe } from "../../src/application/ports/readiness-probe.js";
import { createApiRuntime } from "../../src/composition-root.js";
import { MemoryLogger, createTestConfig } from "../support/fakes.js";

describe("graceful HTTP shutdown", () => {
  it("stops accepting traffic while allowing an active request to drain", async () => {
    let releaseProbe: (() => void) | undefined;
    let signalProbeStarted: (() => void) | undefined;
    const probeStarted = new Promise<void>((resolve) => {
      signalProbeStarted = resolve;
    });
    const blockingProbe: ReadinessProbe = {
      name: "blocking-test-probe",
      check: async () => {
        signalProbeStarted?.();
        await new Promise<void>((resolve) => {
          releaseProbe = resolve;
        });
        return true;
      },
    };
    const runtime = createApiRuntime(createTestConfig(), {
      logger: new MemoryLogger(),
      readinessProbes: [blockingProbe],
    });
    const address = await runtime.start();
    const baseUrl = `http://127.0.0.1:${address.port.toString()}`;

    const activeRequest = fetch(`${baseUrl}/health/ready`, {
      headers: { connection: "close" },
    });
    await probeStarted;
    const shutdown = runtime.shutdown("integration-test");

    await expect(
      fetch(`${baseUrl}/health/live`, { headers: { connection: "close" } }),
    ).rejects.toThrow();
    releaseProbe?.();

    const response = await activeRequest;
    expect(response.status).toBe(200);
    await expect(shutdown).resolves.toBeUndefined();
  });
});
