import { expect, it } from "vitest";

import { WORKSPACE_API_VERSION } from "../src/workspace-contract.js";

it("resolves the shared runtime contract through its workspace dependency", () => {
  expect(WORKSPACE_API_VERSION).toBe("v1");
});
