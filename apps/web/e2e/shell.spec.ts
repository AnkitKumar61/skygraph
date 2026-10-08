import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Route } from "@playwright/test";

test("production shell supports accessible navigation and responsive layout", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Air traffic network lab" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("workspace.png"), fullPage: true });
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.goto("/missing");
  await expect(
    page.getByRole("heading", { level: 1, name: "This view does not exist" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Return to workspace" }).click();
  await expect(page.getByRole("heading", { name: "Air traffic network lab" })).toBeVisible();
  expect(errors).toEqual([]);
});
test("offline status provides recovery without fabricated data", async ({ page }, testInfo) => {
  await page.route("**/health/live", (route) => route.abort());
  await page.goto("/status");
  await expect(
    page.getByRole("heading", { name: "Service health could not be confirmed" }),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Retry connection" })).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("offline.png"), fullPage: true });
  await page.unroute("**/health/live");
  let resolveRequest: (route: Route) => void = () => {
    throw new Error("Request capture was not initialized");
  };
  const request = new Promise<Route>((resolve) => {
    resolveRequest = resolve;
  });
  await page.route("**/health/live", (route) => resolveRequest(route));
  await page.getByRole("button", { name: "Retry connection" }).click();
  const pending = await request;
  await expect(page.getByRole("button", { name: "Checking the service…" })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Checking for a valid health response");
  await page.screenshot({ path: testInfo.outputPath("retry.png"), fullPage: true });
  await pending.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ status: "live" }),
  });
  await expect(page.getByRole("heading", { name: "The API is reachable" })).toBeVisible();
});
test("status handles a successful health response", async ({ page }) => {
  await page.route("**/health/live", (route) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify({ status: "live" }) }),
  );
  await page.goto("/status");
  await expect(page.getByRole("heading", { name: "The API is reachable" })).toBeVisible();
  await page.getByRole("button", { name: "Check again" }).click();
});
