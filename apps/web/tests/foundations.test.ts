import { describe, expect, it } from "vitest";

import { ApiError, toApiError } from "../src/shared/api/api-error.js";
import { parsePublicConfig } from "../src/shared/api/config.js";
import { retryRequest } from "../src/shared/api/query-client.js";
import { createLiveFlightStore } from "../src/shared/live/live-flight-store.js";
import { createUiStore } from "../src/shared/state/ui-store.js";
import { motionPolicy } from "../src/shared/motion/motion-policy.js";

describe("web foundation contracts", () => {
  it("accepts public URLs and rejects secrets and insecure production transports", () => {
    expect(
      parsePublicConfig({
        VITE_API_BASE_URL: "https://api.example/api/v1",
        VITE_WS_URL: "wss://api.example",
      }),
    ).toMatchObject({ apiBaseUrl: "https://api.example/api/v1" });
    for (const value of [
      undefined,
      "broken",
      "javascript:alert(1)",
      "https://user:secret@example.com",
      "https://example.com?token=secret",
    ]) {
      expect(() =>
        parsePublicConfig({ VITE_API_BASE_URL: value, VITE_WS_URL: "wss://example.com" }),
      ).toThrow();
    }
    expect(() =>
      parsePublicConfig({
        PROD: true,
        VITE_API_BASE_URL: "http://example.com",
        VITE_WS_URL: "ws://example.com",
      }),
    ).toThrow("HTTPS");
  });
  it("bounds retries and does not retry deterministic client failures", () => {
    expect(retryRequest(0, new ApiError(400, "INVALID", "Invalid"))).toBe(false);
    expect(retryRequest(1, new ApiError(503, "UNAVAILABLE", "Unavailable"))).toBe(true);
    expect(retryRequest(2, new Error("network"))).toBe(false);
  });
  it("maps only safe envelope shapes", () => {
    expect(
      toApiError(400, { error: { code: "INVALID", message: "Fix the input." } }),
    ).toMatchObject({ status: 400, code: "INVALID" });
    expect(toApiError(500, { stack: "secret" }).message).not.toContain("secret");
  });
  it("does not notify algorithm subscribers when only the viewport changes", () => {
    const store = createUiStore();
    let notifications = 0;
    const unsubscribe = store.subscribe(
      (state) => state.selectedAlgorithm,
      () => {
        notifications += 1;
      },
    );
    store.getState().setViewport({ latitude: 0, longitude: 0, zoom: 3 });
    expect(notifications).toBe(0);
    store.getState().selectAlgorithm("astar");
    expect(notifications).toBe(1);
    expect(() => store.getState().setViewport({ latitude: NaN, longitude: 0, zoom: 3 })).toThrow();
    unsubscribe();
  });
  it("normalizes live data, ignores stale updates, and notifies only the affected aircraft", () => {
    const store = createLiveFlightStore();
    let relevant = 0;
    let unrelated = 0;
    const unsubscribe = store.subscribe("abc123", () => {
      relevant += 1;
    });
    store.subscribe("def456", () => {
      unrelated += 1;
    });
    for (let time = 0; time < 1_000; time += 1)
      store.update({ aircraftId: "abc123", latitude: 0, longitude: 1, observedAt: time });
    expect(relevant).toBe(1_000);
    expect(unrelated).toBe(0);
    expect(store.update({ aircraftId: "abc123", latitude: 0, longitude: 0, observedAt: 1 })).toBe(
      false,
    );
    expect(() =>
      store.update({ aircraftId: "bad:id", latitude: 0, longitude: 0, observedAt: 2 }),
    ).toThrow();
    unsubscribe();
    store.remove("abc123");
    expect(store.getPosition("abc123")).toBeUndefined();
    expect(relevant).toBe(1_000);
  });
  it("disables optional motion when reduced motion is requested", () => {
    expect(motionPolicy(true)).toEqual({ animate: false, durationSeconds: 0 });
  });
});
