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

export function QuickLinks() {
  // `flow-root` keeps the card's negative margin from collapsing into this
  // wrapper, so the card lifts over the hero instead of pushing white down.
  return (
    <div className="relative z-10 flow-root bg-white">
      <Container>
        <ul className="-mt-10 grid gap-3 rounded-2xl border border-navy-900/10 bg-white p-3 shadow-xl shadow-navy-900/10 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(({ slug, label }) => {
            const program = getProgram(slug);
            if (!program) return null;

            return (
              <li key={slug}>
                <Link
                  href={`/programs/${slug}`}
                  className="group flex h-full items-center gap-3 rounded-xl px-4 py-4 transition-colors hover:bg-mist"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-900/5 text-brand-600 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                    <Icon name={program.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-navy-900">{label}</span>
                  <Icon
                    name="arrowRight"
                    className="ml-auto h-4 w-4 shrink-0 text-navy-600 transition-transform group-hover:translate-x-0.5"
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
