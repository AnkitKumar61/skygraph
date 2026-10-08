export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function toApiError(status: number, body: unknown): ApiError {
  if (typeof body === "object" && body !== null && "error" in body) {
    const envelope = body.error;
    if (
      typeof envelope === "object" &&
      envelope !== null &&
      "code" in envelope &&
      "message" in envelope &&
      typeof envelope.code === "string" &&
      typeof envelope.message === "string" &&
      envelope.code.length <= 100 &&
      envelope.message.length <= 500
    ) {
      return new ApiError(status, envelope.code, envelope.message);
    }
  }
  return new ApiError(status, "REQUEST_FAILED", "The service could not complete this request.");
}
