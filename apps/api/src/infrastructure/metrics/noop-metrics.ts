import type { HttpRequestMeasurement, Metrics } from "../../application/ports/metrics.js";

export class NoopMetrics implements Metrics {
  readonly contentType = "text/plain; charset=utf-8";

  observeHttpRequest(measurement: HttpRequestMeasurement): void {
    void measurement;
  }

  serialize(): Promise<string> {
    return Promise.resolve("");
  }
}
