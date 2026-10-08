import type { ReadinessResponse } from "@skygraph/shared-types";

import type { Clock } from "../ports/clock.js";
import type { Logger } from "../ports/logger.js";
import type { ReadinessProbe } from "../ports/readiness-probe.js";

export class GetReadiness {
  constructor(
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly probes: readonly ReadinessProbe[],
  ) {}

  async execute(): Promise<ReadinessResponse> {
    const results = await Promise.all(
      this.probes.map(async (probe) => {
        try {
          return [probe.name, { available: await probe.check() }] as const;
        } catch (error: unknown) {
          this.logger.warn("Readiness probe failed", {
            component: probe.name,
            errorType: error instanceof Error ? error.name : "UnknownError",
          });
          return [probe.name, { available: false }] as const;
        }
      }),
    );
    const components = Object.fromEntries(results);
    const isReady = results.every(([, result]) => result.available);

    return {
      status: isReady ? "ready" : "not_ready",
      timestamp: this.clock.now().toISOString(),
      components,
    };
  }
}
