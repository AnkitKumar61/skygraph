import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

export const CORRELATION_ID_HEADER = "x-correlation-id";
const SAFE_CORRELATION_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/u;

export function normalizeCorrelationId(value: string | undefined): string {
  if (value !== undefined && SAFE_CORRELATION_ID.test(value)) {
    return value;
  }
  return randomUUID();
}

export function correlationIdMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const correlationId = normalizeCorrelationId(request.get(CORRELATION_ID_HEADER));
  response.locals.correlationId = correlationId;
  response.setHeader(CORRELATION_ID_HEADER, correlationId);
  next();
}
