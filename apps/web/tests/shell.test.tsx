// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApplicationRoutes } from "../src/app/Application.js";
import { createQueryClient } from "../src/shared/api/query-client.js";
import { LiveFlightProvider, useFlightPosition } from "../src/shared/live/LiveFlightProvider.js";
import { createLiveFlightStore } from "../src/shared/live/live-flight-store.js";
import { ErrorBoundary } from "../src/shared/ui/ErrorBoundary.js";
import { StatePanel } from "../src/shared/ui/States.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function shell(path = "/") {
  const client = createQueryClient();
  client.setDefaultOptions({ queries: { retry: false } });
  return render(
    <QueryClientProvider client={client}>
      <LiveFlightProvider>
        <MemoryRouter initialEntries={[path]}>
          <ApplicationRoutes />
        </MemoryRouter>
      </LiveFlightProvider>
    </QueryClientProvider>,
  );
}
describe("application shell", () => {
  it("renders semantic landmarks and truthful empty state", () => {
    shell();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeDefined();
    expect(screen.getByRole("main")).toBeDefined();
    expect(screen.getByText("No flight feed connected")).toBeDefined();
  });
  it("provides a working unknown-route recovery", async () => {
    shell("/missing");
    expect(
      screen.getByRole("heading", { level: 1, name: "This view does not exist" }),
    ).toBeDefined();
    await userEvent.click(screen.getByRole("link", { name: "Return to workspace" }));
    expect(screen.getByRole("heading", { name: "Air traffic network lab" })).toBeDefined();
  });
  it("renders API offline and offers retry without losing navigation", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example/api/v1");
    vi.stubEnv("VITE_WS_URL", "wss://api.example");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));
    shell("/status");
    expect(
      await screen.findByRole("heading", { name: "Service health could not be confirmed" }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Retry connection" })).toBeDefined();
  });
  it("announces pending recovery and prevents duplicate retry actions", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example/api/v1");
    vi.stubEnv("VITE_WS_URL", "wss://api.example");
    let complete: (value: Response) => void = () => {
      throw new Error("Retry was not started");
    };
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("network"))
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            complete = resolve;
          }),
      );
    vi.stubGlobal("fetch", fetchMock);
    shell("/status");
    await userEvent.click(await screen.findByRole("button", { name: "Retry connection" }));
    const retry = await screen.findByRole("button", { name: "Checking the service…" });
    expect((retry as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("status").textContent).toContain(
      "Checking for a valid health response",
    );
    await userEvent.click(retry);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    act(() => {
      complete(new Response(JSON.stringify({ status: "live" })));
    });
    expect(await screen.findByRole("heading", { name: "The API is reachable" })).toBeDefined();
  });
  it.each([
    [200, { status: "unexpected" }],
    [503, { error: { code: "unavailable", message: "private internal detail" } }],
  ])("does not mislabel a received %s response as a connection failure", async (status, body) => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example/api/v1");
    vi.stubEnv("VITE_WS_URL", "wss://api.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })),
    );
    shell("/status");
    expect(
      await screen.findByRole("heading", { name: "Service health could not be confirmed" }),
    ).toBeDefined();
    expect(screen.queryByText("private internal detail")).toBeNull();
  });
  it("renders a live response and supports a deliberate refresh", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example/api/v1");
    vi.stubEnv("VITE_WS_URL", "wss://api.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "live" }))),
    );
    shell("/status");
    expect(await screen.findByRole("heading", { name: "The API is reachable" })).toBeDefined();
  });
  it.each([true, false])(
    "uses the correct health origin when development is %s",
    async (development) => {
      vi.stubEnv("DEV", development);
      vi.stubEnv("VITE_API_BASE_URL", "https://api.example/api/v1");
      vi.stubEnv("VITE_WS_URL", "wss://api.example");
      const fetchMock = vi
        .fn<typeof fetch>()
        .mockResolvedValue(new Response(JSON.stringify({ status: "live" })));
      vi.stubGlobal("fetch", fetchMock);
      shell("/status");
      await screen.findByRole("heading", { name: "The API is reachable" });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0]?.[0]).toEqual(
        new URL("/health/live", development ? window.location.origin : "https://api.example"),
      );
      expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
    },
  );
  it("escapes untrusted text and announces loading", () => {
    render(
      <StatePanel kind="loading" title="Loading">
        {"<img src=x onerror=alert(1)>"}
      </StatePanel>,
    );
    expect(screen.getByRole("status")).toBeDefined();
    expect(document.querySelector("img")).toBeNull();
  });
  it("recovers after a child failure without rendering its private message", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    let fail = true;
    function Faulty() {
      if (fail) throw new Error("private credential");
      return <p>Recovered</p>;
    }
    render(
      <ErrorBoundary>
        <Faulty />
      </ErrorBoundary>,
    );
    expect(screen.queryByText("private credential")).toBeNull();
    expect(
      screen.getByRole("heading", { level: 1, name: "The workspace could not open" }),
    ).toBeDefined();
    fail = false;
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByText("Recovered")).toBeDefined();
  });
  it("keeps unrelated consumers stable under a batch of 1000 updates", () => {
    const store = createLiveFlightStore();
    let targetRenders = 0;
    let otherRenders = 0;
    function Target() {
      targetRenders += 1;
      const position = useFlightPosition("abc123");
      return <p>{position?.observedAt ?? "empty"}</p>;
    }
    function Other() {
      otherRenders += 1;
      useFlightPosition("def456");
      return <p>other</p>;
    }
    render(
      <LiveFlightProvider store={store}>
        <Target />
        <Other />
      </LiveFlightProvider>,
    );
    act(() => {
      for (let time = 0; time < 1000; time += 1)
        store.update({ aircraftId: "abc123", latitude: 0, longitude: 0, observedAt: time });
    });
    expect(otherRenders).toBe(1);
    expect(targetRenders).toBe(2);
    expect(screen.getByText("999")).toBeDefined();
  });
});
