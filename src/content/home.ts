import type { IconName } from "@/components/icons";

/**
 * Background slideshow behind the hero, carried over from resourceroomnc.com.
 *
 * Purely decorative — the hero states its message in text, so these are hidden
 * from assistive tech and carry no alt copy. Timings below match the live site:
 * four seconds a slide with a half-second cross-fade and a slow zoom in.
 */
/*
 * Five slides, not ten.
 *
 * All ten used to download while a visitor sat on the homepage — 709KB of
 * imagery across 23 requests on desktop, 481KB on mobile, for a decorative
 * background nobody watches to the end. At four seconds a slide, five is
 * already twenty seconds of rotation. Halving the set halves the bytes.
 * Slides 06-10 remain in `public/images/hero/` if the rotation is ever
 * wanted back.
 */
export const heroSlides = [
  "/images/hero/hero-01.jpg",
  "/images/hero/hero-02.jpg",
  "/images/hero/hero-03.jpg",
  "/images/hero/hero-04.jpg",
  "/images/hero/hero-05.jpg",
];

export const heroSlideshow = {
  /** Time each slide holds, in ms. */
  slideDuration: 4000,
  /** Cross-fade length, in ms. */
  fadeDuration: 500,
  /** How far the Ken Burns effect zooms by the end of a slide. */
  zoomScale: 1.12,
};

export const hero = {
  /** Words wrapped in the accent color inside the headline. */
  headline: {
    before: "A Complete Learning Center for ",
    accent: "Every Student",
    after: ".",
  },
  subtext:
    "From early reading to AP Calculus, summer camps to a private high school, every Resource Room program is built around one student at the center: yours.",
  primaryCta: { label: "Schedule a Free Consultation", href: "/contact" },
};

export const whyChooseUs: {
  title: string;
  body: string;
  icon: IconName;
  /** The whole card links here — see WhyChoose. */
  href: string;
  image: { src: string; alt: string };
}[] = [
  {
    title: "Individualized",
    body: "A targeted approach for each student.",
    icon: "target",
    href: "/programs/tutoring/private-tutoring",
    image: {
      src: "/images/why-individualized.jpg",
      alt: "A tutor and student working through a problem together at a Resource Room table.",
    },
  },
  {
    title: "Engaging",
    body: "Curriculum based STEAM Programs.",
    icon: "sparkle",
    href: "/programs/camps",
    image: {
      src: "/images/why-engaging.jpg",
      alt: "Students building and programming a LEGO robotics project.",
    },
  },
  {
    title: "Professional",
    body: "Owned and Operated by licensed educators.",
    icon: "badge",
    href: "/about",
    image: {
      src: "/images/why-professional.jpg",
      alt: "The Resource Room learning center classroom space in Holly Springs.",
    },
  },
];

/**
 * Credential ticker under the hero. Every line is a claim made elsewhere on the
 * site — this strip restates them, it does not invent new ones.
 */
export const credentials = [
  "Licensed Career Educators",
  "100+ Five-Star Reviews",
  "Holly Springs Business of the Year 2022",
  "Raleigh's Best 2025 — Bronze",
  "Parrish “Ham” Womble Distinguished Service Award",
  "K-12 Through AP Math & Science",
  "95% Client Retention",
  /* Not "the Triangle since 2015": Resource Room was founded in 2015, but in
     Staten Island — Holly Springs opened in October 2021. Serving families is
     the claim that holds for the whole span. */
  "Serving Families Since 2015",
];

export const founders = {
  heading: "Owned and operated by licensed career educators.",
  image: {
    src: "/images/founders.jpg",
    alt: "Resource Room founders Joe and Sam with their son at the Holly Springs learning center.",
  },
  body: [
    "Joe and Sam, a husband and wife team, each have over a decade of classroom experience, are duly licensed, and hold multiple graduate degrees.",
  ],
  quote:
    "As career educators, we built Resource Room with one goal in mind: to provide a top-tier educational experience for students of all ages and to create high-quality, personalized programs that help students and families reach their goals.",
  attribution: "Joe & Sam, Resource Room Founders",
};

export const stats: { value: string; label: string; stars?: boolean }[] = [
  { value: "5 Star", label: "Average rating across 100+ reviews", stars: true },
  { value: "15+", label: "Years of professional experience" },
  { value: "95%", label: "Client retention" },
];

/**
 * The counter row further down the live home page. Figures are the animated
 * counter targets read out of the page markup, not estimates.
 */
export const counters: { value: number; suffix?: string; label: string; stars?: boolean }[] = [
  { value: 5, label: "Star Google reviews", stars: true },
  { value: 25, suffix: "+", label: "Total course offerings" },
  { value: 5000, suffix: "+", label: "Clients served" },
  { value: 15, suffix: "+ years", label: "Working alongside students" },
];

/**
 * The mid-page band between the founders and the stats on the live site.
 */
export const learningCenterPitch = {
  heading:
    "Educational experiences for emerging learners, early childhood, elementary, middle, and high school.",
  body: [
    "We strive to be a complete Learning Center for our community, our students, and our parents. We believe FIRMLY in the indispensable value of in-person education and socialization.",
    "We invite you to explore our courses, browse our site, and to just come by and say hello if you are in the area. You can always make a consultation request here.",
  ],
  cta: { label: "Explore Programs", href: "/programs" },
};

export const aboutHighlights: { title: string; body: string; icon: IconName }[] = [
  {
    title: "Curriculum Based Instruction",
    body: "Our STEAM programs are curriculum based and standards aligned.",
    icon: "book",
  },
  {
    title: "Tutoring for All Subjects",
    body: "Tutoring programs tailored to the individual needs of each student.",
    icon: "pencil",
  },
  {
    title: "College Advisement and Essays",
    body: "Professional support through the entire application process.",
    icon: "cap",
  },
];

export const aboutIntro =
  "With a wide offering of educational programs and support, Resource Room aims to provide services for learners of all ages.";

/**
 * The site-wide closing CTA. Wording follows the live program pages, which all
 * close on the same two beats: schedule a consultation, and consultations are
 * always free.
 */
export const finalCta = {
  heading: "Give your student the right kind of help.",
  body: "Schedule a consultation and we'll pinpoint exactly where your student needs support, then build a plan that delivers real progress. Consultations are always free.",
};

/**
 * The back-to-school band on the home page.
 *
 * Dated on purpose. A seasonal banner that has to be taken down by hand is a
 * banner that is still up in November — this site has already carried stale
 * camp weeks and stale ACT dates for exactly that reason. `from` and `until`
 * are inclusive UTC dates; outside them the section renders nothing at all,
 * and the hourly revalidate means it retires within an hour of `until`.
 *
 * The two headlines exist because the message changes the moment term starts:
 * before the 24th the pitch is "get ahead of it", after it is "the first weeks
 * are when problems show up". One build covers both.
 */
export const backToSchool = {
  from: "2026-08-10",
  /* Roughly six weeks in — long enough to catch families who only notice a
     problem after the first progress reports. */
  until: "2026-10-05",
  /** Wake County traditional calendar. Drives which headline is shown. */
  termStarts: "2026-08-24",
  eyebrow: "Back to school",
  before: {
    heading: "Term starts August 24.",
    accent: "Start it with a plan.",
    body: "Wake County traditional students are back in class on Monday the 24th. The families who get support in place now are the ones not scrambling in October — and our fall tutoring slots fill in the first two weeks of term.",
  },
  after: {
    heading: "The first weeks back",
    accent: "tell you a lot.",
    body: "Homework taking twice as long as it should? Organisation slipping already? The first month is when the gaps show, and it is far easier to close them now than after a term of falling behind.",
  },
  primary: { label: "Book a free consultation", href: "/contact" },
  returning: {
    label: "Returning family — get your slot",
    href: "/contact?returning=1",
    note: "Already worked with us? Skip the consultation and tell us the days you need.",
  },
  /* Reframes the programs rail underneath, so the cards read as the answer to
     the band above rather than as a generic list. Retires on the same dates. */
  rail: {
    eyebrow: "For the new school year",
    title: "What families are booking for",
    accent: "the fall.",
    description:
      "Term is starting. These are the programs Triangle families put in place first — from one-to-one tutoring to a full daytime alternative.",
  },
};

/** Midnight UTC for a plain YYYY-MM-DD, so the window never depends on where
    the server happens to be running. */
function day(date: string) {
  return Date.parse(`${date}T00:00:00Z`);
}

/** The last instant of a plain YYYY-MM-DD. `until` is inclusive, so comparing
    against midnight would have cut the band at the start of its final day. */
function endOfDay(date: string) {
  return day(date) + 24 * 60 * 60 * 1000 - 1;
}

/**
 * Whether the home page is inside the back-to-school window.
 *
 * Shared by the band and the programs rail so the two can never disagree —
 * a seasonal heading sitting above a rail whose banner has already retired
 * would read as a mistake.
 */
export function inBackToSchoolSeason(now = Date.now()) {
  return now >= day(backToSchool.from) && now <= endOfDay(backToSchool.until);
}

/** True once term has started, which is what swaps the band's headline. */
export function isTermStarted(now = Date.now()) {
  return now >= day(backToSchool.termStarts);
}
