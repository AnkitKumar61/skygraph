import type { LifecycleResource } from "../ports/lifecycle-resource.js";
import type { Logger } from "../ports/logger.js";

export class ShutdownTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Shutdown exceeded its ${timeoutMs.toString()} ms deadline.`);
    this.name = "ShutdownTimeoutError";
  }
}

export class ShutdownCoordinator {
  private shutdownPromise?: Promise<void>;

  constructor(
    private readonly resources: readonly LifecycleResource[],
    private readonly timeoutMs: number,
    private readonly logger: Logger,
  ) {}

  shutdown(reason: string): Promise<void> {
    this.shutdownPromise ??= this.performShutdown(reason);
    return this.shutdownPromise;
  }

  private async performShutdown(reason: string): Promise<void> {
    this.logger.info("Graceful shutdown started", { reason });

    const closeResources = async (): Promise<void> => {
      const failures: unknown[] = [];
      for (const resource of this.resources) {
        this.logger.debug("Closing lifecycle resource", { resource: resource.name });
        try {
          await resource.close();
        } catch (error: unknown) {
          failures.push(error);
          this.logger.error("Lifecycle resource failed to close", {
            errorType: error instanceof Error ? error.name : "UnknownError",
            resource: resource.name,
          });
        }
      }
      if (failures.length > 0) {
        throw new AggregateError(failures, "One or more lifecycle resources failed to close.");
      }
    };

    let timeoutHandle: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new ShutdownTimeoutError(this.timeoutMs)),
        this.timeoutMs,
      );
    });

    try {
      await Promise.race([closeResources(), timeout]);
      this.logger.info("Graceful shutdown completed", { reason });
    } finally {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    }
  }
}
