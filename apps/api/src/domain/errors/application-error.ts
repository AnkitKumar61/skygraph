export type ErrorCategory =
  | "validation"
  | "not_found"
  | "method_not_allowed"
  | "payload_too_large"
  | "service_unavailable"
  | "internal";

export type SafeErrorDetails = Readonly<Record<string, string | readonly string[]>>;

export class ApplicationError extends Error {
  readonly category: ErrorCategory;
  readonly code: string;
  readonly details: SafeErrorDetails | undefined;

  constructor(options: {
    category: ErrorCategory;
    code: string;
    message: string;
    details?: SafeErrorDetails;
    cause?: unknown;
  }) {
    super(options.message, { cause: options.cause });
    this.name = "ApplicationError";
    this.category = options.category;
    this.code = options.code;
    this.details = options.details;
  }
}
