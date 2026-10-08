import type { Logger } from "./application/ports/logger.js";
import type { Metrics } from "./application/ports/metrics.js";
import type { ReadinessProbe } from "./application/ports/readiness-probe.js";
import {
  ShutdownCoordinator,
  ShutdownTimeoutError,
} from "./application/lifecycle/shutdown-coordinator.js";
import { GetLiveness } from "./application/use-cases/get-liveness.js";
import { GetReadiness } from "./application/use-cases/get-readiness.js";
import type { RuntimeConfig } from "./infrastructure/config/runtime-config.js";
import { SystemClock } from "./infrastructure/clock/system-clock.js";
import { createPinoLogger } from "./infrastructure/logging/pino-logger.js";
import { NoopMetrics } from "./infrastructure/metrics/noop-metrics.js";
import { PrometheusMetrics } from "./infrastructure/metrics/prometheus-metrics.js";
import { createHttpApplication } from "./presentation/http/create-http-application.js";
import { HttpServer, type ListeningAddress } from "./presentation/http/http-server.js";

export interface ApiRuntimeOverrides {
  readonly logger?: Logger;
  readonly metrics?: Metrics;
  readonly readinessProbes?: readonly ReadinessProbe[];
}

export interface ApiRuntime {
  readonly logger: Logger;
  shutdown(reason: string): Promise<void>;
  start(): Promise<ListeningAddress>;
}

export function createApiRuntime(
  config: RuntimeConfig,
  overrides: ApiRuntimeOverrides = {},
): ApiRuntime {
  const clock = new SystemClock();
  const logger = overrides.logger ?? createPinoLogger(config);
  const metrics =
    overrides.metrics ?? (config.metricsEnabled ? new PrometheusMetrics() : new NoopMetrics());
  const getLiveness = new GetLiveness(clock);
  const getReadiness = new GetReadiness(clock, logger, overrides.readinessProbes ?? []);
  const application = createHttpApplication({
    bodyLimitBytes: config.requestBodyLimitBytes,
    getLiveness,
    getReadiness,
    logger,
    metrics,
    metricsEnabled: config.metricsEnabled,
  });
  const httpServer = new HttpServer(application);
  const shutdownCoordinator = new ShutdownCoordinator(
    [httpServer],
    config.shutdownTimeoutMs,
    logger,
  );

  return {
    logger,
    start: async () => {
      const address = await httpServer.start(config.host, config.port);
      logger.info("SkyGraph API listening", { host: address.host, port: address.port });
      return address;
    },
    shutdown: async (reason) => {
      try {
        await shutdownCoordinator.shutdown(reason);
      } catch (error: unknown) {
        if (error instanceof ShutdownTimeoutError) {
          httpServer.forceClose();
        }
        throw error;
      }
    },
  };
}
