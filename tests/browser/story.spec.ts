import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import type { Locator } from "@playwright/test";
const picture = async (canvas: Locator) =>
  createHash("sha256")
    .update(await canvas.screenshot({ animations: "allow" }))
    .digest("hex");

test("true opening morph pauses offscreen and replay preserves an approved request", async ({
  page,
}) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const world = page.locator(".paper-world-intro");
  await expect(world).toHaveAttribute("data-renderer", "ready");
  const shape = world.locator("canvas");
  await expect
    .poll(() => shape.evaluate((el) => getComputedStyle(el).opacity))
    .toBe("1");
  // Hold time while capturing frames: tracing on software GPUs can take longer
  // than the entire eight-second story, even though the animation works.
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000);
  await page
    .getByRole("button", { name: "Replay opening animation" })
    .dispatchEvent("click");
  await page.clock.runFor(32);
  const first = await picture(shape);
  await page.clock.runFor(2000);
  expect(await picture(shape)).not.toBe(first);
  await page
    .getByRole("button", { name: "Pause opening animation", exact: true })
    .dispatchEvent("click");
  await page.clock.runFor(80);
  const paused = await picture(shape);
  await page.clock.runFor(250);
  expect(await picture(shape)).toBe(paused);
  await page.clock.resume();
  await page.getByRole("button", { name: "Replay opening animation" }).click();
  await page.locator("#investment").scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  const offscreen = await page
    .locator(".ci-scene-progress span")
    .getAttribute("style");
  await page.waitForTimeout(300);
  expect(
    await page.locator(".ci-scene-progress span").getAttribute("style"),
  ).toBe(offscreen);
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

test("industry sculpture transforms and settles on the last rapidly selected world", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/demo-lab");
  const shape = page.locator(".paper-world-compare canvas");
  await shape.scrollIntoViewIfNeeded();
  await expect(page.locator(".paper-world-compare")).toHaveAttribute(
    "data-renderer",
    "ready",
  );
  const manufacturing = await picture(shape);
  await page.getByRole("tab", { name: /Field service/ }).click();
  await expect.poll(() => picture(shape)).not.toBe(manufacturing);
  await page.getByRole("tab", { name: /Manufacturing/ }).click();
  await page.getByRole("tab", { name: /Professional services/ }).click();
  await expect(page.locator(".connected-world")).toHaveAttribute(
    "data-industry",
    "professional-services",
  );
  await expect(
    page.getByRole("button", { name: "Approve handoff" }),
  ).toBeDisabled();
  await page.waitForTimeout(1900);
  const end = await picture(shape);
  await page.waitForTimeout(200);
  expect(await picture(shape)).toBe(end);
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
