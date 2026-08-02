/**
 * Interaction accessibility checks that axe cannot make.
 *
 *   node scripts/a11y-interaction.mjs
 *
 * Covers the criteria that need a real keyboard and a real viewport:
 * bypass blocks, keyboard operability of the menus and drawer, focus trapping,
 * Escape handling, and reflow at 400% zoom.
 */

import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";
const results = [];

function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const focusInfo = () =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || "").trim().slice(0, 50),
      id: el.id,
    };
  });

// --- 2.4.1 Bypass Blocks ----------------------------------------------------
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
await page.waitForTimeout(300); // let the reveal transition settle before measuring
const first = await focusInfo();
record(
  "2.4.1 skip link is the first tab stop",
  first?.text?.toLowerCase().includes("skip to main"),
  `got: ${first?.tag} "${first?.text}"`,
);

const skipVisible = await page.evaluate(() => {
  const el = document.activeElement;
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top >= 0 && r.height > 0 && r.width > 0;
});
record("2.4.7 skip link becomes visible on focus", skipVisible);

await page.keyboard.press("Enter");
await page.waitForTimeout(300);
const afterSkip = await page.evaluate(() => document.activeElement?.id ?? "");
record("2.4.1 skip link moves focus to <main>", afterSkip === "main", `focus id: "${afterSkip}"`);

// --- 2.1.1 Keyboard: program mega menu --------------------------------------
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
const programsTrigger = page.locator('nav[aria-label="Main"] button', { hasText: /programs/i }).first();
const hasTrigger = await programsTrigger.count();
if (hasTrigger) {
  await programsTrigger.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  const expanded = await programsTrigger.getAttribute("aria-expanded");
  record("2.1.1 mega menu opens by keyboard", expanded === "true", `aria-expanded=${expanded}`);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  const collapsed = await programsTrigger.getAttribute("aria-expanded");
  record("2.1.2 Escape closes the mega menu", collapsed !== "true", `aria-expanded=${collapsed}`);
} else {
  record("2.1.1 mega menu trigger is a <button>", false, "no button trigger found in main nav");
}

// --- 2.1.1 / 2.1.2 Cart drawer ---------------------------------------------
const cartButton = page.locator("button", { hasText: /cart/i }).first();
if (await cartButton.count()) {
  await cartButton.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  const drawerOpen = await page.locator('[role="dialog"]').count();
  record("2.1.1 cart drawer opens by keyboard", drawerOpen > 0);

  if (drawerOpen) {
    const insideBefore = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog?.contains(document.activeElement) ?? false;
    });
    record("2.4.3 focus moves into the drawer", insideBefore);

    // Tab well past the control count; focus must stay inside a modal dialog.
    for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
    const stillInside = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog?.contains(document.activeElement) ?? false;
    });
    record("2.4.3 focus stays trapped in the modal drawer", stillInside);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    record("2.1.2 Escape closes the drawer", (await page.locator('[role="dialog"]').count()) === 0);
  }
}

// --- 1.4.10 Reflow: 400% zoom == 320px CSS width ----------------------------
const narrow = await browser.newContext({ viewport: { width: 320, height: 800 } });
const narrowPage = await narrow.newPage();
for (const path of ["/", "/programs/camps", "/courses", "/blog", "/contact"]) {
  await narrowPage.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  const overflow = await narrowPage.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  record(`1.4.10 no horizontal scroll at 320px — ${path}`, overflow <= 1, `overflow ${overflow}px`);
}

// --- 1.4.12 Text spacing ----------------------------------------------------
await narrowPage.goto(`${BASE}/programs/camps`, { waitUntil: "networkidle" });
await narrowPage.addStyleTag({
  content: `* { line-height: 1.5 !important; letter-spacing: 0.12em !important;
             word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }`,
});
await narrowPage.waitForTimeout(300);
const spacingOverflow = await narrowPage.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
record("1.4.12 survives forced text spacing", spacingOverflow <= 1, `overflow ${spacingOverflow}px`);

await narrow.close();
await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
