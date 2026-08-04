import type { IconName } from "@/components/icons";
import { courses, type Course } from "@/content/courses";

/** Icon fallback per catalog group, used when a course has no image. */
const GROUP_ICONS: Record<string, IconName> = {
  "STEAM Programs": "sparkle",
  "LEGO Robotics": "target",
  "Gaming Education": "play",
  "Emerging Learners": "book",
  Workshops: "users",
  "Tutoring Programs": "pencil",
  "Test Prep": "target",
};

export function groupIcon(group: string): IconName {
  return GROUP_ICONS[group] ?? "sparkle";
}

/**
 * Which program page a catalog group belongs under.
 *
 * "Emerging Learners" is deliberately absent. On the Aug 3 2026 call Joe went
 * through that group by name — Early Reading Instruction, Lego Exploration,
 * Minecraft Education, Ms. Sam's New 2 Numbers — and said "we're not even
 * running those programs now". They were surfacing on the Private Tutoring
 * page, which is a large part of why it felt overwhelming. The pages still
 * exist in the unlisted catalog; they just no longer advertise themselves on a
 * program page. Put the group back here to re-list them.
 */
const GROUP_PROGRAM: Record<string, string> = {
  "STEAM Programs": "camps",
  "LEGO Robotics": "camps",
  "Gaming Education": "camps",
  Workshops: "tutoring",
  "Tutoring Programs": "tutoring",
  "Test Prep": "sat-act-prep",
};

/**
 * Returns undefined for a group that belongs to no program — previously this
 * fell back to "camps", which would now label an Emerging Learners course as
 * part of Camps. The caller renders the "Part of" link only when this resolves.
 */
export function programForGroup(group: string): string | undefined {
  return GROUP_PROGRAM[group];
}

/**
 * The courses that run inside a given program.
 *
 * Course pages were reachable only from the catalog — sixteen of them had a
 * single inbound link, which is close to invisible to a crawler and useless to
 * a parent already reading about camps. This is the inverse of
 * `programForGroup`, so the program pages can list what actually runs in them.
 */
export function coursesForProgram(programSlug: string): Course[] {
  const groups = Object.entries(GROUP_PROGRAM)
    .filter(([, slug]) => slug === programSlug)
    .map(([group]) => group);
  return courses.filter((course) => groups.includes(course.group));
}

function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatPrice(price: Course["price"]): string | null {
  if (!price) return null;
  if (price.low === price.high) return money(price.low);
  return `${money(price.low)} – ${money(price.high)}`;
}
