import { describe, expect, it } from "vitest";

import { ApplicationError } from "../../src/domain/errors/application-error.js";
import { loadRuntimeConfig } from "../../src/infrastructure/config/runtime-config.js";

const validEnvironment = {
  NODE_ENV: "production",
  LOG_LEVEL: "info",
  API_HOST: "0.0.0.0",
  API_PORT: "3000",
  API_REQUEST_BODY_LIMIT_BYTES: "1048576",
  API_SHUTDOWN_TIMEOUT_MS: "10000",
  METRICS_ENABLED: "true",
};

describe("runtime configuration", () => {
  it("parses and freezes a valid environment", () => {
    const config = loadRuntimeConfig(validEnvironment);

    expect(config).toEqual({
      environment: "production",
      host: "0.0.0.0",
      logLevel: "info",
      metricsEnabled: true,
      port: 3000,
      requestBodyLimitBytes: 1_048_576,
      shutdownTimeoutMs: 10_000,
    });
    expect(Object.isFrozen(config)).toBe(true);
  });

  it.each([
    ["missing required value", { ...validEnvironment, API_HOST: undefined }],
    ["malformed integer", { ...validEnvironment, API_PORT: "three-thousand" }],
    ["port below boundary", { ...validEnvironment, API_PORT: "0" }],
    ["port above boundary", { ...validEnvironment, API_PORT: "65536" }],
    ["unsafe body limit", { ...validEnvironment, API_REQUEST_BODY_LIMIT_BYTES: "10485761" }],
    ["invalid boolean", { ...validEnvironment, METRICS_ENABLED: "yes" }],
  ])("rejects %s without echoing configuration values", (_caseName, environment) => {
    expect(() => loadRuntimeConfig(environment)).toThrow(ApplicationError);

    try {
      loadRuntimeConfig(environment);
    } catch (error: unknown) {
      expect(JSON.stringify(error)).not.toContain("three-thousand");
      expect(JSON.stringify(error)).not.toContain("postgresql://secret");
    }
  });

  it("never includes unrelated secret values in validation errors", () => {
    const environment = {
      ...validEnvironment,
      API_PORT: "invalid",
      DATABASE_URL: "postgresql://user:super-secret@example.invalid/db",
    };

    try {
      loadRuntimeConfig(environment);
      expect.unreachable("Expected invalid configuration to throw.");
    } catch (error: unknown) {
      expect(JSON.stringify(error)).not.toContain("super-secret");
      expect(error).toMatchObject({
        code: "INVALID_CONFIGURATION",
        details: { fields: ["API_PORT"] },
      });
    }
  });
});
