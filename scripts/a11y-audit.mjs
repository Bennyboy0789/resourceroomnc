/**
 * Automated accessibility audit.
 *
 *   npm run build && npm start &      # or: npx next dev
 *   node scripts/a11y-audit.mjs
 *
 * Runs axe-core against a representative page of every template at three
 * viewports and prints violations grouped by rule. Exits non-zero if anything
 * fails, so it can gate a deploy.
 *
 * Automated testing catches roughly a third of WCAG issues. It cannot judge
 * whether alt text is *meaningful*, whether focus order makes sense, or
 * whether a page is usable by keyboard alone — those still need a human pass.
 */

import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";

/** One page per template. */
const PAGES = [
  ["home", "/"],
  ["programs index", "/programs"],
  ["program detail", "/programs/sat-act-prep"],
  ["program detail (calendar)", "/programs/camps"],
  ["course catalog", "/courses"],
  ["course detail", "/courses/crafty-learning"],
  ["blog index", "/blog"],
  ["blog post", "/blog/were-not-going-to-say-no-were-going-to-say-how"],
  ["blog category", "/blog/category/alternative-education"],
  ["about", "/about"],
  ["preferred partners", "/about/preferred-partners"],
  ["contact", "/contact"],
  ["careers", "/join-our-team"],
  ["privacy policy", "/privacy-policy"],
];

const VIEWPORTS = [
  ["mobile", { width: 375, height: 812 }],
  ["tablet", { width: 768, height: 1024 }],
  ["desktop", { width: 1440, height: 900 }],
];

/* WCAG 2.1 AA is the standard DOJ codified for Title II and the bar courts and
   settlements use for Title III. best-practice rules are included because they
   catch real problems even where they are not strictly required. */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const browser = await chromium.launch();
const findings = new Map();
let checks = 0;

for (const [viewportName, viewport] of VIEWPORTS) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  for (const [label, path] of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    await page.waitForTimeout(600);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    checks++;

    for (const violation of violations) {
      const key = `${violation.id}|${violation.impact}`;
      if (!findings.has(key)) {
        findings.set(key, {
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          helpUrl: violation.helpUrl,
          where: new Set(),
          sample: violation.nodes[0]?.html?.slice(0, 160),
        });
      }
      findings.get(key).where.add(`${label} @ ${viewportName}`);
    }
  }

  await context.close();
}

await browser.close();

const RANK = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const sorted = [...findings.values()].sort((a, b) => (RANK[a.impact] ?? 9) - (RANK[b.impact] ?? 9));

console.log(`\naxe-core — ${checks} page/viewport combinations checked\n`);

if (!sorted.length) {
  console.log("No violations found.\n");
  process.exit(0);
}

for (const finding of sorted) {
  console.log(`[${finding.impact?.toUpperCase()}] ${finding.id} — ${finding.help}`);
  console.log(`  ${finding.where.size} page/viewport combination(s)`);
  for (const where of [...finding.where].slice(0, 5)) console.log(`    · ${where}`);
  if (finding.where.size > 5) console.log(`    · …and ${finding.where.size - 5} more`);
  if (finding.sample) console.log(`  e.g. ${finding.sample}`);
  console.log(`  ${finding.helpUrl}\n`);
}

const blocking = sorted.filter((f) => f.impact === "critical" || f.impact === "serious");
console.log(`${sorted.length} distinct violation(s); ${blocking.length} critical/serious.\n`);
process.exit(blocking.length ? 1 : 0);
