import { z } from "zod";

import { ApplicationError } from "../../domain/errors/application-error.js";

const integerFromEnvironment = (minimum: number, maximum: number) =>
  z
    .string()
    .regex(/^\d+$/u, "must be an integer")
    .transform(Number)
    .pipe(z.number().int().min(minimum).max(maximum));

const runtimeConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  API_HOST: z.string().trim().min(1).max(255),
  API_PORT: integerFromEnvironment(1, 65_535),
  API_REQUEST_BODY_LIMIT_BYTES: integerFromEnvironment(1_024, 10_485_760),
  API_SHUTDOWN_TIMEOUT_MS: integerFromEnvironment(100, 30_000),
  METRICS_ENABLED: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export interface RuntimeConfig {
  readonly environment: "development" | "test" | "production";
  readonly host: string;
  readonly logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
  readonly metricsEnabled: boolean;
  readonly port: number;
  readonly requestBodyLimitBytes: number;
  readonly shutdownTimeoutMs: number;
}

export function loadRuntimeConfig(source: NodeJS.ProcessEnv): RuntimeConfig {
  const result = runtimeConfigSchema.safeParse(source);

  if (!result.success) {
    const invalidFields = [
      ...new Set(result.error.issues.map((issue) => issue.path.join("."))),
    ].sort();
    throw new ApplicationError({
      category: "validation",
      code: "INVALID_CONFIGURATION",
      message: "Runtime configuration is invalid.",
      details: { fields: invalidFields },
    });
  }

  return Object.freeze({
    environment: result.data.NODE_ENV,
    host: result.data.API_HOST,
    logLevel: result.data.LOG_LEVEL,
    metricsEnabled: result.data.METRICS_ENABLED,
    port: result.data.API_PORT,
    requestBodyLimitBytes: result.data.API_REQUEST_BODY_LIMIT_BYTES,
    shutdownTimeoutMs: result.data.API_SHUTDOWN_TIMEOUT_MS,
  });
}
