import Image from "next/image";

export type CareNode = {
  /** Small label above the name — "Clinical", "Speech &". */
  title: string;
  /** The name itself, set larger — "Evaluation", "Language". */
  strong: string;
  /** Optional third line: the discipline, or the provider who covers it. */
  meta?: string;
};

/*
 * Hand-placed rather than generated from an angle.
 *
 * An even ring would space six nodes at 60°, but the labels are not the same
 * length and the student belongs at the top on its own, so the lower row is
 * pushed wider and dropped to clear the two mid nodes. These coordinates are
 * the result, in the viewBox's own units.
 */
const BOX = { w: 856, h: 672 };
const CENTRE = { x: 427, y: 373 };
const POINTS = [
  { x: 427, y: 66 }, // top — the student
  { x: 111, y: 288 }, // mid left
  { x: 744, y: 288 }, // mid right
  { x: 72, y: 576 }, // lower left
  { x: 427, y: 605 }, // lower centre
  { x: 783, y: 576 }, // lower right
];
/* The outer ring, by index: top→mid-left→lower-left→lower-centre→lower-right→
   mid-right→top. Every neighbour joined, so the six read as a network rather
   than as six things each wired only to the middle. */
const RING = [
  [0, 1],
  [1, 3],
  [3, 4],
  [4, 5],
  [5, 2],
  [2, 0],
];

/*
 * Two palettes, because this runs on two brands. Pathways is a deliberately
 * separate identity — its `pw-` tokens are documented as not Resource Room
 * colours — so the geometry is shared and the colour is not.
 */
const tones = {
  pathways: {
    stroke: "var(--color-pw-gold)",
    node: "border-pw-gold bg-pw-navy",
    centre: "border-pw-gold bg-pw-navy-soft",
    title: "text-pw-gold",
    meta: "text-white/60",
    card: "border-pw-navy/10 bg-white",
    badge: "border-pw-gold bg-pw-navy text-pw-gold",
    cardTitle: "text-pw-navy",
    cardMeta: "text-pw-ink",
  },
  brand: {
    stroke: "var(--color-sun-500)",
    node: "border-sun-500 bg-navy-950",
    centre: "border-sun-500 bg-brand-500",
    title: "text-sun-500",
    meta: "text-white/70",
    card: "border-navy-900/10 bg-white",
    badge: "border-sun-500 bg-navy-950 text-sun-500",
    cardTitle: "text-navy-950",
    cardMeta: "text-navy-600",
  },
} as const;

/**
 * A support network drawn as a web: the mark at the centre, six roles around
 * it, every neighbour joined.
 *
 * The ring is the argument. Spokes alone would say each service reports to the
 * middle; joining the neighbours says they also talk to each other, which is
 * the whole claim being made on both pages that use this.
 *
 * Desktop only. Below `lg` the circles would overlap long before they became
 * unreadable, so the same six render as a plain list instead — the diagram is
 * an illustration of the copy beside it, never the only place it is stated.
 */
export function CareWeb({
  nodes,
  logo,
  tone = "brand",
}: {
  nodes: CareNode[];
  logo: { src: string; alt: string };
  tone?: keyof typeof tones;
}) {
  const t = tones[tone];

  return (
    <>
      <div
        className="relative mx-auto mt-16 hidden w-full max-w-[856px] lg:block"
        style={{ aspectRatio: `${BOX.w} / ${BOX.h}` }}
      >
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${BOX.w} ${BOX.h}`}
          className="absolute inset-0 h-full w-full"
          fill="none"
          stroke={t.stroke}
          strokeWidth="1.5"
          opacity="0.5"
        >
          {POINTS.map((p, i) => (
            <line key={`spoke-${i}`} x1={CENTRE.x} y1={CENTRE.y} x2={p.x} y2={p.y} />
          ))}
          {RING.map(([a, b]) => (
            <line
              key={`ring-${a}-${b}`}
              x1={POINTS[a].x}
              y1={POINTS[a].y}
              x2={POINTS[b].x}
              y2={POINTS[b].y}
            />
          ))}
        </svg>

        <span
          style={{
            left: `${(CENTRE.x / BOX.w) * 100}%`,
            top: `${(CENTRE.y / BOX.h) * 100}%`,
          }}
          className={`absolute grid h-[188px] w-[188px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 p-7 ${t.centre}`}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={188}
            height={188}
            className="h-full w-full object-contain"
          />
        </span>

        {/* Keyed on title+strong, not `strong` alone: Academic Support and
            Behavioral Support share a second line. */}
        {nodes.map((node, index) => (
          <span
            key={`${node.title} ${node.strong}`}
            style={{
              left: `${(POINTS[index].x / BOX.w) * 100}%`,
              top: `${(POINTS[index].y / BOX.h) * 100}%`,
            }}
            className={`absolute grid h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 px-3 text-center ${t.node}`}
          >
            <span>
              <span
                className={`block text-[0.6875rem] font-bold uppercase tracking-[0.1em] ${t.title}`}
              >
                {node.title}
              </span>
              <span className="block text-[0.8125rem] font-bold uppercase leading-tight tracking-[0.02em] text-white">
                {node.strong}
              </span>
              {node.meta ? (
                <span className={`mt-1 block text-[0.625rem] leading-tight ${t.meta}`}>
                  {node.meta}
                </span>
              ) : null}
            </span>
          </span>
        ))}
      </div>

      <ul className="mt-12 grid gap-4 text-left sm:grid-cols-2 lg:hidden">
        {nodes.map((node) => (
          <li
            key={`${node.title} ${node.strong}`}
            className={`flex items-center gap-4 border p-5 ${t.card}`}
          >
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 text-[0.6rem] font-bold uppercase ${t.badge}`}
            >
              {node.strong.slice(0, 2)}
            </span>
            <span>
              <span
                className={`block text-[0.8rem] font-bold uppercase tracking-[0.08em] ${t.cardTitle}`}
              >
                {node.title} {node.strong}
              </span>
              {node.meta ? (
                <span className={`mt-0.5 block text-[0.8rem] ${t.cardMeta}`}>{node.meta}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
