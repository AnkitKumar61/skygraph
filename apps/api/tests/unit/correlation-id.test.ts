import { describe, expect, it } from "vitest";

import { normalizeCorrelationId } from "../../src/presentation/http/middleware/correlation-id.js";

describe("correlation ID normalization", () => {
  it.each(["request-123", "abc.DEF:42", "A_1"])("preserves safe value %s", (value) => {
    expect(normalizeCorrelationId(value)).toBe(value);
  });

  it.each([undefined, "", " leading", "line\nbreak", "a".repeat(65), "<script>"])(
    "replaces unsafe value %s with a UUID",
    (value) => {
      expect(normalizeCorrelationId(value)).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
      );
    },
  );
});
