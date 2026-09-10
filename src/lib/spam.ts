import "server-only";

import { createHash } from "node:crypto";

/**
 * Spam scoring for the consultation and careers forms.
 *
 * Context for why this is scoring rather than a captcha: submissions arrive
 * through a Next Server Action, which a naive form-scraper cannot invoke — it
 * has to render the page and run React to learn the action id. So the bots
 * that reach us are already browser-grade, and a "does this client run JS"
 * test filters almost none of them. What separates them from a parent is what
 * they write: links, marketing vocabulary, a burst of identical submissions.
 *
 * Every signal is therefore a weight, never a verdict on its own. A real
 * parent who pastes their tutor's website and writes in caps should still get
 * through; a message that trips four signals at once should not.
 */

export type SpamCheckInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  /**
   * Milliseconds between the form mounting and the submit, reported by client
   * JS. `null` when the visitor has JS off — which is a mild signal, not a
   * disqualification, because the forms are built to work without it.
   */
  elapsedMs: number | null;
  /** Caller's address, for burst detection. `null` when it cannot be read. */
  ip: string | null;
};

export type SpamVerdict = {
  score: number;
  reasons: string[];
  /**
   * send  — deliver normally
   * flag  — deliver, but mark the subject so the office can filter it
   * block — drop, and log the reason
   */
  action: "send" | "flag" | "block";
};

/*
 * Two thresholds rather than one. A false block costs a family — that is the
 * expensive error here — so only a submission that trips several independent
 * signals is dropped. The middle band still lands in the inbox, tagged, which
 * lets the office build a mail rule and lets us tune these numbers against
 * real traffic instead of guesses.
 */
const BLOCK_AT = 6;
const FLAG_AT = 3;

/** Links, once email addresses have been removed from the text. */
const LINK =
  /\b(?:https?:\/\/|www\.)\S+|\b[a-z0-9][a-z0-9-]*\.(?:com|net|org|io|co|ru|su|cn|xyz|top|club|online|biz|info|shop|site|icu|buzz|cyou|link|live|store|tk|ml|ga|cf|gq)\b/gi;

/* Same pattern without /g, for the single .test() calls below: a global
   regex carries lastIndex between calls and would answer differently each
   time it is reused. */
const LINK_ONCE = new RegExp(LINK.source, "i");

const EMAIL_IN_TEXT = /\b[^\s@]+@[^\s@]+\.[a-z]{2,}\b/gi;

/** BBCode and raw anchors — comment-spam tooling, never a parent. */
const MARKUP = /\[\/?url|\[\/?link|<a\s|<\/a>|\[img\]/i;

/*
 * Vocabulary weights. Deliberately narrow: each phrase is one a tutoring
 * inquiry has essentially no reason to contain. Generic words that spam and
 * real messages share ("free", "offer", "help") are absent on purpose.
 */
const TERMS: Array<[RegExp, number, string]> = [
  [/\bseo\b|search engine optimi[sz]/i, 3, "SEO pitch"],
  [/\bback ?links?\b|\blink building\b|\bguest post/i, 4, "backlinks pitch"],
  [/\brank(ing)? (higher|on google|#?1)\b|\bfirst page of google\b/i, 4, "search-ranking pitch"],
  [/\b(bitcoin|crypto(currency)?|forex|binary options?|nft)\b/i, 3, "crypto"],
  [/\bcasino\b|\bsports ?betting\b|\bgambl/i, 4, "gambling"],
  [/\bviagra\b|\bcialis\b|\bpharmacy\b/i, 5, "pharmacy"],
  [/\bescort|\bporn|\bdating site|\bhookup/i, 5, "adult"],
  [/\bpayday loans?\b|\bcredit repair\b|\bdebt relief\b/i, 3, "loans"],
  [/\bweb (design|development) services\b|\bmobile app development\b/i, 4, "web-services pitch"],
  [/\bdigital marketing\b|\blead generation\b|\bcold email\b/i, 3, "marketing pitch"],
  [/\bwe (noticed|found|came across) your (website|site)\b/i, 4, "cold-outreach opener"],
  [/\bi (was|am) (browsing|visiting) your (website|site)\b/i, 3, "cold-outreach opener"],
  [/\bincrease (your )?(traffic|sales|revenue|visitors)\b/i, 4, "traffic pitch"],
  [/\bwork from home\b|\bmake money (online|fast)\b|\bpassive income\b/i, 4, "money scheme"],
  [/\bgift cards?\b|\bwinning\b.{0,20}\bprize\b|\bclaim your\b/i, 3, "prize scam"],
  [/\bwrite for us\b|\bsponsored (post|content|article)\b/i, 3, "guest-post pitch"],
  [/\bunsubscribe\b|\bopt.?out of (these|future) emails?\b/i, 3, "bulk-mail boilerplate"],
  [/\bwhats ?app\b.{0,12}\+\d|\btelegram\b.{0,12}@/i, 3, "messenger handle"],
];

/** Scripts that a Holly Springs tutoring inquiry effectively never uses. */
const CYRILLIC_OR_GREEK = /[\u0400-\u04FF\u0370-\u03FF]/;
const ARABIC_OR_HEBREW = /[\u0590-\u06FF]/;
const CJK = /[\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/;
/** Zero-width and direction marks, used to break up filtered words. */
const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\uFEFF]/;

/** TLDs that carry almost no legitimate mail to a local tutoring center. */
const RISKY_TLD = /\.(ru|su|cn|tk|ml|ga|cf|gq|xyz|top|club|icu|buzz|cyou|work|online)$/i;

/** URL shorteners, which exist here only to hide where a link goes. */
const SHORTENER = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "cutt.ly",
  "rb.gy",
  "shorturl.at",
  "rebrand.ly",
]);

const DISPOSABLE = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "sharklasers.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "dispostable.com",
  "getnada.com",
  "mailnesia.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "maildrop.cc",
]);

/**
 * Anything faster than this is not a person who read the labels, chose a
 * program from the select, and described their student.
 */
const MIN_FILL_MS = 3_000;

export function checkSpam(input: SpamCheckInput): SpamVerdict {
  const reasons: string[] = [];
  let score = 0;

  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(`${reason} (+${points})`);
  };

  const message = input.message ?? "";
  const name = input.name ?? "";
  const combined = `${name}\n${message}`;

  /* Emails are stripped before counting links, or every visitor who types
     their own address into the body would read as a link. */
  const linkText = combined.replace(EMAIL_IN_TEXT, " ");
  const found = linkText.match(LINK) ?? [];

  if (found.length === 1) add(2, "contains a link");
  else if (found.length === 2) add(4, "contains 2 links");
  else if (found.length >= 3) add(6, `contains ${found.length} links`);

  /* Where the link points matters more than that it exists. A parent pastes
     their school's .com or ours; nobody pastes a .top, and nobody hides a
     tutoring question behind a shortener. */
  const hosts = found.map((raw) =>
    raw
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split(/[/?#]/)[0]
      .toLowerCase()
      .replace(/[.,;:)\]]+$/, ""),
  );

  if (hosts.some((host) => RISKY_TLD.test(host))) add(3, "link to a high-risk domain");
  if (hosts.some((host) => SHORTENER.has(host))) add(3, "shortened link");

  if (MARKUP.test(combined)) add(5, "contains BBCode or HTML markup");

  for (const [pattern, weight, label] of TERMS) {
    if (pattern.test(combined)) add(weight, label);
  }

  /*
   * Script is judged on the message body only, and only past a few characters.
   * A family whose surname is written in Cyrillic and whose question is in
   * plain English is an ordinary Holly Springs family; a whole message in a
   * script the office cannot read is not. Scoring the name field here tagged
   * the former, which is exactly the error worth avoiding.
   */
  const foreign = (pattern: RegExp) => (message.match(new RegExp(pattern.source, "gu")) ?? []).length >= 4;

  if (foreign(CYRILLIC_OR_GREEK)) add(4, "message in Cyrillic or Greek");
  else if (foreign(ARABIC_OR_HEBREW)) add(3, "message in Arabic or Hebrew");
  else if (foreign(CJK)) add(2, "message in CJK");

  if (INVISIBLE.test(combined)) add(3, "invisible characters");

  // A name is a name. Bots put their payload there when the field is short.
  if (LINK_ONCE.test(name.replace(EMAIL_IN_TEXT, " "))) add(4, "link in the name field");
  if (name.length > 70) add(2, "implausibly long name");
  // \p{L}, not [a-z]: a name in another script is already scored above,
  // and counting it twice is how a real family gets blocked.
  if (name && !/\p{L}/u.test(name)) add(3, "name has no letters");

  if (input.phone && /https?:|www\./i.test(input.phone)) add(4, "link in the phone field");

  const domain = input.email.split("@")[1]?.toLowerCase() ?? "";
  if (domain) {
    if (DISPOSABLE.has(domain)) add(3, "disposable email domain");
    else if (RISKY_TLD.test(domain)) add(3, "high-risk email TLD");
  }

  const letters = message.replace(/[^a-z]/gi, "");
  if (letters.length > 40) {
    const caps = message.replace(/[^A-Z]/g, "").length / letters.length;
    if (caps > 0.6) add(1, "mostly capitals");
  }
  if ((message.match(/!/g)?.length ?? 0) > 3) add(1, "excessive exclamation marks");

  /* Timing. Missing is only worth a point — the forms are meant to work with
     JS off, and a no-JS visitor who writes a normal message still clears both
     thresholds on this signal alone. A stale page (someone left the tab open
     overnight) is not suspicious, so only the fast end is scored. */
  if (input.elapsedMs === null) add(1, "no client timing signal");
  else if (input.elapsedMs < MIN_FILL_MS) add(3, `submitted in ${input.elapsedMs}ms`);

  const burst = recordSubmission(input.ip, message);
  if (burst.duplicate) add(4, "identical message seen recently");
  if (burst.recentFromIp > 5) add(5, `${burst.recentFromIp} submissions from this IP`);
  else if (burst.recentFromIp > 2) add(3, `${burst.recentFromIp} submissions from this IP`);

  return {
    score,
    reasons,
    action: score >= BLOCK_AT ? "block" : score >= FLAG_AT ? "flag" : "send",
  };
}

/*
 * Burst tracking.
 *
 * Process-local on purpose: no Redis, no KV, no new service to keep alive for
 * a site that takes a handful of real submissions a week. Serverless means
 * several instances may each hold their own view, so this catches a flood
 * hitting one warm instance and misses one spread across many. That is the
 * right trade here — it costs nothing, and the content signals above are what
 * carry the load. Entries expire, so the map cannot grow without bound.
 */
const WINDOW_MS = 10 * 60 * 1000;
const seen: Array<{ at: number; ip: string | null; hash: string }> = [];

function recordSubmission(
  ip: string | null,
  message: string,
): { recentFromIp: number; duplicate: boolean } {
  const now = Date.now();

  while (seen.length && now - seen[0].at > WINDOW_MS) seen.shift();

  const hash = createHash("sha256").update(message.trim().toLowerCase()).digest("hex").slice(0, 16);

  // Only count a duplicate when there is something to duplicate — an empty
  // optional message on the careers form is not evidence of anything.
  const duplicate = message.trim().length > 20 && seen.some((entry) => entry.hash === hash);
  const recentFromIp = ip ? seen.filter((entry) => entry.ip === ip).length : 0;

  seen.push({ at: now, ip, hash });
  if (seen.length > 500) seen.shift();

  return { recentFromIp, duplicate };
}

/**
 * First address in `x-forwarded-for` — the client as the edge saw it. The rest
 * of the chain is proxies, and the header is only trustworthy because Vercel
 * rewrites it at the edge; a self-hosted deploy behind an untrusted proxy
 * would need to pin this differently.
 */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return headers.get("x-real-ip");
}
