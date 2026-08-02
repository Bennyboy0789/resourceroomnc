/**
 * Every section heading on the site, in one place.
 *
 * Headings were previously inlined in the components. They live here so the
 * copy Joe edits is all under `src/content`, and so the page outline is
 * reviewable as text rather than by reading nine components.
 *
 * Why the shape matters for search and for AI answers: each `title` + `accent`
 * pair renders as one `<h2>`, and the words carry the query a family would
 * actually type. Generic headings ("Three things that don't change") describe
 * the layout; specific ones ("Why choose the Resource Room approach?") describe
 * the content, which is what both a crawler and an answer engine index.
 */

export type SectionCopy = {
  eyebrow?: string;
  /** Rendered as the h2. `accent` is appended in the accent colour. */
  title: string;
  accent?: string;
  description?: string;
};

export const homeSections = {
  quickLinks: { title: "Explore Our Programs" },

  popularPrograms: {
    eyebrow: "Most requested",
    title: "What families are booking",
    accent: "now.",
    description:
      "From daytime structured learning to test prep, these are the programs Triangle families come to us for.",
  },

  whyChoose: {
    eyebrow: "Why families choose us",
    title: "Why choose the Resource Room",
    accent: "approach?",
  },

  aboutStrip: {
    eyebrow: "Who we are",
    title: "About Resource",
    accent: "Room.",
  },

  programGrid: {
    eyebrow: "Every program",
    title: "A program for every",
    accent: "student.",
    description:
      "Students often start in one program and move into another as their needs change.",
  },

  testimonials: {
    eyebrow: "From our families",
    title: "What students & parents say",
    accent: "about us.",
  },

  blogTeaser: {
    eyebrow: "From the blog",
    title: "Guidance from the educators who run the",
    accent: "programs.",
  },
} satisfies Record<string, SectionCopy>;

export const pageHeroes = {
  about: {
    eyebrow: "Learn about Resource Room Learning Center",
    title: "Educational support for",
    accent: "learners of all ages.",
    description:
      "Resource Room Learning Center educators take pride in delivering an exceptional educational experience. From the student who just needs to get ahead to those who want to push themselves to achieve their highest potential, we provide the necessary support to help them reach their goals.",
  },

  preferredPartners: {
    eyebrow: "Preferred partners",
    title: "Educational support",
    accent: "providers.",
  },

  programs: {
    eyebrow: "All programs",
    title: "A diverse course offering for learners of",
    accent: "all ages.",
    description:
      "We provide support, instruction and programs for students from Pre-Kindergarten all the way through High School.",
  },

  courses: {
    eyebrow: "Course catalog",
    title: "Every course we",
    accent: "run.",
    description:
      "The individual classes inside our programs — STEAM and robotics, drones, 3D design, LEGO, coding, emerging-learner classes and workshops.",
  },

  contact: {
    eyebrow: "Contact us",
    title: "Let us know how we can",
    accent: "help.",
    description:
      "Fill out the form and we'll respond within one business day, usually with a call. Miss our call? We'll email to find a time that works. Every message reaches a real person on our team.",
  },

  joinOurTeam: {
    eyebrow: "Careers",
    title: "Join our",
    accent: "team.",
    description: "Please submit the form, and email your resume for consideration.",
  },

  blog: {
    eyebrow: "Blog",
    title: "Notes from the",
    accent: "learning center.",
    description:
      "Guidance from the educators who run the programs — on testing, admissions, neurodiverse learning, and what actually helps students in the Triangle.",
  },
} satisfies Record<string, SectionCopy>;
