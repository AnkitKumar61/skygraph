import { describe, expect, it } from "vitest";

import type { LifecycleResource } from "../../src/application/ports/lifecycle-resource.js";
import {
  ShutdownCoordinator,
  ShutdownTimeoutError,
} from "../../src/application/lifecycle/shutdown-coordinator.js";
import { MemoryLogger } from "../support/fakes.js";

function resource(name: string, close: () => Promise<void>): LifecycleResource {
  return { name, close };
}

describe("shutdown coordinator", () => {
  it("closes resources in declared order", async () => {
    const order: string[] = [];
    const coordinator = new ShutdownCoordinator(
      [
        resource("http", () => {
          order.push("http");
          return Promise.resolve();
        }),
        resource("database", () => {
          order.push("database");
          return Promise.resolve();
        }),
      ],
      1_000,
      new MemoryLogger(),
    );

    await coordinator.shutdown("test");
    expect(order).toEqual(["http", "database"]);
  });

  it("is idempotent and returns the same shutdown promise", async () => {
    let closeCount = 0;
    const coordinator = new ShutdownCoordinator(
      [
        resource("http", () => {
          closeCount += 1;
          return Promise.resolve();
        }),
      ],
      1_000,
      new MemoryLogger(),
    );

    const first = coordinator.shutdown("SIGTERM");
    const second = coordinator.shutdown("SIGINT");
    expect(first).toBe(second);
    await first;
    expect(closeCount).toBe(1);
  });

  it("enforces the shutdown deadline", async () => {
    const coordinator = new ShutdownCoordinator(
      [resource("stuck", () => new Promise(() => undefined))],
      20,
      new MemoryLogger(),
    );

    await expect(coordinator.shutdown("test-timeout")).rejects.toBeInstanceOf(ShutdownTimeoutError);
  });

  it("continues closing resources and reports failures", async () => {
    const order: string[] = [];
    const coordinator = new ShutdownCoordinator(
      [
        resource("broken", () => {
          order.push("broken");
          return Promise.reject(new Error("close failed"));
        }),
        resource("healthy", () => {
          order.push("healthy");
          return Promise.resolve();
        }),
      ],
      1_000,
      new MemoryLogger(),
    );

    await expect(coordinator.shutdown("test-failure")).rejects.toBeInstanceOf(AggregateError);
    expect(order).toEqual(["broken", "healthy"]);
  });
});
