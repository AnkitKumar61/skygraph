import { describe, expect, it } from "vitest";

import type { ReadinessProbe } from "../../src/application/ports/readiness-probe.js";
import { GetLiveness } from "../../src/application/use-cases/get-liveness.js";
import { GetReadiness } from "../../src/application/use-cases/get-readiness.js";
import { FixedClock, MemoryLogger } from "../support/fakes.js";

const availableProbe = (name: string, available: boolean): ReadinessProbe => ({
  name,
  check: () => Promise.resolve(available),
});

describe("health use cases", () => {
  it("reports process liveness without consulting dependencies", () => {
    expect(new GetLiveness(new FixedClock()).execute()).toEqual({
      status: "live",
      timestamp: "2026-01-01T00:00:00.000Z",
    });
  });

  it("reports ready only when every dependency is available", async () => {
    const result = await new GetReadiness(new FixedClock(), new MemoryLogger(), [
      availableProbe("database", true),
      availableProbe("cache", true),
    ]).execute();

    expect(result.status).toBe("ready");
    expect(result.components).toEqual({
      database: { available: true },
      cache: { available: true },
    });
  });

  it("converts unavailable and throwing dependencies into a safe not-ready result", async () => {
    const logger = new MemoryLogger();
    const throwingProbe: ReadinessProbe = {
      name: "engine",
      check: () => Promise.reject(new Error("native path and credential must stay private")),
    };
    const result = await new GetReadiness(new FixedClock(), logger, [
      availableProbe("database", false),
      throwingProbe,
    ]).execute();

    expect(result).toMatchObject({
      status: "not_ready",
      components: {
        database: { available: false },
        engine: { available: false },
      },
    });
    expect(JSON.stringify(result)).not.toContain("native path");
    expect(logger.entries).toContainEqual({
      context: { component: "engine", errorType: "Error" },
      level: "warn",
      message: "Readiness probe failed",
    });
  });
});
