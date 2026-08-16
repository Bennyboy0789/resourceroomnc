import type { CSSProperties } from "react";
import { Icon, type IconName } from "@/components/icons";

export type NexusNode = { title: string; body: string; icon: IconName };
export type NexusHub = { title: string; body: string; icon: IconName };

/*
 * Geometry, in SVG user units. The box is square and the viewBox is 0 0 100
 * 100, so a unit is one percent of the container's edge and the same numbers
 * drive both the spokes and the CSS percentages that place the cards. That
 * shared origin is the point: the two cannot fall out of alignment.
 */
const RING = 36; // card centers
const SPOKE_FROM = 13; // just clear of the hub
const SPOKE_TO = 24; // just short of a card
const SPOKE_LEN = SPOKE_TO - SPOKE_FROM;

/** Clockwise from the top. */
function polar(index: number, total: number, radius: number) {
  const angle = ((-90 + (index * 360) / total) * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
}

/**
 * A hub-and-spoke diagram: one central capability with the skills it drives
 * arranged around it, and a signal firing down one spoke at a time.
 *
 * Deliberately not the journey path. A process is a line with a start and an
 * end; executive function is a hub — everything depends on the middle, and the
 * order the spokes fire in carries no meaning. Reading it as a sequence would
 * be reading it wrong.
 *
 * Two layouts from one markup, as elsewhere: a true ring on large screens
 * (cards absolutely placed at their polar coordinates, spokes drawn between),
 * and a plain stacked grid below that, where the ring would be unreadable and
 * the SVG is dropped entirely.
 *
 * All motion is CSS, so this stays a server component and the diagram is fully
 * present before any JavaScript runs.
 */
export function SkillNexus({ hub, nodes }: { hub: NexusHub; nodes: NexusNode[] }) {
  return (
    <div className="mx-auto w-full max-w-lg lg:max-w-[44rem]">
      <div className="relative lg:aspect-square">
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full lg:block"
        >
          {nodes.map((node, index) => {
            const from = polar(index, nodes.length, SPOKE_FROM);
            const to = polar(index, nodes.length, SPOKE_TO);
            const line = { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
            return (
              <g key={node.title}>
                <line
                  {...line}
                  stroke="var(--color-brand-500)"
                  strokeOpacity={0.22}
                  strokeWidth={2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  {...line}
                  className="ef-signal"
                  style={{ "--ef-i": index, "--ef-len": SPOKE_LEN } as CSSProperties}
                  stroke="var(--color-brand-500)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray={`${SPOKE_LEN * 0.3} ${SPOKE_LEN * 0.7}`}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
        </svg>

        {/* Hub. Sized to 24% so its edge lands just inside SPOKE_FROM. */}
        <div className="relative mx-auto aspect-square w-40 lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[24%] lg:-translate-x-1/2 lg:-translate-y-1/2">
          {[0, 1].map((ring) => (
            <span
              key={ring}
              aria-hidden="true"
              className="ef-hub-wave absolute inset-0 rounded-full border-2 border-brand-500"
              style={{ animationDelay: `${ring * 1.6}s` }}
            />
          ))}
          <div className="relative grid h-full w-full place-items-center rounded-full bg-navy-950 px-4 text-center">
            <div>
              <Icon name={hub.icon} className="mx-auto h-7 w-7 text-sun-500" />
              <p className="mt-1.5 text-sm font-bold leading-tight tracking-tight text-white">
                {hub.title}
              </p>
              <p className="mt-1 text-[0.65rem] leading-snug text-white/70">{hub.body}</p>
            </div>
          </div>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:block">
          {nodes.map((node, index) => {
            const at = polar(index, nodes.length, RING);
            return (
              <li
                key={node.title}
                style={
                  {
                    "--ef-i": index,
                    "--ef-x": `${at.x}%`,
                    "--ef-y": `${at.y}%`,
                  } as CSSProperties
                }
                className="lg:absolute lg:left-[var(--ef-x)] lg:top-[var(--ef-y)] lg:w-40 lg:-translate-x-1/2 lg:-translate-y-1/2"
              >
                {/*
                 * The animation moves this inner element, not the li: the li
                 * carries the centering translate on desktop, and an animated
                 * transform on the same element would overwrite it.
                 */}
                <div className="ef-node h-full rounded-card border-2 border-brand-500/20 bg-white p-4 lg:text-center">
                  <Icon name={node.icon} className="h-5 w-5 text-brand-500 lg:mx-auto" />
                  <h3 className="mt-2 text-sm font-bold tracking-tight text-navy-950">
                    {node.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-navy-600">{node.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
