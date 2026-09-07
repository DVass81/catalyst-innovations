import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("homepage keeps the primary action in the first desktop view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("working better.");
  const action = page.getByRole("link", { name: /Explore the demos/ }).first();
  await expect(action).toBeVisible();
  const box = await action.boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(720);
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
});
test("hero decision carries into the full manufacturing demonstration", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try approval" }).click();
  await page
    .getByRole("link", { name: /Explore the demos/ })
    .first()
    .click();
  await expect(page.locator(".ci-demo-stats")).toContainText("$2,400");
  await expect(
    page.getByRole("button", { name: "Approve Replacement pump" }),
  ).toHaveCount(0);
});
test("manufacturing return, approval and reset preserve a clear history", async ({
  page,
}) => {
  await page.goto("/demo-lab");
  await page
    .getByRole("button", { name: "Return Replacement pump", exact: true })
    .click();
  await page
    .getByLabel("What needs to change?")
    .fill("Please confirm the quantity");
  await page.getByRole("button", { name: "Return with reason" }).click();
  await expect(page.locator(".ci-return-reason")).toHaveText(
    "Reason: Please confirm the quantity",
  );
  await page
    .getByRole("button", { name: "Approve Safety equipment", exact: true })
    .click();
  await expect(page.locator(".ci-demo-stats")).toContainText("$680");
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Approve Replacement pump", exact: true }),
  ).toBeEnabled();
  await expect(page.locator(".ci-demo-stats")).toContainText("$0");
});
test("field service prevents overlaps and requires a completed checklist", async ({
  page,
}) => {
  await page.goto("/demo-lab?industry=field-service");
  await page.getByRole("button", { name: "Assign job", exact: true }).click();
  await expect(page.locator(".ci-demo-message")).toContainText(
    "Schedule conflict",
  );
  await expect(page.getByLabel("Equipment inspected")).toBeDisabled();
  await page.getByLabel("Technician", { exact: true }).selectOption("Morgan");
  await page.getByRole("button", { name: "Assign job", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Complete job", exact: true }),
  ).toBeDisabled();
  for (const label of [
    "Equipment inspected",
    "Service completed",
    "Completion notes recorded",
  ])
    await page.getByLabel(label).check();
  await page.getByRole("button", { name: "Complete job", exact: true }).click();
  await expect(page.locator(".ci-demo-message")).toContainText("Job complete");
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(page.locator(".ci-demo-stats")).toContainText("Unassigned");
});
test("professional services requires missing information and preserves consultation context", async ({
  page,
}) => {
  await page.goto("/demo-lab?industry=professional-services");
  await expect(
    page.getByRole("button", { name: "Approve handoff", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Access details confirmed").check();
  await page
    .getByRole("button", { name: "Approve handoff", exact: true })
    .click();
  await expect(page.locator(".ci-demo-message")).toContainText(
    "Taylor is the owner",
  );
  await page
    .getByRole("link", { name: "Discuss a workflow like this" })
    .click();
  await expect(page.locator(".ci-context-note")).toContainText(
    "professional services",
  );
});
test("industry tabs support arrow and end keys", async ({ page }) => {
  await page.goto("/demo-lab");
  await page.getByRole("tab", { name: /Manufacturing/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Field service/ })).toBeFocused();
  await expect(
    page.getByRole("tab", { name: /Field service/ }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: /Professional services/ }),
  ).toBeFocused();
});
test("short inquiry handles validation, delivery failure, retry and duplicate clicks", async ({
  page,
}) => {
  await page.goto("/consultation");
  await page.getByRole("button", { name: "Send your request" }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
  await page.getByLabel("Your name", { exact: true }).fill("Controlled Test");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("test@example.com");
  await page
    .getByRole("textbox", { name: "Company", exact: true })
    .fill("Controlled Test Company");
  await page
    .getByLabel("What would you like to work better?")
    .fill("A controlled test of approval workflows.");
  await page.route("**/api/consultation", (route) =>
    route.fulfill({
      status: 503,
      json: { ok: false, error: "Delivery is unavailable. Please try again." },
    }),
  );
  await page.getByRole("button", { name: "Send your request" }).click();
  await expect(page.locator(".ci-form-error")).toContainText(
    "Delivery is unavailable",
  );
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Controlled Test",
  );
  await page.unroute("**/api/consultation");
  let requests = 0;
  await page.route("**/api/consultation", async (route) => {
    requests++;
    await new Promise((r) => setTimeout(r, 300));
    await route.fulfill({ json: { ok: true } });
  });
  await page.getByRole("button", { name: "Send your request" }).dblclick();
  await expect(
    page.getByRole("heading", { name: "Your request is on its way." }),
  ).toBeVisible();
  expect(requests).toBe(1);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(
    "Controlled Test",
  );
});
test("calculator cost arithmetic and printable report match inputs", async ({
  page,
}) => {
  await page.goto("/roi-estimator");
  await page
    .getByLabel("One-time project cost ($)", { exact: true })
    .fill("20000");
  await expect(page.locator(".ci-roi-results")).toContainText("$24,500");
  const popup = page.waitForEvent("popup");
  await page
    .getByRole("button", { name: "Print / save estimate as PDF" })
    .click();
  const report = await popup;
  await expect(report.locator("body")).toContainText("20,000");
  await expect(report.locator("body")).toContainText("$24,500");
  await expect(report.locator("body")).toContainText(
    "not automatically reduced payroll",
  );
  await report.close();
});
test("mobile pages reflow and the menu closes with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/pricing",
    "/about",
    "/consultation",
    "/demo-lab",
    "/roi-estimator",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  const menu = page.getByRole("button", { name: /Open menu/ });
  await menu.click();
  await expect(
    page.getByRole("link", { name: "Pricing", exact: true }).first(),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});
test("core pages meet automated WCAG checks", async ({ page }) => {
  for (const route of [
    "/",
    "/demo-lab",
    "/pricing",
    "/consultation",
    "/roi-estimator",
    "/about",
    "/founders",
    "/contact",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect
      .soft(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        route,
      )
      .toEqual([]);
  }
});
test("public routes retain canonical metadata and portal stays private from indexing", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/solutions",
    "/industries",
    "/method",
    "/portfolio",
    "/pricing",
    "/about",
    "/founders",
    "/contact",
    "/consultation",
    "/demo-lab",
    "/roi-estimator",
    "/privacy",
    "/terms",
    "/accessibility",
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://mycatalystinnovations.com" + (route === "/" ? "" : route),
    );
  }
  await page.goto("/portal");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
test("API rejects malformed and excessive requests", async ({ request }) => {
  expect(
    (
      await request.post("/api/consultation", { data: { email: "bad" } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/consultation", {
        data: { challenge: "x".repeat(25000) },
      })
    ).status(),
  ).toBe(413);
});
test("opening animation pauses, completes and plays once per session", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto((process.env.TEST_BASE_URL || "http://localhost:3000") + "/");
  await page.getByRole("button", { name: "Pause opening animation" }).click();
  const before = await page
    .locator(".ci-scene-progress span")
    .getAttribute("style");
  await page.waitForTimeout(350);
  expect(
    await page.locator(".ci-scene-progress span").getAttribute("style"),
  ).toBe(before);
  await page.getByRole("button", { name: "Resume opening animation" }).click();
  await expect(
    page.getByRole("button", { name: "Pause opening animation" }),
  ).toBeDisabled({ timeout: 9000 });
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Pause opening animation" }),
  ).toBeDisabled();
  await context.close();
});
