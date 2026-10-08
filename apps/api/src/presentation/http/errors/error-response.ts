import type { ErrorEnvelope } from "@skygraph/shared-types";
import type { ErrorRequestHandler } from "express";

import type { Logger } from "../../../application/ports/logger.js";
import { ApplicationError, type ErrorCategory } from "../../../domain/errors/application-error.js";

interface MappedError {
  readonly envelope: ErrorEnvelope;
  readonly statusCode: number;
}

const STATUS_BY_CATEGORY: Readonly<Record<ErrorCategory, number>> = {
  validation: 400,
  not_found: 404,
  method_not_allowed: 405,
  payload_too_large: 413,
  service_unavailable: 503,
  internal: 500,
};

function isExpressBodyError(error: unknown, type: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    (error as { type?: unknown }).type === type
  );
}

export function mapError(error: unknown): MappedError {
  let applicationError: ApplicationError;

  if (error instanceof ApplicationError) {
    applicationError = error;
  } else if (isExpressBodyError(error, "entity.parse.failed")) {
    applicationError = new ApplicationError({
      category: "validation",
      code: "INVALID_JSON",
      message: "The request body is not valid JSON.",
    });
  } else if (isExpressBodyError(error, "entity.too.large")) {
    applicationError = new ApplicationError({
      category: "payload_too_large",
      code: "REQUEST_BODY_TOO_LARGE",
      message: "The request body exceeds the configured limit.",
    });
  } else {
    applicationError = new ApplicationError({
      category: "internal",
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
      cause: error,
    });
  }

  return {
    statusCode: STATUS_BY_CATEGORY[applicationError.category],
    envelope: {
      error: {
        code: applicationError.code,
        message: applicationError.message,
        ...(applicationError.details === undefined ? {} : { details: applicationError.details }),
      },
    },
  };
}

export function createErrorHandler(logger: Logger): ErrorRequestHandler {
  return (error, _request, response, _next): void => {
    void _next;
    const mapped = mapError(error);
    const correlationId = response.locals.correlationId as string | undefined;

    if (mapped.statusCode >= 500) {
      logger.error("HTTP request failed", {
        correlationId,
        errorType: error instanceof Error ? error.name : "UnknownError",
        statusCode: mapped.statusCode,
      });
    }

    response.status(mapped.statusCode).json(mapped.envelope);
  };
}
