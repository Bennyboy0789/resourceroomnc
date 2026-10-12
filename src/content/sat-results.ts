/**
 * SAT results for one cohort, and every figure the results section shows.
 *
 * Nothing on the page is typed in by hand. The counts, the averages and the
 * sentences built from them all come from the score list below, so the next
 * cohort is a matter of replacing that list and the label.
 *
 * No names, here or on the page. A row is a set of scores and nothing else,
 * and the charts sort by starting score, so the order below says nothing about
 * who is who either.
 */

export type SatScores = {
  /** First proctored full-length practice SAT, taken before lessons began. */
  baseline: number;
  /** Official College Board scores. Null where the student did not sit that date. */
  aug: number | null;
  sep: number | null;
};

const cohort2026: SatScores[] = [
  { baseline: 1140, aug: 1390, sep: 1400 },
  { baseline: 1000, aug: 1370, sep: 1400 },
  { baseline: 990, aug: 1200, sep: null },
  { baseline: 1020, aug: 1130, sep: 1300 },
  { baseline: 950, aug: 1080, sep: 1090 },
  { baseline: 1030, aug: 1220, sep: null },
  { baseline: 1210, aug: 1280, sep: null },
  { baseline: 1010, aug: 1320, sep: null },
  { baseline: 970, aug: 1210, sep: 1310 },
  { baseline: 1300, aug: 1350, sep: null },
  { baseline: 1190, aug: 1290, sep: 1390 },
  { baseline: 1160, aug: 1320, sep: null },
  { baseline: 970, aug: 1160, sep: null },
  { baseline: 1090, aug: 1190, sep: null },
  { baseline: 1150, aug: 1280, sep: 1370 },
  { baseline: 1100, aug: 1270, sep: 1340 },
  { baseline: 1180, aug: 1430, sep: null },
  { baseline: 1000, aug: null, sep: 1300 },
];

/**
 * Share of test takers a total score beats, from College Board's published
 * tables. `emphasis` marks the one the chart and the copy lean on.
 */
const percentiles2026: {
  score: number;
  percentile: number;
  emphasis?: boolean;
}[] = [
  { score: 1000, percentile: 48 },
  { score: 1200, percentile: 76 },
  { score: 1300, percentile: 87 },
  { score: 1370, percentile: 91, emphasis: true },
  { score: 1500, percentile: 98 },
];

/** The score most families treat as the threshold for sending one at all. */
const SEND_LINE = 1200;

const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

function build(
  label: string,
  cohort: SatScores[],
  percentiles: typeof percentiles2026,
) {
  const students = cohort
    .map((scores) => {
      const best = Math.max(scores.aug ?? 0, scores.sep ?? 0);
      return { ...scores, best, gain: best - scores.baseline };
    })
    .sort((a, b) => a.baseline - b.baseline || a.best - b.best);

  /* Sat both dates. The filter is spelled out twice so the narrowed type
     survives: these rows have two real scores, not two nullable ones. */
  const retesters = students.flatMap((student) =>
    student.aug !== null && student.sep !== null
      ? [{ baseline: student.baseline, aug: student.aug, sep: student.sep }]
      : [],
  );

  const improved = students.filter((student) => student.gain > 0).length;
  const higherOnRetest = retesters.filter(
    (student) => student.sep > student.aug,
  ).length;

  /* The headings say "every student improved" and "all of them went up again".
     Those are claims about this list, so a list that stops supporting them
     fails the build rather than publishing a sentence that is no longer true. */
  if (improved !== students.length) {
    throw new Error(
      `SAT results: ${students.length - improved} student(s) did not improve.`,
    );
  }
  if (higherOnRetest !== retesters.length) {
    throw new Error(
      "SAT results: not every retest was higher than the first sitting.",
    );
  }

  /* Rounded so the three tiles add up on the page. The two legs average 187.5
     and 72.5: rounding each on its own gives 188 + 73 = 261 beside a total of
     260. The second leg is taken as what is left of the rounded total. */
  const byFirstSitting = Math.round(
    mean(retesters.map((s) => s.aug - s.baseline)),
  );
  const retestTotal = Math.round(
    mean(retesters.map((s) => s.sep - s.baseline)),
  );

  const reached = (score: number) =>
    students.filter((student) => student.best >= score).length;

  return {
    label,
    students,
    total: students.length,
    improved,
    averageGain: Math.round(mean(students.map((student) => student.gain))),
    sendLine: SEND_LINE,
    atSendLineAtStart: students.filter(
      (student) => student.baseline >= SEND_LINE,
    ).length,
    atSendLine: reached(SEND_LINE),
    at1300: reached(1300),
    at1400: reached(1400),
    retesters,
    retest: {
      count: retesters.length,
      byFirstSitting,
      added: retestTotal - byFirstSitting,
      total: retestTotal,
    },
    percentiles,
  };
}

export type SatResults = ReturnType<typeof build>;

export const satResults2026 = build(
  "SAT Prep Results · Summer and Fall 2026",
  cohort2026,
  percentiles2026,
);

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

/** A count as a word, for running copy. Falls back to digits past twenty. */
export function spell(count: number, capital = false) {
  const word = WORDS[count] ?? String(count);
  return capital ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

/** 91 to "91st". */
export function ordinal(value: number) {
  const tens = value % 100;
  if (tens >= 11 && tens <= 13) return `${value}th`;
  return `${value}${["th", "st", "nd", "rd"][value % 10] ?? "th"}`;
}
