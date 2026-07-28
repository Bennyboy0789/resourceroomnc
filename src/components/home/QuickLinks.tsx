import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { getProgram } from "@/content/programs";

/** The four programs surfaced directly under the hero, in order. */
const quickLinks = [
  { slug: "tutoring", label: "Tutoring Programs" },
  { slug: "camps", label: "Track-Out & Summer Camps" },
  { slug: "sat-act-prep", label: "SAT / ACT Prep" },
  { slug: "pathways-academy", label: "Pathways Academy" },
];

/**
 * Flat strip of headline programs directly beneath the hero — the shortcut row
 * for visitors who already know what they came for.
 */
export function QuickLinks() {
  return (
    <div className="border-b border-navy-950/10 bg-white">
      <Container size="wide">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ slug, label }) => {
            const program = getProgram(slug);
            if (!program) return null;

            return (
              <li
                key={slug}
                className="border-b border-navy-950/8 last:border-b-0 sm:border-b-0 sm:border-l sm:border-navy-950/8 sm:first:border-l-0 lg:[&:nth-child(3)]:border-l"
              >
                <Link
                  href={`/programs/${slug}`}
                  className="group flex h-full items-center gap-3 px-1 py-5 transition-colors sm:px-6"
                >
                  <Icon
                    name={program.icon}
                    className="h-5 w-5 shrink-0 text-brand-500 transition-colors group-hover:text-navy-950"
                  />
                  <span className="text-xs font-bold uppercase leading-snug tracking-[0.06em] text-navy-950">
                    {label}
                  </span>
                  <Icon
                    name="arrowRight"
                    className="ml-auto h-4 w-4 shrink-0 text-navy-600 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
}
