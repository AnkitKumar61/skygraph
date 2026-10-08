import { describe, expect, it } from "vitest";

import { ApplicationError } from "../../src/domain/errors/application-error.js";
import { mapError } from "../../src/presentation/http/errors/error-response.js";

describe("HTTP error mapping", () => {
  it.each([
    ["validation", 400],
    ["not_found", 404],
    ["method_not_allowed", 405],
    ["payload_too_large", 413],
    ["service_unavailable", 503],
    ["internal", 500],
  ] as const)("maps %s errors to status %i", (category, expectedStatus) => {
    const result = mapError(
      new ApplicationError({ category, code: "SAFE_CODE", message: "Safe message." }),
    );

    expect(result.statusCode).toBe(expectedStatus);
    expect(result.envelope).toEqual({ error: { code: "SAFE_CODE", message: "Safe message." } });
  });

  it("hides unexpected error messages and stacks", () => {
    const result = mapError(new Error("secret filesystem path C:\\private"));

    expect(result).toEqual({
      statusCode: 500,
      envelope: {
        error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
      },
    });
  });
});
