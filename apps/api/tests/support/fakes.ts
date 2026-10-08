import type { Clock } from "../../src/application/ports/clock.js";
import type { LogContext, Logger } from "../../src/application/ports/logger.js";
import type { HttpRequestMeasurement, Metrics } from "../../src/application/ports/metrics.js";
import type { RuntimeConfig } from "../../src/infrastructure/config/runtime-config.js";

export class FixedClock implements Clock {
  constructor(private readonly value = new Date("2026-01-01T00:00:00.000Z")) {}

  now(): Date {
    return this.value;
  }
}

export interface LogEntry {
  readonly context: LogContext;
  readonly level: "debug" | "info" | "warn" | "error";
  readonly message: string;
}

export class MemoryLogger implements Logger {
  readonly entries: LogEntry[] = [];

  debug(message: string, context: LogContext = {}): void {
    this.entries.push({ context, level: "debug", message });
  }

  info(message: string, context: LogContext = {}): void {
    this.entries.push({ context, level: "info", message });
  }

  warn(message: string, context: LogContext = {}): void {
    this.entries.push({ context, level: "warn", message });
  }

  error(message: string, context: LogContext = {}): void {
    this.entries.push({ context, level: "error", message });
  }
}

export class MemoryMetrics implements Metrics {
  readonly contentType = "text/plain; version=0.0.4; charset=utf-8";
  readonly measurements: HttpRequestMeasurement[] = [];

  observeHttpRequest(measurement: HttpRequestMeasurement): void {
    this.measurements.push(measurement);
  }

  serialize(): Promise<string> {
    return Promise.resolve("skygraph_test_metric 1\n");
  }
}

export function createTestConfig(overrides: Partial<RuntimeConfig> = {}): RuntimeConfig {
  return {
    environment: "test",
    host: "127.0.0.1",
    logLevel: "silent",
    metricsEnabled: true,
    port: 0,
    requestBodyLimitBytes: 1_024,
    shutdownTimeoutMs: 1_000,
    ...overrides,
  };
}
