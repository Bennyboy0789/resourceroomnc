import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  ordinal,
  spell,
  type SatResults as Results,
} from "@/content/sat-results";
import { addressLine, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { stagger } from "@/lib/stagger";

/**
 * The SAT results section: the proof a parent sees before anything is for sale.
 *
 * It makes three points in a fixed order, because each one answers the doubt
 * the one before it leaves behind. Everyone improved. Testing twice in a row
 * adds more. And the scores they finished on are strong ones, which most
 * parents underestimate because they remember an older scale.
 *
 * Every number comes from `content/sat-results`. Nothing here is a literal, so
 * a new cohort cannot leave a sentence and a chart disagreeing with each other.
 *
 * The charts are drawn twice, once for a wide screen and once for a phone,
 * rather than scaled. A 900-unit drawing shrunk to 350 pixels puts its labels
 * at six pixels tall; the phone version is laid out at phone size instead,
 * with thinner marks and without the per-student labels that cannot fit.
 * Only one is ever displayed, so only one is read out.
 */
export function SatResults({ results }: { results: Results }) {
  const emphasized = results.percentiles.find((row) => row.emphasis);
  const at1300 = results.percentiles.find((row) => row.score === 1300);

  return (
    <>
      <Section tone="white" id="results">
        <SectionHeading
          eyebrow={results.label}
          title="Every student"
          accent="improved."
          description={`${spell(results.total, true)} students finished our SAT program this summer and took an official College Board SAT in August or September. Every one of them scored higher than their starting practice test.`}
        />

        <dl className="mt-12 grid grid-cols-2 border-t-[3px] border-navy-950 lg:grid-cols-4">
          {headlineStats(results).map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={stagger(index, 0.08)}
              className={cn(
                "border-b border-navy-900/10 py-6 pr-4",
                /* Dividers follow the grid: two columns on a phone, four from lg. */
                index % 2 === 1 && "border-l pl-5",
                index > 0 && "lg:border-l lg:pl-6",
              )}
            >
              <dt className="display text-4xl tabular-nums text-brand-500 sm:text-5xl">
                {stat.value}
              </dt>
              <dd className="mt-3 text-sm font-medium leading-snug text-navy-600">
                {stat.label}
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-16">
          <h3 className="display text-balance text-2xl text-navy-950 sm:text-3xl">
            {`${spell(results.total, true)} students. ${spell(results.improved, true)} arrows up.`}
          </h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-navy-600">
            {`Each arrow is one student, from their first full-length practice test to their best official score. The dashed line marks ${results.sendLine}.`}
          </p>
          <ChartFrame className="mt-6 bg-mist">
            <ArrowChart results={results} className="hidden md:block" />
            <ArrowChart results={results} compact className="md:hidden" />
          </ChartFrame>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-navy-600">
            When they started, {spell(results.atSendLineAtStart)} of these
            students were at {results.sendLine} or above.{" "}
            <strong className="font-bold text-navy-950">
              By the end, {spell(results.atSendLine)} were.
            </strong>
          </p>
        </Reveal>
      </Section>

      <Section tone="frost">
        <SectionHeading
          eyebrow="The method"
          title="How our system"
          accent="works."
          description="Three things, done the same way for every student."
        />
        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {SYSTEM.map((step, index) => (
            <Reveal
              key={step.title}
              as="li"
              delay={stagger(index, 0.08)}
              className="rounded-card border border-navy-900/8 bg-white p-7"
            >
              <span className="grid h-11 w-11 place-items-center rounded-chip bg-sun-500 text-sm font-bold tabular-nums text-navy-950">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-navy-950">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-navy-600">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* The one dark section, and the one place both brand colors carry data:
          gold only reads as a mark on a dark ground, and this is the chart
          where the gold is the whole point. */}
      <section className="bg-navy-950 py-20 text-white sm:py-24 lg:py-28">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow="The retest"
            title="Then they took it"
            accent="again."
            description={`${spell(results.retest.count, true)} students tested in August and again in September, four weeks later, with no break in their preparation. All ${spell(results.retest.count)} went up again.`}
          />

          <Reveal className="mt-10">
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-sm font-semibold text-white/85">
              <li className="flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 rounded-[3px] bg-brand-400" />
                Gain by August
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-3.5 w-3.5 rounded-[3px] bg-sun-500" />
                Added in September
              </li>
            </ul>
            <ChartFrame className="mt-5 bg-white/[0.04]">
              <RetestChart results={results} className="hidden md:block" />
              <RetestChart results={results} compact className="md:hidden" />
            </ChartFrame>
          </Reveal>

          <Reveal className="mt-8">
            <dl className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <Term
                value={`+${results.retest.byFirstSitting}`}
                label="average gain by the August test"
                className="border-t-4 border-brand-400 bg-white/[0.06]"
                valueClassName="text-brand-400"
              />
              <Operator>+</Operator>
              <Term
                value={`+${results.retest.added}`}
                label="more on the September retest"
                className="border-t-4 border-sun-500 bg-white/[0.06]"
                valueClassName="text-sun-500"
              />
              <Operator>=</Operator>
              <Term
                value={`+${results.retest.total}`}
                label="total, starting score to September"
                className="bg-sun-500"
                valueClassName="text-navy-950"
                labelClassName="text-navy-950/75"
              />
            </dl>
          </Reveal>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          eyebrow="In context"
          title="What these scores"
          accent="mean."
          description="Out of every 100 students who take the SAT, how many each score beats."
        />

        <Reveal className="mt-12">
          <ChartFrame className="bg-mist">
            <PercentileChart results={results} className="hidden md:block" />
            <PercentileChart results={results} compact className="md:hidden" />
          </ChartFrame>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-card border border-navy-900/10 p-7">
            <h3 className="text-xl font-bold tracking-tight text-navy-950">
              {results.sendLine} is the line that matters
            </h3>
            <p className="mt-3 leading-relaxed text-navy-600">
              Most colleges are test optional, so families choose whether to
              send a score. {results.sendLine} is the common threshold for
              sending one.{" "}
              <strong className="font-bold text-navy-950">
                {spell(results.atSendLine, true)} of our {spell(results.total)}{" "}
                students finished at or above it.
              </strong>
            </p>
          </Reveal>
          <Reveal
            delay={0.08}
            className="rounded-card border border-navy-900/10 p-7"
          >
            <h3 className="text-xl font-bold tracking-tight text-navy-950">
              You do not need a 1500
            </h3>
            <p className="mt-3 leading-relaxed text-navy-600">
              Many parents remember 1500 as the mark of a top student.
              {at1300 && emphasized ? (
                <>
                  {" "}
                  On today&rsquo;s SAT,{" "}
                  <strong className="font-bold text-navy-950">
                    a {at1300.score} beats {at1300.percentile} out of 100 test
                    takers, and a {emphasized.score} beats{" "}
                    {emphasized.percentile}.
                  </strong>
                </>
              ) : null}{" "}
              {spell(results.at1300, true)} of our students finished at 1300 or
              above.
            </p>
          </Reveal>
        </div>

        {/* Small print, and kept on purpose: it is what makes the figures
            above worth believing. */}
        <Reveal>
          <p className="mt-10 max-w-4xl border-t border-navy-900/10 pt-6 text-sm leading-relaxed text-navy-500">
            <strong className="font-bold text-navy-700">How we measure.</strong>{" "}
            Starting scores come from a full-length practice SAT taken under
            real test conditions before lessons began. August and September
            figures are official College Board scores; where a student tested
            twice, the higher score is counted. Percentiles come from College
            Board&rsquo;s published tables. A first practice test is taken cold,
            so part of every gain comes from getting familiar with the test.
            These are one group&rsquo;s results and are not a guarantee for any
            individual student.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="grid gap-8 rounded-card bg-navy-900 p-8 text-white sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12">
            <div>
              <h3 className="display text-balance text-3xl sm:text-4xl">
                Testing this year?{" "}
                <span className="text-sun-500">
                  Let&rsquo;s build the plan.
                </span>
              </h3>
              <p className="mt-4 max-w-xl leading-relaxed text-white/75">
                We start with a real practice test, show you exactly where your
                student stands, and map out test dates that keep the momentum
                going.
              </p>
              <Button href="/contact" size="lg" className="mt-7">
                Schedule a Free Consultation
              </Button>
            </div>
            <address className="flex flex-col gap-3 not-italic">
              <a
                href={site.phoneHref}
                className="flex items-center gap-3 text-2xl font-bold tabular-nums hover:text-sun-500"
              >
                <Icon name="phone" className="h-5 w-5 shrink-0 text-sun-500" />
                {site.phone}
              </a>
              <a
                href={site.emailHref}
                className="break-all font-semibold underline decoration-white/30 underline-offset-4 hover:text-sun-500"
              >
                {site.email}
              </a>
              <span className="text-white/70">{addressLine}</span>
            </address>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function headlineStats(results: Results) {
  return [
    {
      value: `${results.improved} of ${results.total}`,
      label: "scored higher than when they started",
    },
    { value: `+${results.averageGain}`, label: "average points gained" },
    {
      value: String(results.at1300),
      label: "students finished at 1300 or above",
    },
    {
      value: String(results.at1400),
      label: "students finished at 1400 or above",
    },
  ];
}

const SYSTEM = [
  {
    title: "Start with a real test",
    body: "Every student begins with a full-length practice SAT under real test conditions, proctored in our center. That score is the baseline we measure against, every time.",
  },
  {
    title: "Prepare one on one",
    body: "Twenty hours of one-on-one tutoring built around that student’s specific gaps, plus independent practice at home between sessions.",
  },
  {
    title: "Test back to back",
    body: "Students sit for consecutive test dates without pausing their prep. They relax, they get sharper, and they never have to restart from cold.",
  },
];

function ChartFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card p-3 sm:p-6 lg:p-8", className)}>
      {children}
    </div>
  );
}

function Term({
  value,
  label,
  className,
  valueClassName,
  labelClassName = "text-white/70",
}: {
  value: string;
  label: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-chip p-5", className)}>
      <dt
        className={cn(
          "display text-4xl tabular-nums sm:text-5xl",
          valueClassName,
        )}
      >
        {value}
      </dt>
      <dd className={cn("text-sm font-medium leading-snug", labelClassName)}>
        {label}
      </dd>
    </div>
  );
}

function Operator({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="self-center text-center text-3xl font-bold leading-none text-white/45"
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ charts */

type Frame = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

/** Maps a value in `domain` to a y coordinate inside the frame. Up is higher. */
function yScale(frame: Frame, [min, max]: [number, number]) {
  return (value: number) =>
    frame.bottom - ((value - min) / (max - min)) * (frame.bottom - frame.top);
}

/** Whole hundreds either side of the scores, with headroom for a label on top. */
function scoreDomain(low: number, high: number): [number, number] {
  return [Math.floor(low / 100) * 100, Math.ceil((high + 1) / 100) * 100];
}

function hundreds([min, max]: [number, number]) {
  const ticks: number[] = [];
  /* Stops one short of the top: that line is headroom, not a score anyone hit. */
  for (let tick = min; tick < max; tick += 100) ticks.push(tick);
  return ticks;
}

/** Keeps coordinates short in the markup. */
const r = (value: number) => Math.round(value * 10) / 10;

type ChartProps = { results: Results; compact?: boolean; className?: string };

/** One arrow per student, starting practice score to best official score. */
function ArrowChart({ results, compact, className }: ChartProps) {
  const frame: Frame = compact
    ? { width: 390, height: 400, left: 44, right: 386, top: 16, bottom: 350 }
    : { width: 900, height: 410, left: 72, right: 892, top: 22, bottom: 356 };
  const shaft = compact ? 7 : 18;
  const head = compact ? { half: 7, tall: 9 } : { half: 15, tall: 15 };
  const dot = compact ? 3.5 : 5.5;
  const axis = compact ? 13 : 16;

  const { students, sendLine } = results;
  const domain = scoreDomain(
    Math.min(...students.map((s) => s.baseline)),
    Math.max(...students.map((s) => s.best)),
  );
  const y = yScale(frame, domain);
  const slot = (frame.right - frame.left) / students.length;
  const titleId = compact ? "sat-arrows-compact" : "sat-arrows";

  return (
    <svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      role="img"
      aria-labelledby={titleId}
      className={cn("h-auto w-full", compact && "mx-auto max-w-md", className)}
    >
      <title id={titleId}>
        {`${spell(students.length, true)} arrows, one per student, each rising from the starting practice test score to the best official SAT score. Every arrow points up. A dashed line marks ${sendLine}.`}
      </title>

      <rect
        className="fill-sun-200/55"
        x={frame.left}
        y={frame.top}
        width={frame.right - frame.left}
        height={r(y(sendLine) - frame.top)}
      />

      {hundreds(domain).map((tick) => (
        <g key={tick}>
          <line
            className="stroke-navy-900/10"
            strokeWidth={1.5}
            x1={frame.left}
            x2={frame.right}
            y1={r(y(tick))}
            y2={r(y(tick))}
          />
          <text
            className={
              tick === sendLine ? "fill-navy-950 font-bold" : "fill-navy-600"
            }
            fontSize={axis}
            x={frame.left - 9}
            y={r(y(tick) + axis * 0.34)}
            textAnchor="end"
          >
            {tick}
          </text>
        </g>
      ))}

      <line
        className="stroke-navy-950"
        strokeWidth={compact ? 1.75 : 2.5}
        strokeDasharray={compact ? "6 5" : "9 7"}
        x1={frame.left}
        x2={frame.right}
        y1={r(y(sendLine))}
        y2={r(y(sendLine))}
      />

      {students.map((student, index) => {
        const cx = frame.left + slot * (index + 0.5);
        const tip = y(student.best);
        const foot = y(student.baseline);

        return (
          <g key={index}>
            <title>{`Started at ${student.baseline}, best official score ${student.best} (+${student.gain})`}</title>
            <rect
              className="fill-brand-500"
              x={r(cx - shaft / 2)}
              y={r(tip + head.tall - 1)}
              width={shaft}
              height={r(Math.max(0, foot - tip - head.tall + 1))}
            />
            <path
              className="fill-brand-500"
              d={`M ${r(cx - head.half)} ${r(tip + head.tall)} L ${r(cx)} ${r(tip)} L ${r(cx + head.half)} ${r(tip + head.tall)} Z`}
            />
            <circle
              className="fill-navy-950 stroke-mist"
              strokeWidth={compact ? 1.5 : 2.5}
              cx={r(cx)}
              cy={r(foot)}
              r={dot}
            />
            {/* One label per arrow needs about 45 units of room. The phone
                drawing has 19, so there it leaves the gains to the stat strip. */}
            {compact ? null : (
              <text
                className="fill-navy-950 stroke-mist font-bold"
                style={{ paintOrder: "stroke" }}
                strokeWidth={5}
                strokeLinejoin="round"
                fontSize={15}
                x={r(cx)}
                y={r(tip - 7)}
                textAnchor="middle"
              >
                +{student.gain}
              </text>
            )}
          </g>
        );
      })}

      <line
        className="stroke-navy-950"
        strokeWidth={2.5}
        x1={frame.left}
        x2={frame.right}
        y1={frame.bottom}
        y2={frame.bottom}
      />
      <text
        className="fill-navy-600"
        fontSize={axis}
        x={(frame.left + frame.right) / 2}
        y={frame.bottom + (compact ? 28 : 32)}
        textAnchor="middle"
      >
        {`${spell(students.length, true)} students, ordered by starting score`}
      </text>
    </svg>
  );
}

/**
 * The students who sat both dates, as two-part bars: what they had gained by
 * August, and what the September retest put on top.
 *
 * The arrowhead is a fixed size with its tip on the September score. On a small
 * gain it overlaps the top of the August bar rather than shrinking to a sliver,
 * so every bar still visibly points up; the exact figure is the label above it.
 */
function RetestChart({ results, compact, className }: ChartProps) {
  const frame: Frame = compact
    ? { width: 390, height: 420, left: 44, right: 386, top: 34, bottom: 368 }
    : { width: 900, height: 430, left: 72, right: 892, top: 36, bottom: 374 };
  const bar = compact ? 22 : 52;
  const head = compact ? { half: 17, tall: 12 } : { half: 39, tall: 22 };
  const axis = compact ? 13 : 16;
  const label = compact ? 14 : 24;

  const { retesters } = results;
  const domain = scoreDomain(
    Math.min(...retesters.map((s) => s.baseline)),
    Math.max(...retesters.map((s) => s.sep)),
  );
  const y = yScale(frame, domain);
  const slot = (frame.right - frame.left) / retesters.length;
  const titleId = compact ? "sat-retest-compact" : "sat-retest";

  return (
    <svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      role="img"
      aria-labelledby={titleId}
      className={cn("h-auto w-full", compact && "mx-auto max-w-md", className)}
    >
      <title id={titleId}>
        {`${spell(retesters.length, true)} students shown as two-part bars. The lower blue part is the gain from the starting practice test to the August SAT. The upper gold part with an arrowhead is the additional gain on the September retest. All ${spell(retesters.length)} went up again.`}
      </title>

      {hundreds(domain)
        /* The lowest hundred sits on the base line, where its label would
           collide with the caption underneath. */
        .slice(1)
        .map((tick) => (
          <g key={tick}>
            <line
              className="stroke-white/12"
              strokeWidth={1.5}
              x1={frame.left}
              x2={frame.right}
              y1={r(y(tick))}
              y2={r(y(tick))}
            />
            <text
              className="fill-white/65"
              fontSize={axis}
              x={frame.left - 9}
              y={r(y(tick) + axis * 0.34)}
              textAnchor="end"
            >
              {tick}
            </text>
          </g>
        ))}

      {retesters.map((student, index) => {
        const cx = frame.left + slot * (index + 0.5);
        const foot = y(student.baseline);
        const seam = y(student.aug);
        const tip = y(student.sep);
        const neck = tip + head.tall;

        return (
          <g key={index}>
            <title>{`Started at ${student.baseline}, August ${student.aug} (+${student.aug - student.baseline}), September ${student.sep} (+${student.sep - student.aug} more)`}</title>
            <rect
              className="fill-brand-400"
              x={r(cx - bar / 2)}
              y={r(seam)}
              width={bar}
              height={r(foot - seam)}
              rx={3}
            />
            {neck < seam ? (
              <>
                <rect
                  className="fill-sun-500"
                  x={r(cx - bar / 2)}
                  y={r(neck - 1)}
                  width={bar}
                  height={r(seam - neck + 1)}
                />
                <line
                  className="stroke-navy-950"
                  strokeWidth={compact ? 2 : 3}
                  x1={r(cx - bar / 2)}
                  x2={r(cx + bar / 2)}
                  y1={r(seam)}
                  y2={r(seam)}
                />
              </>
            ) : null}
            <path
              className="fill-sun-500"
              d={`M ${r(cx - head.half)} ${r(neck)} L ${r(cx)} ${r(tip)} L ${r(cx + head.half)} ${r(neck)} Z`}
            />
            <text
              className="fill-sun-500 stroke-navy-950 font-extrabold"
              style={{ paintOrder: "stroke" }}
              strokeWidth={compact ? 4 : 6}
              strokeLinejoin="round"
              fontSize={label}
              x={r(cx)}
              y={r(tip - (compact ? 7 : 10))}
              textAnchor="middle"
            >
              +{student.sep - student.aug}
            </text>
          </g>
        );
      })}

      <line
        className="stroke-white/45"
        strokeWidth={2.5}
        x1={frame.left}
        x2={frame.right}
        y1={frame.bottom}
        y2={frame.bottom}
      />
      <text
        className="fill-white/65"
        fontSize={axis}
        x={(frame.left + frame.right) / 2}
        y={frame.bottom + (compact ? 28 : 32)}
        textAnchor="middle"
      >
        {compact
          ? `${spell(retesters.length, true)} students who tested twice`
          : `${spell(retesters.length, true)} students who tested in August and again in September`}
      </text>
    </svg>
  );
}

/** Light to dark, so a higher percentile is also a heavier bar. */
const RAMP = [
  "fill-brand-400",
  "fill-brand-500",
  "fill-brand-600",
  "fill-navy-800",
  "fill-navy-950",
];

/** How many of every 100 test takers each score beats. */
function PercentileChart({ results, compact, className }: ChartProps) {
  const frame: Frame = compact
    ? { width: 390, height: 330, left: 34, right: 386, top: 38, bottom: 276 }
    : { width: 900, height: 340, left: 58, right: 892, top: 44, bottom: 280 };
  const axis = compact ? 13 : 16;

  const { percentiles } = results;
  const y = yScale(frame, [0, 100]);
  const slot = (frame.right - frame.left) / percentiles.length;
  const bar = slot * (compact ? 0.72 : 0.76);
  const titleId = compact ? "sat-percentiles-compact" : "sat-percentiles";

  return (
    <svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      role="img"
      aria-labelledby={titleId}
      className={cn("h-auto w-full", compact && "mx-auto max-w-md", className)}
    >
      <title id={titleId}>
        {`Percentile reached by SAT score: ${percentiles
          .map(
            (row) =>
              `${row.score} is the ${ordinal(row.percentile)} percentile`,
          )
          .join(", ")}.`}
      </title>

      {[0, 50, 100].map((tick) => (
        <g key={tick}>
          <line
            className="stroke-navy-900/10"
            strokeWidth={1.5}
            x1={frame.left}
            x2={frame.right}
            y1={r(y(tick))}
            y2={r(y(tick))}
          />
          <text
            className="fill-navy-600"
            fontSize={axis}
            x={frame.left - 9}
            y={r(y(tick) + axis * 0.34)}
            textAnchor="end"
          >
            {tick}
          </text>
        </g>
      ))}

      {percentiles.map((row, index) => {
        const cx = frame.left + slot * (index + 0.5);
        const top = y(row.percentile);
        const big = Boolean(row.emphasis);

        return (
          <g key={row.score}>
            <title>{`A score of ${row.score} beats ${row.percentile} out of 100 test takers`}</title>
            <rect
              className={RAMP[Math.min(index, RAMP.length - 1)]}
              x={r(cx - bar / 2)}
              y={r(top)}
              width={r(bar)}
              height={r(frame.bottom - top)}
              rx={4}
            />
            {/* Gold cap on the score the copy is about. A fill on a dark bar,
                which is the only way the brand gold reads on a light page. */}
            {big ? (
              <rect
                className="fill-sun-500"
                x={r(cx - bar / 2)}
                y={r(top)}
                width={r(bar)}
                height={compact ? 7 : 10}
                rx={4}
              />
            ) : null}
            <text
              className="fill-navy-950 font-bold"
              fontSize={compact ? (big ? 18 : 15) : big ? 28 : 21}
              x={r(cx)}
              y={r(top - (compact ? 7 : 10))}
              textAnchor="middle"
            >
              {ordinal(row.percentile)}
            </text>
            <text
              className={cn(
                "fill-navy-950",
                big ? "font-extrabold" : "font-semibold",
              )}
              fontSize={compact ? (big ? 17 : 15) : big ? 24 : 20}
              x={r(cx)}
              y={frame.bottom + (compact ? 24 : 30)}
              textAnchor="middle"
            >
              {row.score}
            </text>
          </g>
        );
      })}

      <line
        className="stroke-navy-950"
        strokeWidth={2.5}
        x1={frame.left}
        x2={frame.right}
        y1={frame.bottom}
        y2={frame.bottom}
      />
    </svg>
  );
}
