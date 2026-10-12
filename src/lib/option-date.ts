/*
 * Reading calendar dates out of Stripe option labels.
 *
 * Lives apart from `catalog.ts` because that module is `server-only` — it holds
 * the Stripe secret key — while the picker in the browser needs to group the
 * same labels into months. Both import from here so the two never disagree
 * about what "Sept 21, 2026" means.
 */

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};
const MONTH_DAY = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(\d{1,2})\b/i;
const YEAR = /\b(20\d{2})\b/;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * The calendar date an option chip names, or null when it does not name one.
 *
 * Camp options are sold as dates — "Sept 21, 2026", "Summer August 24-28,
 * 2026" — next to a few that are not, like "Extended Day Per Day". Only the
 * first month/day in the label is read, so a range sorts by the day it starts.
 *
 * The year is required rather than inferred. A camp season spans two Augusts,
 * so "Aug 9- Aug 13" alone is genuinely ambiguous, and guessing would file a
 * 2027 week silently among the 2026 ones. Anything without a year is treated
 * as undated and keeps its position instead.
 */
export function optionDate(label: string): number | null {
  const monthDay = MONTH_DAY.exec(label);
  const year = YEAR.exec(label);
  if (!monthDay || !year) return null;

  const month = MONTHS[monthDay[1].toLowerCase()];
  return Date.UTC(Number(year[1]), month, Number(monthDay[2]));
}

const EVERY_MONTH_DAY = new RegExp(MONTH_DAY.source, "gi");
/** The closing day of a range written under one month: the 14 in "August 10-14". */
const CLOSING_DAY = /^\s*[-–]\s*(\d{1,2})\b/;

/**
 * The last calendar day an option covers, or null when it does not name one.
 *
 * `optionDate` reads where a week starts, which is what sorting wants. Knowing
 * when one is over needs the other end: "Aug 31- Sept 04, 2026" finishes on
 * the 4th, and "Summer August 10-14, 2026" on the 14th. A single day ends on
 * the day it names.
 *
 * The year in a label is written once, after the end of the range, so it is
 * the end date's year even when a week runs across New Year.
 */
export function optionEndDate(label: string): number | null {
  const year = YEAR.exec(label);
  const days = [...label.matchAll(EVERY_MONTH_DAY)];
  const last = days.at(-1);
  if (!year || !last) return null;

  const month = MONTHS[last[1].toLowerCase()];
  const day = Number(last[2]);
  const closing = CLOSING_DAY.exec(label.slice(last.index + last[0].length));
  if (!closing) return Date.UTC(Number(year[1]), month, day);

  /* "June 28-02" closes in the following month. Date.UTC carries a thirteenth
     month over into the next year by itself. */
  const closingDay = Number(closing[1]);
  return Date.UTC(Number(year[1]), closingDay < day ? month + 1 : month, closingDay);
}

const DAY_MS = 24 * 60 * 60 * 1000;
const EASTERN_OFFSET_MS = 5 * 60 * 60 * 1000;

/**
 * Whether an option names a date that is already over. Undated options never are.
 *
 * Over means the end of its last day in North Carolina. Dates are held as
 * midnight UTC, and Eastern runs four or five hours behind that, so the later
 * of the two is used and a camp day is never pulled while it is still that day
 * in Holly Springs.
 */
export function isPastOption(label: string, now = Date.now()) {
  const end = optionEndDate(label);
  return end !== null && now >= end + DAY_MS + EASTERN_OFFSET_MS;
}

export type OptionMonth = {
  /** Sortable key, and the value the filter chips switch on. */
  key: string;
  /** "September 2026", or "Other dates" for the undated bucket. */
  label: string;
  /** "Sept 2026" — the filter chip, where the row has to stay narrow. */
  short: string;
  options: string[];
};

const UNDATED = "undated";

/**
 * Option labels bucketed by the month they fall in, in calendar order.
 *
 * A season of camp weeks arrives as one flat list roughly sixty long. Grouped,
 * a parent looking for one week in March reads four chips under a March
 * heading instead of scanning sixty. Options with no date in them — extended
 * day, a deposit — collect in one trailing bucket rather than being dropped.
 */
export function groupByMonth(options: string[]): OptionMonth[] {
  const buckets = new Map<string, OptionMonth>();

  for (const option of options) {
    const at = optionDate(option);
    let key = UNDATED;
    let label = "Other options";
    let short = "Other";

    if (at !== null) {
      const date = new Date(at);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      key = `${year}-${String(month).padStart(2, "0")}`;
      label = `${MONTH_NAMES[month]} ${year}`;
      short = `${MONTH_NAMES[month].slice(0, 3)} ${year}`;
    }

    const bucket = buckets.get(key);
    if (bucket) bucket.options.push(option);
    else buckets.set(key, { key, label, short, options: [option] });
  }

  /* Undated last: it is the leftovers bucket, and sorting it by key would file
     it under "u" somewhere in the middle of the calendar. */
  return [...buckets.values()].sort((a, b) => {
    if (a.key === UNDATED) return 1;
    if (b.key === UNDATED) return -1;
    return a.key.localeCompare(b.key);
  });
}
