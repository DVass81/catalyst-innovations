import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";

test("before-connected supports keyboard and drag without changing real decisions", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try approval", exact: true }).click();
  const world = page.locator(".connected-world");
  await world.scrollIntoViewIfNeeded();
  await expect(world.locator(".paper-world")).toHaveAttribute(
    "data-renderer",
    "ready",
  );
  const slider = page.getByRole("slider", {
    name: "Before to connected transformation",
  });
  await slider.press("Home");
  await expect(slider).toHaveValue("0");
  await expect(world.locator(".connected-world-outcomes")).toContainText(
    "Requests in different places",
  );
  const first = createHash("sha256")
    .update(await world.locator("canvas").screenshot())
    .digest("hex");
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("1");
  const b = (await slider.boundingBox())!;
  await page.mouse.move(b.x + b.width * 0.05, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.65, b.y + b.height / 2, { steps: 8 });
  await page.mouse.up();
  const value = Number(await slider.inputValue());
  expect(value).toBeGreaterThan(35);
  expect(value).toBeLessThan(90);
  await slider.press("End");
  await expect(slider).toHaveValue("100");
  await expect(world.locator(".connected-world-outcomes")).toContainText(
    "One approval queue",
  );
  const last = createHash("sha256")
    .update(await world.locator("canvas").screenshot())
    .digest("hex");
  expect(first).not.toBe(last);
  await expect(page.locator(".ci-demo-stats")).toContainText("$2,400");
  await page.getByRole("tab", { name: /Field service/ }).click();
  await expect(slider).toHaveValue("100");
  await expect(world.locator(".connected-world-outcomes")).toContainText(
    "Assignment conflicts visible",
  );
  await page.getByRole("tab", { name: /Manufacturing/ }).click();
  await expect(page.locator(".ci-demo-stats")).toContainText("$2,400");
});

test("graphics failure shows a loaded still and keeps approval usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...args: unknown[]
    ) {
      if (kind.includes("webgl")) return null;
      return Reflect.apply(original, this, [kind, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await page.locator(".paper-world-intro").scrollIntoViewIfNeeded();
  await expect(page.locator(".paper-world-intro")).toHaveAttribute(
    "data-renderer",
    "still",
  );
  const poster = page.locator(".paper-world-intro img");
  await expect(poster).toBeVisible();
  await expect
    .poll(() =>
      poster.evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Try approval", exact: true }).click();
  await expect(page.locator(".story-approval")).toHaveText("Approved");
  await expect(page.locator(".story-caption h2")).toHaveText(
    "Approved. Clear for purchasing.",
  );
});

test("mobile defers graphics until the stage is visible and explains the request", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 560 });
  await page.goto("/");
  await expect(page.locator(".paper-world-intro")).toHaveAttribute(
    "data-renderer",
    "waiting",
  );
  await expect(
    page.getByRole("link", { name: /Explore the demos/ }).first(),
  ).toBeVisible();
  await page.locator(".paper-world-intro").scrollIntoViewIfNeeded();
  await expect(page.locator(".paper-world-intro")).toHaveAttribute(
    "data-renderer",
    "ready",
  );
  await expect(page.locator(".story-live-request")).toContainText(
    "Replacement pump",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Try approval", exact: true }).click();
  await expect(page.locator(".story-approval")).toHaveText("Approved");
});
