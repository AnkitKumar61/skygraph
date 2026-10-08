import { createApiRuntime } from "./composition-root.js";
import { loadRuntimeConfig } from "./infrastructure/config/runtime-config.js";

async function run(): Promise<void> {
  try {
    const config = loadRuntimeConfig(process.env);
    const runtime = createApiRuntime(config);
    await runtime.start();

    const beginShutdown = (signal: NodeJS.Signals): void => {
      void runtime.shutdown(signal).catch((error: unknown) => {
        runtime.logger.error("Graceful shutdown failed", {
          errorType: error instanceof Error ? error.name : "UnknownError",
        });
        process.exitCode = 1;
      });
    };

    process.once("SIGINT", beginShutdown);
    process.once("SIGTERM", beginShutdown);
  } catch (error: unknown) {
    const safeFailure = {
      level: "fatal",
      message: "SkyGraph API failed to start.",
      errorType: error instanceof Error ? error.name : "UnknownError",
    };
    process.stderr.write(`${JSON.stringify(safeFailure)}\n`);
    process.exitCode = 1;
  }
}

await run();
