import type { IconName } from "@/components/icons";
import { getCourse } from "@/content/courses";
import { getProgram, type ProgramImage } from "@/content/programs";

/**
 * The four program categories, agreed with Joe on the Aug 3 2026 call.
 *
 * These are the browse layer the site was missing. Before, the only way in was
 * /programs — ten cards with no grouping — or the course catalog, which is the
 * thing Joe found overwhelming. Now every route is Home → category → product,
 * three clicks at most, which is what he asked for.
 *
 * The grouping and the ORDER of items inside each category are transcribed from
 * the live resourceroomnc.com category pages (see docs/live-content/tutoring.txt,
 * test-prep.txt and camps.txt). Joe organised those himself and asked us to
 * mirror them rather than invent a new taxonomy.
 *
 * Categories live at the ROOT — /tutoring, not /programs/tutoring — for two
 * reasons. /tutoring and /camps are real URLs on the live site with years of
 * inbound links, so keeping the paths preserves that equity instead of spending
 * it on a redirect. And it keeps the product URLs (/programs/[slug],
 * /courses/[slug]) exactly where they already are.
 */

export type CategoryItem = {
  /** Which content collection the slug refers to. */
  kind: "program" | "course";
  slug: string;
};

export type ProgramCategory = {
  slug: string;
  /** Nav and card label — deliberately short. */
  label: string;
  /** Page H1, split so the last words can carry the accent color. */
  title: string;
  accent?: string;
  eyebrow: string;
  /** Sits under the H1 on the category page and in the mega menu. */
  description: string;
  icon: IconName;
  /** Masthead image. Reuses the lead program's artwork. */
  image: ProgramImage;
  items: CategoryItem[];
};

export const categories: ProgramCategory[] = [
  {
    slug: "tutoring",
    label: "Private Tutoring",
    eyebrow: "Tutoring and academic support",
    title: "Private tutoring for",
    accent: "every subject.",
    description:
      "Private, individualized tutoring for all subject areas from K–12. We work alongside emerging learners all the way through the most challenging high school courses.",
    icon: "pencil",
    image: {
      src: "/images/program-tutoring.jpg",
      alt: "A Resource Room tutor working one-to-one with a student on geometry at a table.",
      kind: "photo",
    },
    /* Order matches the live /tutoring page exactly. Executive Functioning is
       the one addition — it is a tutoring program with no home on the live
       category pages, and Specialized Support is the wrong shelf for it. */
    items: [
      { kind: "program", slug: "tutoring" },
      { kind: "course", slug: "homework-help" },
      { kind: "program", slug: "summer-bridge" },
      { kind: "course", slug: "zoom-tutoring" },
      { kind: "course", slug: "end-of-course-end-of-grade-exams" },
      { kind: "course", slug: "students-with-ieps" },
      { kind: "program", slug: "executive-functioning" },
    ],
  },
  {
    slug: "college-prep",
    label: "College Prep",
    eyebrow: "College prep programs",
    title: "SAT, ACT and",
    accent: "college admissions.",
    description:
      "Professionally administered SAT and ACT instruction from licensed, career educators, plus admissions advisement and essay support through the entire application process.",
    icon: "target",
    image: {
      src: "/images/tile-sat-prep.jpg",
      alt: "Resource Room SAT Test Prep — digital SAT ready.",
      kind: "tile",
    },
    items: [
      { kind: "program", slug: "sat-act-prep" },
      { kind: "program", slug: "college-prep" },
    ],
  },
  {
    slug: "camps",
    label: "Camps",
    eyebrow: "Camps",
    title: "Track-out, summer and",
    accent: "teacher-workday camps.",
    description:
      "Single days and full weeks for every Wake County track, plus the days when all four tracks are out at once. Hands-on science, LEGO robotics, coding and creative building for grades K–6.",
    icon: "sun",
    image: {
      src: "/images/program-camps.jpg",
      alt: "Campers stretching glow-in-the-dark slime during a hands-on STEAM camp activity.",
      kind: "photo",
    },
    /* Summer Bridge is intentionally listed here AND under tutoring. Joe's call
       notes put it under Camps; the live site lists it under Tutoring, where it
       is one of the six options he asked us to mirror. It is genuinely both — a
       summer program and a tutoring program — so it appears on both shelves
       until Joe says otherwise. */
    items: [
      { kind: "program", slug: "camps" },
      { kind: "program", slug: "summer-bridge" },
    ],
  },
  {
    slug: "specialized-support",
    label: "Specialized Support",
    eyebrow: "Specialized support",
    title: "Structured programs and",
    accent: "family advocacy.",
    description:
      "Our private high school for neurodiverse learners, the homeschool co-op, ABA support in an educational setting, and professional IEP and 504 advocacy.",
    icon: "compass",
    image: {
      src: "/images/program-pathways-academy.jpg",
      alt: "A high school student working through notes at a desk with headphones around their neck.",
      kind: "photo",
    },
    items: [
      { kind: "program", slug: "pathways-academy" },
      { kind: "program", slug: "homeschool-co-op" },
      { kind: "program", slug: "aba-services" },
      { kind: "program", slug: "iep-504-advocate" },
    ],
  },
];

export function getCategory(slug: string): ProgramCategory | undefined {
  return categories.find((category) => category.slug === slug);
}

/** One card's worth of data, whichever collection the item came from. */
export type ResolvedItem = {
  href: string;
  title: string;
  summary: string;
  category: string;
  icon: IconName;
  image: ProgramImage;
};

/**
 * Turns the slug list into renderable cards.
 *
 * Programs and courses are different shapes — a program has a `shortName`,
 * `summary` and its own artwork; a course has a `name`, a possibly-empty
 * `summary` and an optional image. Normalising here keeps the category page
 * from branching on `kind` in its markup, and drops any slug that no longer
 * resolves rather than rendering a dead card.
 */
export function resolveItems(category: ProgramCategory): ResolvedItem[] {
  return category.items.flatMap((item) => {
    if (item.kind === "program") {
      const program = getProgram(item.slug);
      if (!program) return [];
      return [
        {
          href: `/programs/${program.slug}`,
          title: program.name,
          summary: program.summary,
          category: program.category,
          icon: program.icon,
          image: program.image,
        },
      ];
    }

    const course = getCourse(item.slug);
    if (!course) return [];
    return [
      {
        href: `/courses/${course.slug}`,
        title: course.name,
        summary: course.summary,
        category: course.group,
        icon: category.icon,
        image: course.image
          ? { src: course.image, alt: course.imageAlt, kind: "tile" as const }
          : category.image,
      },
    ];
  });
}
