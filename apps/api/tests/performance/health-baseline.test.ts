import { describe, expect, it } from "vitest";

import { createApiRuntime } from "../../src/composition-root.js";
import { MemoryLogger, createTestConfig } from "../support/fakes.js";

describe("health endpoint performance baseline", () => {
  it("keeps local p95 latency and idle memory within the Task 02 safety budget", async () => {
    const runtime = createApiRuntime(createTestConfig({ metricsEnabled: false }), {
      logger: new MemoryLogger(),
    });
    const address = await runtime.start();
    const url = `http://127.0.0.1:${address.port.toString()}/health/live`;
    const latencies: number[] = [];

    try {
      for (let requestNumber = 0; requestNumber < 50; requestNumber += 1) {
        const startedAt = performance.now();
        const response = await fetch(url);
        expect(response.status).toBe(200);
        await response.arrayBuffer();
        latencies.push(performance.now() - startedAt);
      }
    } finally {
      await runtime.shutdown("performance-test");
    }

    const sorted = latencies.toSorted((left, right) => left - right);
    const percentileIndex = Math.ceil(sorted.length * 0.95) - 1;
    const p95 = sorted[percentileIndex];
    expect(p95).toBeDefined();
    expect(p95).toBeLessThan(250);
    expect(process.memoryUsage().rss).toBeLessThan(512 * 1_024 * 1_024);
  });
});
