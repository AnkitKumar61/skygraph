import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://127.0.0.1:4311" });

test("local service status reaches the real API through the development proxy", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const healthResponse = page.waitForResponse("http://127.0.0.1:4311/health/live");
  await page.goto("/status");
  const response = await healthResponse;
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ status: "live" });
  expect(response.headers()["x-correlation-id"]).toBeTruthy();
  await expect(page.getByRole("heading", { name: "The API is reachable" })).toBeVisible();
  const refresh = page.waitForResponse("http://127.0.0.1:4311/health/live");
  await page.getByRole("button", { name: "Check again" }).click();
  expect((await refresh).status()).toBe(200);
  await expect(page.getByRole("button", { name: "Check again" })).toBeEnabled();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("link", { name: "Workspace", exact: true }).click();
  await expect(page.getByText("No flight feed connected")).toBeVisible();
  expect(errors).toEqual([]);
});

test("workspace reflows at the minimum supported width with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole("link", { name: "Check service status" }).click();
  await expect(page.getByRole("heading", { name: "The API is reachable" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
