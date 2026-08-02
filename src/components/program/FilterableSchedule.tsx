"use client";

import { useState } from "react";
import type { ScheduleGroup } from "@/content/programs";
import { cn } from "@/lib/cn";

/**
 * A schedule with filter chips over it.
 *
 * Built for the camps track-out calendar, which is sixteen windows across four
 * Wake County tracks. Rendered flat that is ~13,000px of scrolling on a phone,
 * and a parent only ever cares about one track — so this defaults to showing
 * everything (good for crawlers and for the family who wants an overview) and
 * lets one tap cut it to the four windows that apply to them.
 *
 * Every group stays in the DOM and is hidden with `hidden` rather than removed,
 * so the full calendar is still in the page source for search engines.
 */
export function FilterableSchedule({
  groups,
  allLabel = "All",
  children,
}: {
  groups: ScheduleGroup[];
  allLabel?: string;
  /** Pre-rendered group cards, in the same order as `groups`. */
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState<string | null>(null);

  /*
   * Sorted naturally, not in group order. The calendar is ordered by date, so
   * the first window of the school year belongs to Track 4 — which listed the
   * chips "Track 4, Track 3, Track 2, Track 1" and read like a mistake.
   */
  const filters = (
    [...new Set(groups.map((group) => group.filter).filter(Boolean))] as string[]
  ).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const matching = active
    ? groups.filter((group) => group.filter === active).length
    : groups.length;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip label={allLabel} active={active === null} onClick={() => setActive(null)} />
        {filters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            active={active === filter}
            onClick={() => setActive(filter)}
          />
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {matching} of {groups.length} windows
        {active ? ` for ${active}` : ""}.
      </p>

      <div
        className={cn(
          "grid gap-5",
          groups.length > 1 && "sm:grid-cols-2",
          groups.length > 4 && "lg:grid-cols-3",
        )}
      >
        {children.map((child, index) => (
          <div
            key={groups[index]?.title ?? index}
            hidden={Boolean(active) && groups[index]?.filter !== active}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      /* min-h-11 = 44px: the comfortable thumb target, well above the 24px
         WCAG minimum. */
      className={cn(
        "inline-flex min-h-11 items-center px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors",
        active
          ? "border border-navy-900 bg-navy-900 text-white"
          : "border border-navy-900/20 text-navy-700 hover:border-navy-900/50 hover:text-navy-950",
      )}
    >
      {label}
    </button>
  );
}
