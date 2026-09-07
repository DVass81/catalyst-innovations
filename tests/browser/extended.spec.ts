import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("search supports empty results, arrows, Escape, close and focus return", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Search website",
    exact: true,
  });
  await trigger.click();
  const field = page.getByRole("combobox", { name: "Search website content" });
  await expect(field).toBeFocused();
  await field.fill("unfindablephrase");
  await expect(
    page.getByText("No matches. Try a different term."),
  ).toBeVisible();
  await field.fill("procurement");
  await expect(page.getByRole("option").first()).toContainText(/Procurement/);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close search" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await field.fill("pricing");
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/pricing$/);
});
test("assessment industry branches finish, carry a recommendation, and reset", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const first of [
    "Manufacturer or industrial operation",
    "Financial institution or credit union",
    "Contractor or field-service business",
    "Professional services / office-based",
  ]) {
    await page.goto("/roi-estimator#assessment");
    for (const choice of [
      first,
      "Purchasing / procurement",
      "Slow approvals and weak controls",
      "A department (11–50)",
      "Existing software that doesn't fit",
      "Control and audit readiness",
      "This quarter",
    ]) {
      await page.getByRole("button", { name: choice, exact: true }).click();
    }
    await expect(
      page.getByText("Your recommended starting point", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Discuss this recommendation" })
      .click();
    await expect(
      page.getByLabel("What would you like to work better?"),
    ).toHaveValue(/Procurement Transformation/);
  }
  await page.goto("/roi-estimator#assessment");
  await page
    .getByRole("button", {
      name: "Manufacturer or industrial operation",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "What type of organization do you operate?",
    }),
  ).toBeVisible();
});
test("legacy demonstrations respond to filters, decisions, alerts and rapid questions", async ({
  page,
}) => {
  await page.goto("/demo-lab");
  await page
    .getByText("Explore more manufacturing & procurement examples", {
      exact: false,
    })
    .click();
  await page.getByRole("button", { name: "This Quarter", exact: true }).click();
  await expect(page.locator(".ci-legacy-demos")).toContainText("$1.24M");
  await page
    .locator(".ci-product-window")
    .filter({ hasText: "Daily Operations Briefing" })
    .getByRole("button", { name: "Reject", exact: true })
    .click();
  await expect(page.locator(".ci-legacy-demos")).toContainText(
    "decision recorded",
  );
  await page
    .getByRole("button", { name: /Which suppliers were late most often/ })
    .click();
  await page
    .getByRole("button", { name: /What did we spend on maintenance parts/ })
    .click();
  await expect(page.locator(".ci-legacy-demos")).toContainText("$38,420");
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    axe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
});
test("remaining public pages and both themes pass contrast and semantic checks", async ({
  page,
}) => {
  test.setTimeout(120000);
  const routes = [
    "/solutions",
    "/industries",
    "/method",
    "/portfolio",
    "/privacy",
    "/terms",
    "/accessibility",
    "/solutions/custom-software",
    "/solutions/procurement",
  ];
  for (const theme of ["light", "dark"]) {
    await page.goto("/");
    if (theme === "dark")
      await page.getByRole("button", { name: "Switch to dark mode" }).click();
    for (const route of routes) {
      await page.goto(route);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect
        .soft(
          axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
          theme + route,
        )
        .toEqual([]);
    }
  }
});
test("narrow mobile, tablet, desktop and enlarged text reflow without clipping", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const width of [320, 768, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/demo-lab?industry=field-service",
      "/consultation",
      "/pricing",
      "/roi-estimator",
      "/industries",
    ]) {
      await page.goto(route);
      expect
        .soft(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          width + route,
        )
        .toBe(true);
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.addStyleTag({ content: "html {font-size:200%!important}" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});
test("scheduling has a direct fallback and only loads the calendar when requested", async ({
  page,
}) => {
  await page.goto("/consultation");
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open the booking calendar" }),
  ).toHaveAttribute("href", /^https:\/\/calendar.google.com/);
  await page.route("https://calendar.google.com/**", (route) => route.abort());
  await page
    .getByRole("button", { name: "Show calendar on this page" })
    .click();
  await expect(
    page.getByRole("link", { name: "Open the booking calendar" }),
  ).toBeVisible();
});
test("all internal paths remain available and the old start path redirects permanently", async ({
  page,
  request,
}) => {
  const paths = new Set<string>();
  for (const route of [
    "/",
    "/solutions",
    "/industries",
    "/pricing",
    "/demo-lab",
    "/about",
    "/portfolio",
  ]) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))
      paths.add(href.split(/[?#]/)[0]);
  }
  for (const path of paths) {
    const r = await request.get(path);
    expect.soft(r.status(), path).toBe(200);
  }
  expect((await request.get("/start", { maxRedirects: 0 })).status()).toBe(308);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("/portal");
});
