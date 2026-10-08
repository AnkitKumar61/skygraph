import express, { type Express } from "express";
import helmet from "helmet";

import type { Logger } from "../../application/ports/logger.js";
import type { Metrics } from "../../application/ports/metrics.js";
import type { GetLiveness } from "../../application/use-cases/get-liveness.js";
import type { GetReadiness } from "../../application/use-cases/get-readiness.js";
import { ApplicationError } from "../../domain/errors/application-error.js";
import { createErrorHandler } from "./errors/error-response.js";
import { correlationIdMiddleware } from "./middleware/correlation-id.js";
import { createRequestTelemetry } from "./middleware/request-telemetry.js";
import { createHealthRouter } from "./routes/health-routes.js";
import { createMetricsRouter } from "./routes/metrics-route.js";

export interface HttpApplicationDependencies {
  readonly bodyLimitBytes: number;
  readonly getLiveness: GetLiveness;
  readonly getReadiness: GetReadiness;
  readonly logger: Logger;
  readonly metrics: Metrics;
  readonly metricsEnabled: boolean;
}

export function createHttpApplication(dependencies: HttpApplicationDependencies): Express {
  const application = express();
  application.disable("x-powered-by");
  application.use(helmet());
  application.use(correlationIdMiddleware);
  application.use(createRequestTelemetry(dependencies.logger, dependencies.metrics));
  application.use(express.json({ limit: dependencies.bodyLimitBytes, strict: true }));
  application.use(
    "/health",
    createHealthRouter(dependencies.getLiveness, dependencies.getReadiness),
  );

  if (dependencies.metricsEnabled) {
    application.use("/metrics", createMetricsRouter(dependencies.metrics));
  }

  application.use(() => {
    throw new ApplicationError({
      category: "not_found",
      code: "NOT_FOUND",
      message: "The requested resource was not found.",
    });
  });
  application.use(createErrorHandler(dependencies.logger));

  return application;
}
