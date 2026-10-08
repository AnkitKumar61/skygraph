import pino, { type DestinationStream, type Logger as PinoInstance } from "pino";

import type { LogContext, Logger } from "../../application/ports/logger.js";
import type { RuntimeConfig } from "../config/runtime-config.js";

const REDACTED_PATHS = [
  "authorization",
  "cookie",
  "password",
  "secret",
  "token",
  "*.authorization",
  "*.cookie",
  "*.password",
  "*.secret",
  "*.token",
  "*.databaseUrl",
  "*.redisUrl",
] as const;

export class PinoLogger implements Logger {
  constructor(private readonly instance: PinoInstance) {}

  debug(message: string, context: LogContext = {}): void {
    this.instance.debug(context, message);
  }

  info(message: string, context: LogContext = {}): void {
    this.instance.info(context, message);
  }

  warn(message: string, context: LogContext = {}): void {
    this.instance.warn(context, message);
  }

  error(message: string, context: LogContext = {}): void {
    this.instance.error(context, message);
  }
}

export function createPinoLogger(
  config: Pick<RuntimeConfig, "environment" | "logLevel">,
  destination?: DestinationStream,
): PinoLogger {
  const instance = pino(
    {
      base: {
        environment: config.environment,
        service: "skygraph-api",
      },
      level: config.logLevel,
      messageKey: "message",
      redact: {
        censor: "[REDACTED]",
        paths: [...REDACTED_PATHS],
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    destination,
  );

  return new PinoLogger(instance);
}
