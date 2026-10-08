import type { NextFunction, Request, Response } from "express";

import type { Logger } from "../../../application/ports/logger.js";
import type { Metrics } from "../../../application/ports/metrics.js";

function matchedRoute(request: Request): string {
  const route = request.route as { path?: unknown } | undefined;
  if (typeof route?.path !== "string") {
    return "unmatched";
  }
  return `${request.baseUrl}${route.path}` || route.path;
}

export function createRequestTelemetry(logger: Logger, metrics: Metrics) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const startedAt = process.hrtime.bigint();

    response.once("finish", () => {
      const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
      const route = matchedRoute(request);
      metrics.observeHttpRequest({
        durationSeconds,
        method: request.method,
        route,
        statusCode: response.statusCode,
      });
      logger.info("HTTP request completed", {
        correlationId: response.locals.correlationId,
        durationMs: Number((durationSeconds * 1_000).toFixed(3)),
        method: request.method,
        route,
        statusCode: response.statusCode,
      });
    });

    next();
  };
}
