import { Counter, Histogram, Registry } from "prom-client";

import type { HttpRequestMeasurement, Metrics } from "../../application/ports/metrics.js";

const ALLOWED_METHODS = new Set(["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]);
const ALLOWED_ROUTES = new Set(["/health/live", "/health/ready", "/metrics", "unmatched"]);

export class PrometheusMetrics implements Metrics {
  readonly contentType: string;
  private readonly requestCount: Counter;
  private readonly requestDuration: Histogram;

  constructor(private readonly registry = new Registry()) {
    this.contentType = registry.contentType;
    this.requestCount = new Counter({
      help: "Total HTTP requests handled by the SkyGraph API.",
      labelNames: ["method", "route", "status_class"],
      name: "skygraph_http_requests_total",
      registers: [registry],
    });
    this.requestDuration = new Histogram({
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
      help: "SkyGraph API HTTP request duration in seconds.",
      labelNames: ["method", "route", "status_class"],
      name: "skygraph_http_request_duration_seconds",
      registers: [registry],
    });
  }

  observeHttpRequest(measurement: HttpRequestMeasurement): void {
    const labels = {
      method: ALLOWED_METHODS.has(measurement.method) ? measurement.method : "OTHER",
      route: ALLOWED_ROUTES.has(measurement.route) ? measurement.route : "other",
      status_class: this.toStatusClass(measurement.statusCode),
    };
    this.requestCount.inc(labels);
    this.requestDuration.observe(labels, Math.max(0, measurement.durationSeconds));
  }

  serialize(): Promise<string> {
    return this.registry.metrics();
  }

  private toStatusClass(statusCode: number): string {
    if (!Number.isInteger(statusCode) || statusCode < 100 || statusCode > 599) {
      return "unknown";
    }
    return `${Math.floor(statusCode / 100).toString()}xx`;
  }
}
