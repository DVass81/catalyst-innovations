import { test, expect } from "@playwright/test";

test("true opening morph pauses offscreen and replay preserves an approved request", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const shape = page.locator('[data-morph="chaos-outline"]').first();
  const first = await shape.getAttribute("d");
  await expect.poll(() => shape.getAttribute("d")).not.toBe(first);
  await page
    .getByRole("button", { name: "Pause opening animation", exact: true })
    .click();
  await page.waitForTimeout(80);
  const paused = await shape.getAttribute("d");
  await page.waitForTimeout(250);
  expect(await shape.getAttribute("d")).toBe(paused);
  await page.getByRole("button", { name: "Replay opening animation" }).click();
  await page.locator("#investment").scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  const offscreen = await shape.getAttribute("d");
  await page.waitForTimeout(300);
  expect(await shape.getAttribute("d")).toBe(offscreen);
  await page.getByRole("button", { name: "Try approval", exact: true }).click();
  await expect(page.locator(".story-opening .story-cascade")).toHaveAttribute(
    "data-state",
    "approved",
  );
  await page.getByRole("button", { name: "Replay opening animation" }).click();
  await expect(page.locator(".story-approval")).toHaveText("Approved");
  await expect(page.locator(".story-approval")).toBeDisabled();
  await page.locator("#demos").scrollIntoViewIfNeeded();
  await expect(page.locator(".ci-demo-stats")).toContainText("$2,400");
});

test("industry contours truly morph and settle on the last rapidly selected world", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/demo-lab");
  const shape = page.locator('[data-morph="industry-outline"]');
  await shape.scrollIntoViewIfNeeded();
  const manufacturing = await shape.getAttribute("d");
  await page.getByRole("tab", { name: /Field service/ }).click();
  await expect.poll(() => shape.getAttribute("d")).not.toBe(manufacturing);
  const middle = await shape.getAttribute("d");
  await page.waitForTimeout(180);
  expect(await shape.getAttribute("d")).not.toBe(middle);
  await page.getByRole("tab", { name: /Manufacturing/ }).click();
  await page.getByRole("tab", { name: /Professional services/ }).click();
  await expect(page.locator(".story-industry-morph")).toHaveAttribute(
    "data-industry",
    "professional-services",
  );
  await expect(
    page.getByRole("button", { name: "Approve handoff" }),
  ).toBeDisabled();
  await page.waitForTimeout(1500);
  const end = await shape.getAttribute("d");
  await page.waitForTimeout(200);
  expect(await shape.getAttribute("d")).toBe(end);
});

test("decision gate morphs on approval and routes a later return correctly", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/demo-lab");
  const gate = page.locator('[data-morph="decision-gate"]');
  await gate.scrollIntoViewIfNeeded();
  const waiting = await gate.getAttribute("d");
  await page
    .getByRole("button", { name: "Approve Replacement pump", exact: true })
    .click();
  await expect.poll(() => gate.getAttribute("d")).not.toBe(waiting);
  await expect(page.locator(".story-cascade")).toHaveAttribute(
    "data-state",
    "approved",
  );
  await page
    .getByRole("button", { name: "Return Safety equipment", exact: true })
    .click();
  await page.getByLabel("What needs to change?").fill("Confirm the quantity");
  await page.getByRole("button", { name: "Return with reason" }).click();
  await expect(page.locator(".story-cascade")).toHaveAttribute(
    "data-state",
    "returned",
  );
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(page.locator(".story-cascade")).toHaveAttribute(
    "data-state",
    "waiting",
  );
});

test("founder outlines merge, global pause persists and reduced motion stays functional", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator(".story-fusion").scrollIntoViewIfNeeded();
  const operations = page.locator('[data-morph="founder-operations"]');
  const engineering = page.locator('[data-morph="founder-engineering"]');
  expect(await operations.getAttribute("d")).not.toBe(
    await engineering.getAttribute("d"),
  );
  await expect
    .poll(
      async () =>
        (await operations.getAttribute("d")) ===
        (await engineering.getAttribute("d")),
      { timeout: 8000 },
    )
    .toBe(true);
  await page
    .getByRole("button", { name: "Pause site motion", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume site motion", exact: true }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".story-opening")).toHaveAttribute(
    "data-phase",
    "4",
  );
  await expect(
    page.getByRole("button", { name: "Replay opening animation" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Try approval", exact: true }).click();
  await expect(page.locator(".story-approval")).toHaveText("Approved");
  await page
    .getByRole("navigation", { name: "The Catalyst story" })
    .getByRole("link", { name: /Your investment/ })
    .click();
  await expect(page.locator("#investment .ci-heading")).toBeInViewport();
});
