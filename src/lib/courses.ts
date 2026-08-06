import type { IconName } from "@/components/icons";
import { courses, type Course } from "@/content/courses";
import { getProgram } from "@/content/programs";
import { productPagesForProgram } from "@/content/products";

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
 * Two groups are deliberately absent, both so the Private Tutoring page shows
 * only what the live site's "Tutoring Programs" tab shows:
 *
 *   Emerging Learners  Joe went through this group by name on the Aug 3 2026
 *                      call — Early Reading Instruction, Lego Exploration,
 *                      Minecraft Education, Ms. Sam's New 2 Numbers — and said
 *                      "we're not even running those programs now".
 *   Workshops          Its one course, Educational Workshops, is not on that
 *                      tab either. Removed at Joe's request.
 *
 * Neither is deleted — both stay reachable in the unlisted catalog, they just
 * no longer advertise themselves on a program page. Put a group back here to
 * re-list it.
 */
const GROUP_PROGRAM: Record<string, string> = {
  "STEAM Programs": "camps",
  "LEGO Robotics": "camps",
  "Gaming Education": "camps",
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

/**
 * A program page's product grid, which is not only its catalog courses.
 *
 * The live site's category tabs mix the two: /tutoring/ lists four course
 * pages alongside Summer Bridge, which is a program in its own right. Joe
 * asked for those tabs to be mirrored, so a program can name sibling programs
 * to show beside its courses.
 *
 * A program never lists itself. On the live site /tutoring/ was a category page
 * separate from the Private Tutoring product page; here Joe asked for the two
 * to be combined, so "Private Tutoring" IS /programs/tutoring and a card
 * pointing at the page you are already reading would be a dead end.
 */
export type ProgramProduct = {
  href: string;
  name: string;
  image: string | null;
  imageAlt: string;
  /** Grade band or price line above the title, where one exists. */
  meta: string | null;
  icon: IconName;
};

export function productsForProgram(programSlug: string): ProgramProduct[] {
  const program = getProgram(programSlug);

  /* Product pages come first — they are the buyable things Joe asked to lead
     with. Camps is the exception: its two category pages are the whole grid,
     because the 14 individual STEAM courses were the tile wall he asked us to
     wipe, and they remain reachable from the unlisted catalog. */
  const pages: ProgramProduct[] = productPagesForProgram(programSlug).map((product) => ({
    href: `/programs/${product.programSlug}/${product.slug}`,
    name: product.name,
    image: product.image.src,
    imageAlt: product.image.alt,
    meta: product.priceLabel ?? null,
    icon: program?.icon ?? "sparkle",
  }));

  if (programSlug === "camps") return pages;

  const courses: ProgramProduct[] = coursesForProgram(programSlug).map((course) => ({
    href: `/courses/${course.slug}`,
    name: course.name,
    image: course.image ?? null,
    imageAlt: course.imageAlt,
    meta: course.grades ?? null,
    icon: groupIcon(course.group),
  }));

  const siblings: ProgramProduct[] = (program?.alsoListed ?? [])
    .filter((slug) => slug !== programSlug)
    .flatMap((slug) => {
      const sibling = getProgram(slug);
      if (!sibling) return [];
      return [
        {
          href: `/programs/${sibling.slug}`,
          name: sibling.name,
          image: sibling.image.src,
          imageAlt: sibling.image.alt,
          meta: sibling.category,
          icon: sibling.icon,
        },
      ];
    });

  return [...pages, ...courses, ...siblings];
}
