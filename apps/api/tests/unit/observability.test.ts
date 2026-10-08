import { Writable } from "node:stream";

import { describe, expect, it } from "vitest";

import { createPinoLogger } from "../../src/infrastructure/logging/pino-logger.js";
import { PrometheusMetrics } from "../../src/infrastructure/metrics/prometheus-metrics.js";

class TextSink extends Writable {
  readonly chunks: string[] = [];

  override _write(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    this.chunks.push(chunk.toString("utf8"));
    callback();
  }
}

describe("observability adapters", () => {
  it("redacts secrets and encodes log-injection characters as one JSON record", () => {
    const sink = new TextSink();
    const logger = createPinoLogger({ environment: "test", logLevel: "info" }, sink);

    logger.info("request\nforged", {
      authorization: "Bearer private-token",
      nested: { password: "private-password" },
    });

    expect(sink.chunks).toHaveLength(1);
    const record: unknown = JSON.parse(sink.chunks[0] ?? "{}");
    expect(record).toMatchObject({
      authorization: "[REDACTED]",
      message: "request\nforged",
      nested: { password: "[REDACTED]" },
    });
    expect(sink.chunks[0]?.trim().split("\n")).toHaveLength(1);
  });

  it("bounds metric dimensions and excludes high-cardinality identifiers", async () => {
    const metrics = new PrometheusMetrics();
    metrics.observeHttpRequest({
      durationSeconds: 0.01,
      method: "CUSTOM-123",
      route: "/aircraft/user-42?correlation=secret-id",
      statusCode: 799,
    });

    const output = await metrics.serialize();
    expect(output).toContain('method="OTHER",route="other",status_class="unknown"');
    expect(output).not.toContain("user-42");
    expect(output).not.toContain("secret-id");
  });
});
