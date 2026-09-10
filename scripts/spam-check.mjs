/**
 * Spam-filter regression check.
 *
 *   node scripts/spam-check.mjs
 *
 * Scores a fixed set of messages through src/lib/spam.ts and asserts that the
 * spam ones are blocked and the real ones are not. Exits non-zero on any
 * disagreement, so the thresholds and vocabulary in that file can be tuned
 * against real traffic without quietly starting to eat real inquiries.
 *
 * When a spam message gets through, add it to SPAM below — verbatim, from the
 * inbox — and adjust the weights until this passes again. When a family
 * reports that a message never arrived, their wording goes in REAL.
 *
 * The module is loaded through a stripped copy because it is marked
 * `server-only`, which refuses to import outside a server component. That
 * marker is deliberate: the vocabulary list is a filter spammers would love to
 * read, so it must never reach the browser bundle.
 */

import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SOURCE = new URL("../src/lib/spam.ts", import.meta.url);

/** Messages that must be blocked. Taken from real spam patterns. */
const SPAM = [
  {
    label: "SEO outreach",
    name: "Alex",
    email: "alex@seo-boost.xyz",
    message:
      "Hi, I was browsing your website and noticed it isn't ranking on Google. We offer SEO and link building services. Visit https://seo-boost.xyz to increase your traffic!",
  },
  {
    label: "Russian-language blast",
    name: "Ivan",
    email: "ivan@mail.ru",
    message: "Здравствуйте, мы предлагаем услуги продвижения сайта. http://spam.ru",
  },
  {
    label: "Prize / money scheme",
    name: "Winner",
    email: "a@tempmail.com",
    message:
      "Make money online fast! Passive income guaranteed. Claim your gift card now!!!! Click http://bit.ly/x",
  },
  {
    label: "BBCode pharmacy",
    name: "bot",
    email: "b@x.top",
    message: "[url=http://pills.top]buy viagra[/url] cheap pharmacy",
  },
  {
    label: "Web-design pitch",
    name: "Sara Kim",
    email: "sara@devshop.io",
    message:
      "We noticed your website could use a redesign. We provide web design services and mobile app development. Reply for a quote.",
  },
  {
    label: "Guest-post pitch",
    name: "Priya",
    email: "priya@gmail.com",
    message: "Hello, do you accept guest posts? We can write for us sponsored article with backlinks.",
  },
  {
    label: "Bot-speed fill",
    name: "John Smith",
    email: "js@example.com",
    message: "Interested in your services, please contact me at https://cheap-offers.top",
    elapsedMs: 300,
  },
];

/**
 * Messages that must reach the inbox. Several are deliberately awkward: caps,
 * a pasted link, no JS, a name in another script, a college-prep question that
 * mentions student loans. Each one is a mistake this filter could make.
 */
const REAL = [
  {
    label: "Reading tutoring",
    name: "Karen Cole",
    email: "karen.cole@gmail.com",
    phone: "919-555-0134",
    message:
      "Hi! My daughter is in 4th grade and is struggling with reading comprehension. We'd love to hear about tutoring options. Best times for us are Tuesday afternoons.",
  },
  {
    label: "SAT prep mentioning loans",
    name: "Mike R",
    email: "mrivera@outlook.com",
    message:
      "Looking for SAT prep for my junior. He got a 1180 on the PSAT and wants to get above 1350. Also curious about college essay help and whether student loans and financial aid advising is part of it.",
  },
  {
    label: "Camp slots question",
    name: "Jenny H",
    email: "jenny.h@yahoo.com",
    message:
      "Do you have any slots left for the summer STEM camp? Also, is there a waitlist? My son loved Minecraft Education last year!",
  },
  {
    label: "IEP request, JS disabled",
    name: "Victoria V",
    email: "vv@nc.rr.com",
    message: "My son has an IEP and we need help with advocacy at his next meeting. Please call me.",
    elapsedMs: null,
  },
  {
    label: "Pasted a link",
    name: "Dana P",
    email: "dana@hotmail.com",
    message:
      "I saw your center on resourceroomnc.com and wanted to ask about ABA services for my 7 year old.",
  },
  {
    label: "Written in capitals",
    name: "Tom B",
    email: "tomb@gmail.com",
    message:
      "WE ARE SO EXCITED TO FINALLY FIND SOMEWHERE LOCAL FOR OUR SON, PLEASE CALL US ABOUT TUTORING!!!",
  },
  {
    label: "Cyrillic name, English message",
    name: "Иван Петров",
    email: "ivan@gmail.com",
    message: "Hello, I would like tutoring for my son in algebra. He is in 8th grade.",
  },
  {
    label: "Chinese name, English message",
    name: "李伟",
    email: "li.wei@gmail.com",
    message: "Do you offer SAT prep on weekends? My daughter is a junior.",
  },
  {
    label: "Spanish-language inquiry",
    name: "Maria Gonzalez",
    email: "maria@gmail.com",
    message:
      "Hola, quisiera información sobre tutoría para mi hijo de cuarto grado. ¿Hablan español? Gracias.",
  },
];

async function loadChecker() {
  const source = await readFile(SOURCE, "utf8");
  const dir = await mkdtemp(join(tmpdir(), "spam-check-"));
  const file = join(dir, "spam.ts");
  await writeFile(file, source.replace(/^import "server-only";$/m, ""));
  return (await import(`file://${file}`)).checkSpam;
}

const checkSpam = await loadChecker();

let failures = 0;

/* Each case gets its own IP and the messages differ, so the burst and
   duplicate signals stay out of the way — this run measures content only. */
function run(entry, expectBlocked) {
  const verdict = checkSpam({
    name: entry.name,
    email: entry.email,
    phone: entry.phone ?? "",
    message: entry.message,
    elapsedMs: entry.elapsedMs === undefined ? 60_000 : entry.elapsedMs,
    ip: `10.0.0.${Math.floor(Math.random() * 254) + 1}-${Math.random()}`,
  });

  const blocked = verdict.action === "block";
  const ok = blocked === expectBlocked;
  if (!ok) failures++;

  console.log(
    `${ok ? "  ok  " : " FAIL "}${String(verdict.score).padStart(3)}  ${verdict.action.padEnd(5)}  ${entry.label.padEnd(30)}${verdict.reasons.join("; ")}`,
  );
}

console.log("\nSpam — every one of these must be blocked:");
for (const entry of SPAM) run(entry, true);

console.log("\nReal families — none of these may be blocked:");
for (const entry of REAL) run(entry, false);

console.log(
  failures ? `\n${failures} case(s) scored wrong.\n` : "\nAll cases scored as expected.\n",
);
process.exit(failures ? 1 : 0);
