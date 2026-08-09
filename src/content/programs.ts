import type { IconName } from "@/components/icons";

/**
 * Program content, transcribed from resourceroomnc.com.
 *
 * The live copy was rewritten in 2026 — see `docs/live-content/` for the
 * snapshot every string here came from. Prices are editorial: they state the
 * published rate so a family can plan. The enrollment form underneath resolves
 * the amount it actually charges from Stripe, so a figure that drifts here
 * misinforms but can never mischarge.
 */

/**
 * Imagery pulled from resourceroomnc.com, matched to the program each asset is
 * used for on the live site.
 *
 * `kind` drives how the asset is cropped. "tile" assets are the square product
 * tiles with the program name set into the artwork, so they render 1:1 where
 * there is room and crop from the top edge where there is not. "photo" assets
 * are ordinary photographs and crop from the center.
 */
export type ProgramImage = {
  src: string;
  alt: string;
  kind: "photo" | "tile";
};

/** Natural aspect ratio for an asset given room to breathe. */
export function imageRatio(image: ProgramImage): string {
  return image.kind === "tile" ? "1/1" : "4/3";
}

/** Crop anchor when an asset has to fit a slot wider than its natural ratio. */
export function imagePosition(image: ProgramImage): "top" | "center" {
  return image.kind === "tile" ? "top" : "center";
}

/** Three-up proof row directly under the program hero. */
export type ProgramStat = {
  value: string;
  label: string;
  /** Renders the five-star row in place of the value. */
  stars?: boolean;
};

export type PricingTier = {
  name: string;
  /** Pre-formatted, because these are quoted rates rather than computed ones. */
  price: string;
  /** Sits next to the price: "per semester", "/ week". */
  cadence?: string;
  /** Ribbon above the card. */
  badge?: string;
  /** One line under the price. */
  meta?: string;
  features: string[];
  /** Fine print below the features. */
  note?: string;
  /** Pulls the card forward as the recommended option. */
  featured?: boolean;
  /** Struck-through former price, where the live site shows a sale. */
  wasPrice?: string;
  /**
   * Where this tier's button goes. Defaults to booking a consultation, which
   * is right for the packages that genuinely start with a conversation. Tiers
   * that are actually buyable point at their product page's buy box instead —
   * a published rate with a "book a consultation" button under it reads as if
   * you cannot simply purchase it.
   */
  cta?: { label: string; href: string };
};

export type ScheduleRow = { label: string; value: string; note?: string };

export type ScheduleGroup = {
  title: string;
  subtitle?: string;
  rows: ScheduleRow[];
  note?: string;
  /**
   * Which filter chip this group belongs to. Set on the camps calendar so a
   * family can jump straight to their own track — unfiltered, the calendar is
   * sixteen windows and roughly thirteen thousand pixels of scrolling on a
   * phone.
   */
  filter?: string;
};

type BlockHeading = {
  eyebrow?: string;
  title: string;
  /** Appended to the title in the accent color. */
  accent?: string;
  description?: string;
};

/**
 * The live program pages are long-form landing pages with a different anatomy
 * each. Rather than model nine bespoke page shapes, every page is a sequence of
 * these blocks — the page renderer walks the list and alternates section tones.
 */
export type ProgramBlock =
  | (BlockHeading & {
      kind: "prose";
      body: string[];
      /** Sets the copy beside a photograph instead of in a single column. */
      image?: ProgramImage;
      /** Drops the reading-measure cap and runs the copy in two columns. */
      wide?: boolean;
    })
  | (BlockHeading & {
      kind: "cards";
      cards: { title: string; body: string; icon?: IconName }[];
      /** Two columns instead of three, for longer card bodies. */
      wide?: boolean;
    })
  /*
   * Cards that are themselves links, for cross-selling the rest of the centre.
   *
   * A `cards` block says a program exists; this one lets a family reach it. The
   * card title is the anchor text, so these read as descriptive internal links
   * rather than the "click here" pills the WordPress pages used — which is what
   * makes them worth anything to a crawler.
   */
  | (BlockHeading & {
      kind: "links";
      links: { title: string; body: string; href: string; icon?: IconName; external?: boolean }[];
      /** Two columns instead of three, for longer card bodies. */
      wide?: boolean;
    })
  | (BlockHeading & {
      kind: "steps";
      steps: { title: string; body: string; note?: string }[];
    })
  | (BlockHeading & { kind: "pricing"; tiers: PricingTier[]; note?: string })
  | (BlockHeading & {
      kind: "person";
      name: string;
      credentials: string;
      body: string[];
      bullets?: string[];
      /** Pull quote closing the block. */
      summary?: string;
      /** Portrait. Falls back to an initial-style panel when absent. */
      image?: ProgramImage;
    })
  | (BlockHeading & {
      kind: "schedule";
      groups: ScheduleGroup[];
      note?: string;
      /** Renders filter chips over the groups, matched on `ScheduleGroup.filter`. */
      filters?: { label: string; allLabel?: string };
    })
  | (BlockHeading & { kind: "checklist"; items: string[] })
  | (BlockHeading & {
      kind: "dates";
      items: { date: string; note: string }[];
      note?: string;
    })
  | (BlockHeading & { kind: "faq"; items: { q: string; a: string }[] });

export type Program = {
  slug: string;
  /** Full name, used as the page H1. */
  name: string;
  /** Short label for cards, nav and pills. */
  shortName: string;
  category: string;
  /** One line shown under the name on cards and program hero. */
  tagline: string;
  /** Card body copy. Keep to two sentences. */
  summary: string;
  /** Opening paragraph on the program page. */
  intro: string;
  icon: IconName;
  accent: "sun" | "blue";
  /** The program's image on the live site. */
  image: ProgramImage;
  /** Proof row under the hero. */
  stats?: ProgramStat[];
  /** Shown as the feature list on the program page. */
  highlights: { title: string; body: string }[];
  /**
   * Heading over the product grid, when the shared "What runs inside this
   * program." does not fit. `accent` is the emphasised trailing phrase.
   */
  productsHeading?: { title: string; accent: string };
  /** "What's included" checklist. */
  includes: string[];
  /** Heading over the includes checklist, overriding "What the program includes." */
  includesHeading?: { title: string; accent: string };
  /** "Who it's for" list. */
  audience: string[];
  /** Long-form sections below the fold. */
  blocks?: ProgramBlock[];
  /** Legal or policy fine print, set below everything else. */
  disclaimer?: string;
  /** Programs featured in the "Popular Programs" grid on the home page. */
  popular?: boolean;
  /** Programs featured in the 2x2 grid and the quick-link pill row. */
  featured?: boolean;
  /**
   * Sibling programs shown in this page's product grid, alongside its catalog
   * courses — the live category tabs mix the two. Self-references are ignored.
   */
  alsoListed?: string[];
  /** Set when the program lives on its own site. */
  externalUrl?: string;
};

export const programs: Program[] = [
  {
    slug: "tutoring",
    name: "Private Tutoring for All Subjects",
    shortName: "Tutoring",
    category: "Tutoring Programs",
    tagline: "Educator-led. Personally matched. The right tutor for every student.",
    summary:
      "Private, individualized tutoring for every subject, K-12, including AP coursework. Every student is matched to a tutor by subject, teaching style and personality.",
    intro:
      "Today's students need not only content knowledge but also connection. A student who likes their tutor will always learn more than one who doesn't. That is why we match every student with a tutor who fits: the right experience level, the right teaching style, and the right personality. When that connection clicks, students stop dreading extra help and start actually engaging.",
    icon: "pencil",
    accent: "blue",
    image: {
      src: "/images/program-tutoring.jpg",
      alt: "A Resource Room tutor working one-to-one with a student on geometry at a table.",
      kind: "photo",
    },
    featured: true,
    stats: [
      { value: "100+", label: "Five-star reviews", stars: true },
      { value: "2022", label: "Holly Springs Business of the Year" },
      { value: "Since 2015", label: "Trusted by local families" },
    ],
    highlights: [
      {
        title: "Educator-led, carefully matched",
        body: "Resource Room is founded and run by career educators who oversee every student's progress. Our tutoring team is experienced, high-achieving, and carefully selected, then matched to each student based on subject expertise, teaching style, and personality.",
      },
      {
        title: "Truly personalized instruction",
        body: "Every student learns differently. We do not use a scripted, one-size-fits-all program. Each tutoring plan is built around your child's specific strengths, gaps, pace, and goals.",
      },
      {
        title: "In-person learning that builds connection",
        body: "Face-to-face tutoring means stronger engagement, immediate feedback, and a real relationship between student and teacher — the connection that keeps students motivated and confident.",
      },
      {
        title: "One place for every subject, every grade",
        body: "From kindergarten through twelfth grade, across every core subject, Resource Room is a single trusted home for academic support, even as your child's needs change over the years.",
      },
    ],
    productsHeading: {
      title: "Choose the right Private Tutoring Program",
      accent: "for your student.",
    },
    includes: [
      "A free consultation to identify goals and gaps",
      "A tutor matched on subject expertise, teaching style and personality",
      "A personalized instruction plan reviewed as the student progresses",
      "One-to-one sessions with an experienced educator",
      "Homework, test and project support alongside skill building",
      "Ongoing communication with families about progress",
    ],
    includesHeading: { title: "The Resource Room", accent: "approach." },
    audience: [
      "Students who have fallen behind and need to catch up",
      "High-achieving students who want to get ahead or master advanced material",
      "Students who need stronger study habits and academic routines",
      "Students preparing for quizzes, tests, and major assignments",
      "Students who simply learn better with a more personalized approach",
      "Neurodiverse learners who benefit from educators trained to support how they learn",
    ],
    blocks: [
      {
        kind: "cards",
        eyebrow: "By grade level",
        title: "Tutoring for every",
        accent: "grade level.",
        cards: [
          {
            title: "Elementary (K–5)",
            body: "Strong foundational skills in reading, writing, and math: phonics, fluency, comprehension, number sense, math facts, problem-solving, and written expression. The right foundation makes everything that follows easier.",
            icon: "book",
          },
          {
            title: "Middle School (6–8)",
            body: "As expectations grow more complex, we support math, ELA, science, and social studies while reinforcing the organization, study skills, and critical thinking middle schoolers need to thrive.",
            icon: "chart",
          },
          {
            title: "High School (9–12)",
            body: "Subject-specific support for demanding coursework. We help students deepen understanding, prepare for exams, and strengthen the performance that shapes their transcript and their future.",
            icon: "cap",
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "Subjects",
        title: "High school subject",
        accent: "expertise.",
        cards: [
          {
            title: "Math",
            body: "Foundational math through Algebra, Geometry, Algebra II, and advanced coursework including AP Calculus AB & BC.",
            icon: "target",
          },
          {
            title: "Science",
            body: "Biology, chemistry, and physics, including advanced and AP-level coursework when available.",
            icon: "sparkle",
          },
          {
            title: "History",
            body: "American History, World History, and advanced courses such as AP World History.",
            icon: "compass",
          },
          {
            title: "English",
            body: "Reading comprehension, literary analysis, vocabulary, grammar, essay writing, and communication across all grade levels.",
            icon: "pencil",
          },
        ],
      },
      {
        kind: "prose",
        eyebrow: "More than a tutoring center",
        title: "One roof, every kind of",
        accent: "support.",
        /* Runs the full container width in two columns rather than sitting in
           a narrow single column — the copy was floating in a lot of space. */
        wide: true,
        body: [
          "Because Resource Room is a full-service learning center, families can access far more than subject tutoring in one trusted place: SAT and ACT prep, STEM camps, our homeschool co-op, executive functioning coaching, ABA support, and Pathways Academy.",
          "As your child's needs change from one year to the next, the people supporting them do not have to.",
        ],
      },
    ],
  },
  {
    slug: "camps",
    name: "Track-Out, Summer & Teacher-Workday Camps",
    shortName: "Camps",
    category: "STEAM Programs",
    tagline: "Your track is out. We're open.",
    summary:
      "Full weeks and single days for grades K-6, on every Wake County track. Hands-on science, LEGO robotics, coding, nature and creative building.",
    intro:
      "Track-out camp at Resource Room Learning Center. Hands-on projects, small groups, and a day with real structure to it — all the best parts of a school day and none of the rest. This is not daycare with crafts. Every camp day is built with intention: hands-on science, creative challenges, outdoor exploration, coding, and movement, all wrapped in the kind of routine that helps kids thrive.",
    icon: "sun",
    accent: "sun",
    image: {
      src: "/images/program-camps.jpg",
      alt: "Campers stretching glow-in-the-dark slime during a hands-on STEAM camp activity.",
      kind: "photo",
    },
    featured: true,
    popular: true,
    stats: [
      { value: "K–6", label: "All learners welcome" },
      { value: "8:00–3:30", label: "Monday through Friday" },
      { value: "$329", label: "Full week" },
    ],
    highlights: [
      {
        title: "Led by educators, not teenagers",
        body: "Our camp team are experienced educators who understand kids, know how to manage a room, and pitch a project so every camper has something real to do.",
      },
      {
        title: "Structure kids can count on",
        body: "A posted schedule, clear expectations, and a rhythm that repeats every day. Kids settle in fast when they already know what comes next.",
      },
      {
        title: "Hands on, every single day",
        body: "Build it, test it, take it apart, try again. Robotics, engineering challenges, and science experiments that end the week with something to carry home.",
      },
      {
        title: "Enough variety to stay interesting",
        body: "Academics, STEM, art, games, and outside time all in the same day. Long enough to get into something, short enough that nobody checks out.",
      },
      {
        title: "Known in Holly Springs",
        body: "2022 Holly Springs Business of the Year and 2025 Raleigh's Best Bronze in Education. Founded in 2015 by two career educators, Sam and Joe, and family run ever since.",
      },
    ],
    includes: [
      "Hands-on science: slime, volcanoes, elephant toothpaste, oobleck",
      "Building and engineering: LEGO challenges, robotics, design thinking",
      "Coding games and digital challenges that build logic and sequencing",
      "Nature walks, outdoor games and fresh air built into every day",
      "Crafts and creative projects campers take home",
      "Open on most district holidays, including Veterans Day, MLK Day and Election Day",
    ],
    audience: [
      "Year-round school families needing track-out coverage",
      "Families looking for summer programming with academic value",
      "Homeschool families who want a structured week",
      "Parents who need reliable teacher-workday care",
      "The kid who would rather build something than sit in a gym",
    ],
    blocks: [
      {
        kind: "pricing",
        eyebrow: "Rates",
        title: "What camp",
        accent: "costs.",
        description:
          "Spots are limited by design. Track-out weeks and the bonus day camps fill first, so book the dates you know you need.",
        tiers: [
          {
            name: "Full Week",
            price: "$329",
            cta: { label: "Book a camp week", href: "/programs/camps/summer-camp#buy" },
            cadence: "per week",
            badge: "Most booked",
            meta: "Monday to Friday, 8:00 a.m. to 3:30 p.m.",
            featured: true,
            features: [
              "Five full camp days",
              "All materials and project supplies included",
              "Hands-on science, engineering, coding and outdoor time daily",
              "Small groups led by experienced educators",
            ],
          },
          {
            name: "Single Day",
            price: "Available",
            cta: { label: "Book a single day", href: "/programs/camps/track-out-teacher-workday#buy" },
            meta: "Teacher workdays, district holidays and break weeks",
            features: [
              "Full camp day, same schedule as a camp week",
              "Ideal for teacher workdays and one-off closures",
              "Choose Single Day at checkout, then list your dates in the order notes",
            ],
          },
          {
            name: "Late Pickup",
            price: "$55",
            cta: { label: "Add late pickup", href: "/programs/camps/summer-camp#buy" },
            cadence: "per week",
            meta: "Add-on — extends the day to 4:30 p.m.",
            features: [
              "Supervised extended day until 4:30 p.m.",
              "Available by the day or by the week",
              "Sibling discounts available — contact us for details",
            ],
          },
        ],
        note: "Booking is simple: choose Single Day or Full Week at checkout, then enter the exact dates you need in the order notes and we will confirm by email.",
      },
      {
        kind: "schedule",
        eyebrow: "A day at camp",
        title: "A school day made of only the",
        accent: "good parts.",
        description:
          "Same rhythm every day, posted on the wall where kids can see it. Enough structure that nobody is guessing what comes next, enough variety that nobody gets bored.",
        groups: [
          {
            title: "The daily schedule",
            rows: [
              {
                label: "8:00 – 8:30",
                value: "Arrival and soft start",
                note: "Quiet tables, puzzles, drawing, and a chance to settle in before the day gets going.",
              },
              {
                label: "8:30 – 10:00",
                value: "Hands-on science",
                note: "Slime, volcanoes, elephant toothpaste, oobleck, and experiments that spark real curiosity.",
              },
              {
                label: "10:00 – 11:30",
                value: "Building and engineering",
                note: "LEGO challenges, robotics, design thinking, and problem solving that takes a whole team to crack.",
              },
              {
                label: "11:30 – 1:00",
                value: "Lunch and outdoor time",
                note: "Bagged lunch, then nature walks, outdoor games, and fresh air before the afternoon.",
              },
              {
                label: "1:00 – 2:30",
                value: "Coding and digital challenges",
                note: "Interactive coding games and puzzles that build logic and sequencing without feeling like a lesson.",
              },
              {
                label: "2:30 – 3:30",
                value: "Crafts, creativity, and wrap up",
                note: "Projects that let kids create and build their own ideas. Clean up, share the day, and get ready for pickup.",
              },
            ],
          },
        ],
      },
      {
        kind: "schedule",
        eyebrow: "2026–27 track-out calendar",
        title: "Find your track's",
        accent: "weeks.",
        description:
          "Pick your child's track to see only your track-out windows, week by week. Dates follow the Wake County Public School System 2026-27 multi-track year-round calendar, and district closure days are already marked so you know exactly which days we run.",
        filters: { label: "Track", allLabel: "All tracks" },
        groups: [
          {
            title: "Track 4 · Window 1 of 4",
            filter: "Track 4",
            subtitle: "July 7 to July 29, 2026",
            rows: [
              { label: "Jul 7 – Jul 10", value: "4 days" },
              { label: "Jul 13 – Jul 17", value: "5 days" },
              { label: "Jul 20 – Jul 24", value: "5 days" },
              { label: "Jul 27 – Jul 29", value: "3 days" },
            ],
          },
          {
            title: "Track 3 · Window 1 of 4",
            filter: "Track 3",
            subtitle: "July 30 to August 20, 2026",
            rows: [
              { label: "Jul 30 – Jul 31", value: "2 days" },
              { label: "Aug 3 – Aug 7", value: "5 days" },
              { label: "Aug 10 – Aug 14", value: "5 days" },
              { label: "Aug 17 – Aug 20", value: "4 days" },
            ],
          },
          {
            title: "Track 2 · Window 1 of 4",
            filter: "Track 2",
            subtitle: "August 24 to September 11, 2026",
            rows: [
              { label: "Aug 24 – Aug 28", value: "5 days" },
              { label: "Aug 31 – Sep 4", value: "5 days" },
              { label: "Sep 8 – Sep 11", value: "4 days" },
            ],
            note: "Closed Sep 7, Labor Day",
          },
          {
            title: "Track 1 · Window 1 of 4",
            filter: "Track 1",
            subtitle: "September 14 to October 6, 2026",
            rows: [
              { label: "Sep 14 – Sep 18", value: "5 days" },
              { label: "Sep 21 – Sep 25", value: "5 days" },
              { label: "Sep 28 – Oct 2", value: "5 days" },
              { label: "Oct 5 – Oct 6", value: "2 days" },
            ],
          },
          {
            title: "Track 4 · Window 2 of 4",
            filter: "Track 4",
            subtitle: "October 7 to October 23, 2026",
            rows: [
              { label: "Oct 7 – Oct 9", value: "3 days" },
              { label: "Oct 12 – Oct 16", value: "5 days" },
              { label: "Oct 19 – Oct 23", value: "5 days" },
            ],
          },
          {
            title: "Track 3 · Window 2 of 4",
            filter: "Track 3",
            subtitle: "October 26 to November 13, 2026",
            rows: [
              { label: "Oct 26 – Oct 30", value: "5 days" },
              { label: "Nov 2 – Nov 6", value: "5 days" },
              { label: "Nov 9 – Nov 13", value: "5 days" },
            ],
            note: "Open Veterans Day",
          },
          {
            title: "Track 2 · Window 2 of 4",
            filter: "Track 2",
            subtitle: "November 16 to December 4, 2026",
            rows: [
              { label: "Nov 16 – Nov 20", value: "5 days" },
              { label: "Nov 23 – Nov 25", value: "3 days" },
              { label: "Nov 30 – Dec 4", value: "5 days" },
            ],
            note: "Closed Nov 26 and 27, Thanksgiving",
          },
          {
            title: "Track 1 · Window 2 of 4",
            filter: "Track 1",
            subtitle: "December 7 to December 18, 2026",
            rows: [
              { label: "Dec 7 – Dec 11", value: "5 days" },
              { label: "Dec 14 – Dec 18", value: "5 days" },
            ],
          },
          {
            title: "Track 4 · Window 3 of 4",
            filter: "Track 4",
            subtitle: "January 4 to January 22, 2027",
            rows: [
              { label: "Jan 4 – Jan 8", value: "5 days" },
              { label: "Jan 11 – Jan 15", value: "5 days" },
              { label: "Jan 18 – Jan 22", value: "5 days" },
            ],
            note: "Open MLK Day",
          },
          {
            title: "Track 3 · Window 3 of 4",
            filter: "Track 3",
            subtitle: "January 25 to February 12, 2027",
            rows: [
              { label: "Jan 25 – Jan 29", value: "5 days" },
              { label: "Feb 1 – Feb 5", value: "5 days" },
              { label: "Feb 8 – Feb 12", value: "5 days" },
            ],
          },
          {
            title: "Track 2 · Window 3 of 4",
            filter: "Track 2",
            subtitle: "February 15 to March 5, 2027",
            rows: [
              { label: "Feb 15 – Feb 19", value: "5 days" },
              { label: "Feb 22 – Feb 26", value: "5 days" },
              { label: "Mar 1 – Mar 5", value: "5 days" },
            ],
            note: "Open Presidents' Day",
          },
          {
            title: "Track 1 · Window 3 of 4",
            filter: "Track 1",
            subtitle: "March 8 to March 26, 2027",
            rows: [
              { label: "Mar 8 – Mar 12", value: "5 days" },
              { label: "Mar 15 – Mar 19", value: "5 days" },
              { label: "Mar 22 – Mar 26", value: "5 days" },
            ],
            note: "Open Mar 26 district holiday",
          },
          {
            title: "Track 4 · Window 4 of 4",
            filter: "Track 4",
            subtitle: "March 29 to April 16, 2027",
            rows: [
              { label: "Mar 29 – Apr 2", value: "5 days" },
              { label: "Apr 5 – Apr 9", value: "5 days" },
              { label: "Apr 12 – Apr 16", value: "5 days" },
            ],
          },
          {
            title: "Track 3 · Window 4 of 4",
            filter: "Track 3",
            subtitle: "April 19 to May 7, 2027",
            rows: [
              { label: "Apr 19 – Apr 23", value: "5 days" },
              { label: "Apr 26 – Apr 30", value: "5 days" },
              { label: "May 3 – May 7", value: "5 days" },
            ],
          },
          {
            title: "Track 2 · Window 4 of 4",
            filter: "Track 2",
            subtitle: "May 10 to June 3, 2027",
            rows: [
              { label: "May 10 – May 14", value: "5 days" },
              { label: "May 17 – May 21", value: "5 days" },
              { label: "May 24 – May 28", value: "5 days" },
              { label: "Jun 1 – Jun 3", value: "3 days" },
            ],
            note: "Closed May 31, Memorial Day",
          },
          {
            title: "Track 1 · Window 4 of 4",
            filter: "Track 1",
            subtitle: "June 4 to June 30, 2027",
            rows: [
              { label: "Jun 4", value: "1 day" },
              { label: "Jun 7 – Jun 11", value: "5 days" },
              { label: "Jun 14 – Jun 18", value: "5 days" },
              { label: "Jun 21 – Jun 25", value: "5 days" },
              { label: "Jun 28 – Jun 30", value: "3 days" },
            ],
            note: "Rolls into Summer Camp",
          },
        ],
        note: "If the district adjusts the calendar for weather makeup days, we will update this page and email registered families.",
      },
      {
        kind: "dates",
        eyebrow: "Bonus camp days",
        title: "When Wake County closes, we",
        accent: "open.",
        description:
          "Teacher workdays, district holidays, and break weeks put all four tracks home on the same day, and most camps go dark right along with the schools. We don't. Twelve bonus camp days across the year, and they fill faster than anything else we run.",
        items: [
          {
            date: "Friday, August 21, 2026",
            note: "Teacher workday across the year-round calendar. Full camp day.",
          },
          {
            date: "Tuesday, November 3, 2026",
            note: "Teacher workday and Election Day. Kids build and create while you vote.",
          },
          {
            date: "Wednesday, November 11, 2026",
            note: "Veterans Day. Schools are closed, camp is open all day.",
          },
          {
            date: "Wednesday, November 25, 2026",
            note: "Thanksgiving week coverage. Closed Thanksgiving Day and the Friday after.",
          },
          {
            date: "Dec 21 – 23 and Dec 28 – 30, 2026",
            note: "Winter break camp, six full days. Closed Dec 24, Dec 25, Dec 31, and Jan 1.",
          },
          {
            date: "Monday, January 18, 2027",
            note: "Martin Luther King Jr. Day. Schools are closed, camp is open all day.",
          },
          {
            date: "Friday, March 26, 2027",
            note: "District holiday before spring sessions resume. Full camp day.",
          },
        ],
        note: "Choose Single Day at checkout and list the dates you want in the order notes.",
      },
      {
        kind: "schedule",
        eyebrow: "The details",
        title: "Everything you need to",
        accent: "know.",
        groups: [
          {
            title: "Camp logistics",
            rows: [
              { label: "Grades", value: "K through 6" },
              { label: "Camp hours", value: "8:00 a.m. to 3:30 p.m., Monday to Friday" },
              { label: "Late pickup", value: "Until 4:30 p.m., $55 per week" },
              { label: "Full week", value: "$329" },
              { label: "Single days", value: "Available, see options at checkout" },
              { label: "Sibling discount", value: "Available, contact us for details" },
              {
                label: "Open on",
                value: "Veterans Day, MLK Day, Presidents' Day, Election Day, Juneteenth",
              },
              {
                label: "Closed on",
                value:
                  "Labor Day, Thanksgiving Day and the Friday after, Dec 24–25, Dec 31, Jan 1, Memorial Day",
              },
              {
                label: "Bring each day",
                value: "Bagged lunch, snacks, water bottle. No nut products, please",
              },
              { label: "Location", value: "2100 Crossway Ln, Holly Springs, NC 27540" },
            ],
            note: "Refrigeration is available on site.",
          },
        ],
      },
    ],
    disclaimer:
      "Camp rescheduling policy: rescheduling a camp week is subject to a 30 percent fee. If rescheduling within 2 weeks of the camp start date, there is no refund. Camp materials and supplies are purchased specifically for each camp week and camper.",
  },
  {
    slug: "sat-act-prep",
    name: "SAT & ACT Test Prep",
    shortName: "SAT / ACT Prep",
    category: "Test Prep Programs",
    tagline: "Private test prep built around your student, not a one-size-fits-all program",
    summary:
      "Diagnostic-driven SAT and ACT preparation from licensed educators. Most students gain 200 to 300 points from their baseline.",
    intro:
      "For over a decade we have helped thousands of students raise their scores through personalized instruction, expert diagnostics, and a proven approach. SAT and ACT prep with us is not about handing students practice questions. It is about understanding how the test works, finding where points are slipping away, and building an efficient plan to fix it.",
    icon: "target",
    accent: "sun",
    image: {
      src: "/images/tile-sat-prep.jpg",
      alt: "Resource Room SAT Test Prep — digital SAT ready.",
      kind: "tile",
    },
    popular: true,
    featured: true,
    stats: [
      { value: "5-Star", label: "Google reviews", stars: true },
      { value: "200–300", label: "Point gains from baseline" },
      { value: "10+ yrs", label: "SAT and ACT prep experience" },
    ],
    highlights: [
      {
        title: "Proven results",
        body: "Thousands of students taught over more than a decade. Most see gains of 200 to 300 points from their baseline, with students who start lower often climbing closer to 300.",
      },
      {
        title: "Real teachers",
        body: "Instruction comes from licensed teachers and experienced test-prep educators, not scripts. High-energy and fully individualized.",
      },
      {
        title: "Diagnostic-driven",
        body: "We start with full-length proctored diagnostics to establish a baseline and target tutoring time where it matters most.",
      },
      {
        title: "Strategy and stamina",
        body: "Beyond content, we train timing, pacing, test-day stamina, and confidence so students perform under pressure.",
      },
    ],
    includes: [
      "Full-length proctored diagnostic exams to establish a baseline",
      "One consistent tutor for the length of the program",
      "All SAT or ACT materials included",
      "Online student portal with lessons, homework, quizzes and review",
      "Section-level pacing and test-day strategy",
      "Guidance on test dates and how many times to sit the exam",
    ],
    audience: [
      "Students preparing for an upcoming SAT or ACT date",
      "Students deciding between the SAT and the ACT",
      "Students with uneven skills across sections",
      "Students below grade level in math or reading and writing",
      "Students who deal with test anxiety or struggle with pacing",
      "Students aiming to improve scores for admissions or scholarships",
    ],
    blocks: [
      {
        kind: "pricing",
        eyebrow: "Programs",
        title: "Choose your prep",
        accent: "path.",
        description:
          "Private tutoring is available year-round and you can start anytime. Our group class runs once a year for the March SAT.",
        tiers: [
          {
            name: "20-Hour Private SAT Tutoring",
            price: "$2,099",
            cta: { label: "Buy this package", href: "/programs/sat-act-prep/sat-prep#buy" },
            badge: "Most popular · Year-round",
            meta: "One-to-one · In-person or virtual · Start anytime",
            featured: true,
            features: [
              "20 hours of private one-to-one tutoring",
              "3 full-length proctored diagnostic tests",
              "All SAT materials included",
              "Online student portal access",
              "Flexible scheduling by appointment",
            ],
          },
          {
            name: "SAT Group Class",
            price: "$1,749",
            badge: "March exam only",
            meta: "16 sessions · 24 hours live instruction",
            features: [
              "24 hours of live classroom instruction",
              "3 proctored diagnostic exams",
              "All class materials and homework included",
              "Online portal access",
            ],
            note: "Offered once a year for the March SAT. Next cycle begins January 2027.",
          },
          {
            name: "Group + Private Add-On",
            price: "$2,399",
            badge: "Best of both formats",
            meta: "Tied to the March SAT group cycle",
            features: [
              "24 hours of group instruction",
              "Plus 8 hours of private tutoring",
              "3 proctored diagnostic exams",
              "All materials included",
              "Online portal access",
            ],
          },
          {
            name: "ACT Test Prep",
            price: "$2,399",
            cta: { label: "Buy this package", href: "/programs/sat-act-prep/act-prep#buy" },
            meta: "24 hours · In-person or virtual",
            features: [
              "24 hours of educator-led ACT instruction",
              "Proctored diagnostic assessments",
              "Homework and practice assignments included",
              "English, Math, Reading, plus optional Science and Writing",
              "Digital test readiness for the online ACT",
            ],
            note: "We recommend 24 total hours for the ACT because of its broader testing load and math content reaching through the beginning of grade 12.",
          },
        ],
        note: "Consultations are always free. We confirm the right amount of instruction after reviewing goals and diagnostics.",
      },
      {
        kind: "steps",
        eyebrow: "Our process",
        title: "Individualized from the",
        accent: "first session.",
        description:
          "Every student starts in a different place, so every plan we build is different. Some need remediation in algebra, grammar or reading comprehension. Others are already strong academically but need help with timing, focus, strategy, or stamina.",
        steps: [
          {
            title: "Diagnose",
            body: "Initial full-length diagnostics establish a clear score baseline and reveal section-by-section strengths and weaknesses.",
          },
          {
            title: "Plan",
            body: "We build a targeted plan around the student's profile, whether they need content remediation, strategy, pacing, or confidence.",
          },
          {
            title: "Teach",
            body: "One consistent tutor delivers customized instruction matched to the student's pace, learning style, and target score.",
          },
          {
            title: "Monitor",
            body: "Ongoing practice and periodic proctored assessments track progress and keep prep on course through test day.",
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "The digital SAT",
        title: "What the SAT",
        accent: "covers.",
        description:
          "The current SAT is a digital exam with two sections and runs about 2 hours and 14 minutes plus breaks. Before test day, students should download Bluebook and complete exam setup on their device in advance.",
        cards: [
          {
            title: "Reading & Writing",
            body: "Comprehension, vocabulary in context, grammar, revision, and editing skills.",
            icon: "book",
          },
          {
            title: "Math",
            body: "Algebra, advanced math, problem-solving and data analysis, and geometry and trigonometry. A calculator is allowed on the entire Math section, and Bluebook includes a built-in one.",
            icon: "target",
          },
        ],
        wide: true,
      },
      {
        kind: "checklist",
        eyebrow: "The current ACT",
        title: "ACT changes families should",
        accent: "know.",
        description:
          "These changes create real opportunities, but only for students who understand how the updated ACT works and how to prepare strategically.",
        items: [
          "The ACT now offers both paper and online national testing options where available",
          "The online ACT is taken at a test center, not at home",
          "The Composite score is based on English, Math, and Reading",
          "Science is now optional and reported separately",
          "Writing is optional",
          "The current version is shorter and gives students more time per question than the previous format",
        ],
      },
      {
        kind: "dates",
        eyebrow: "Test dates",
        title: "Upcoming SAT",
        accent: "administrations.",
        description:
          "Registration is handled directly through College Board. We recommend treating the regular deadline as the real deadline to get the widest choice of test centers.",
        items: [
          { date: "June 6, 2026", note: "Late registration only · register ASAP at College Board" },
          { date: "August 22, 2026", note: "Regular deadline: Aug 7, 2026" },
          { date: "September 12, 2026", note: "Regular deadline: Aug 28, 2026" },
          { date: "October 3, 2026", note: "Regular deadline: Sep 18, 2026" },
          { date: "November 7, 2026", note: "Regular deadline: Oct 23, 2026" },
          { date: "December 5, 2026", note: "Regular deadline: Nov 20, 2026" },
        ],
      },
      {
        kind: "dates",
        eyebrow: "Test dates",
        title: "Upcoming ACT",
        accent: "administrations.",
        description:
          "Registration is handled directly through ACT at act.org. We recommend registering early to secure your preferred date, location, and testing format.",
        items: [
          { date: "June 13, 2026", note: "Registration closed · standby only via MyACT" },
          { date: "July 11, 2026", note: "Regular deadline: June 5 · Late: June 24 · not offered in NY" },
          { date: "September 19, 2026", note: "2026–2027 testing cycle begins" },
        ],
        note: "Additional fall and winter dates (October and December) follow the September administration. Check act.org for the complete, up-to-date schedule.",
      },
      {
        kind: "faq",
        eyebrow: "Questions",
        title: "Test prep questions,",
        accent: "answered.",
        items: [
          {
            q: "SAT or ACT, which is better?",
            a: "There is no universal answer, but most students we work with currently prefer the SAT. Many find its pacing more manageable, while the ACT's timing is often more unforgiving. We recommend starting with a diagnostic and letting the data decide which test fits your student best.",
          },
          {
            q: "How many hours of tutoring does a student need?",
            a: "Most SAT students do best with our 20-hour private package, which gives enough time to build on strengths, address weak areas, improve timing, and build confidence. For the ACT we generally recommend 24 total hours. We confirm the right amount during your free consultation after reviewing goals and diagnostics.",
          },
          {
            q: "Do you offer in-person and virtual tutoring?",
            a: "Yes. Private tutoring is available both in-person at our Holly Springs center and virtually, with the same personalized instruction and quality either way.",
          },
          {
            q: "Who is private tutoring best for?",
            a: "Students who want a customized plan, have uneven skills across sections, are below grade level in math or reading and writing, deal with test anxiety, need help with pacing or focus, benefit from individualized instruction, or have busy schedules that need flexibility.",
          },
          {
            q: "When do the SAT group classes run?",
            a: "Our group SAT class is offered once a year in preparation for the March SAT, traditionally one of the most popular test dates. The next group cycle begins in January 2027. If you want structured prep in a classroom setting, reach out early to reserve a spot. If you need prep on a different timeline, our private tutoring is available year-round.",
          },
          {
            q: "How much can a student improve?",
            a: "It depends on where a student starts. Most of our students gain between 200 and 300 points from their baseline through focused preparation, strategy work, and consistent practice. Students who begin with lower scores often see the largest jumps, while students who start higher tend to land in the 200-point range. Your free consultation and initial diagnostic give us a realistic target.",
          },
          {
            q: "Is the ACT Science section required?",
            a: "No. On the current ACT, Science is optional and reported separately, and Writing is optional too. The Composite score is based on English, Math, and Reading. We help each student decide whether to take the optional sections based on their college and scholarship goals.",
          },
        ],
      },
    ],
  },
  {
    slug: "pathways-academy",
    name: "Pathways Academy",
    shortName: "Pathways Academy",
    category: "Private High School",
    tagline: "A meaningful path to graduation.",
    summary:
      "A private diploma-granting high school for neurodiverse teens who thrive in smaller settings, with individualized support, real-world learning, and educators who genuinely understand how they learn.",
    intro:
      "Pathways Academy is a private diploma-granting high school for neurodiverse teens who thrive in smaller settings, with individualized support, real-world learning, and educators who genuinely understand how they learn.",
    icon: "compass",
    accent: "blue",
    image: {
      src: "/images/program-pathways-academy.jpg",
      alt: "A high school student working through notes at a desk with headphones around their neck.",
      kind: "photo",
    },
    featured: true,
    /*
     * Deliberately no `externalUrl`.
     *
     * Pathways ran on its own subdomain, so every link out of this site sent a
     * family to a different domain and left them to find their way back. Joe
     * asked on the Aug 3 2026 call for it to live here instead.
     *
     * Everything below is transcribed from pathways.resourceroom.com as it
     * stood on Aug 3 2026 — the wording is theirs, section for section, so the
     * page reads identically to the site it replaces. The subdomain's own
     * "Schedule a Visit" links pointed back at resourceroomnc.com, which is
     * the round trip this merge removes: they are now ordinary on-site links.
     */
    stats: [
      { value: "Grades 9–12", label: "Diploma-granting private high school" },
      { value: "Holly Springs", label: "North Carolina" },
      { value: "Small cohort", label: "Licensed educators" },
    ],
    /* "What students experience at Pathways every day" — the six program
       highlight cards, in the order the subdomain lists them. */
    highlights: [
      {
        title: "Small group learning",
        body: "Individualized attention, steady support, and a calmer learning environment where every student is known, not just a number in a roster.",
      },
      {
        title: "Personalized academic pathways",
        body: "Core subjects (English, writing, math, science, history) delivered at each student's level and scaled to readiness, ability, and long-term goals.",
      },
      {
        title: "Executive function support",
        body: "Daily help with organization, planning, task initiation, and follow-through: the foundational skills that make all other academic learning possible.",
      },
      {
        title: "Social development",
        body: "Structured interaction that builds communication, collaboration, and self-advocacy, woven into daily routines, not reserved for occasional pull-out sessions.",
      },
      {
        title: "Hands-on project learning",
        body: "Meaningful projects that help students apply academic skills in real situations, building genuine confidence alongside genuine competence.",
      },
      {
        title: "Real-world readiness",
        body: "Career exploration, community experiences, independence skills, and future planning, because graduation is a beginning, not just an endpoint.",
      },
    ],
    /* "What makes Pathways different." */
    includes: [
      "Small cohort model: intimate, calm, focused learning environment",
      "Licensed educators with real special education classroom experience",
      "Social-emotional learning built into the daily structure, not an add-on",
      "Project-based learning connecting academics to the real world",
      "Executive functioning coaching built into every school day",
      "Direct access to the full Resource Room support ecosystem",
    ],
    /* "Who Pathways is for." */
    audience: [
      "Students with ADHD, autism, anxiety, or learning differences",
      "Students who feel overwhelmed or disengaged in traditional settings",
      "Students who need individualized pacing toward diploma completion",
      "Students who benefit from smaller, structured learning environments",
      "Students needing executive functioning and organizational support",
      "Homeschool students ready for a more structured academic program",
    ],
    blocks: [
      {
        kind: "prose",
        eyebrow: "Who Pathways is for",
        title: "Built for students who need a better",
        accent: "environment.",
        body: [
          "Traditional high school wasn't designed for every learner. For neurodiverse students, large classrooms, rigid pacing, and limited support create frustration rather than growth. Pathways was built to solve that.",
          "Students at Pathways Academy work toward earning a private high school diploma in an environment built around how they actually learn, not how they're expected to perform.",
          "We don't separate academics from development. Every part of the school day builds both: simultaneously, intentionally, and without forcing students to choose between the two.",
        ],
      },
      {
        kind: "cards",
        eyebrow: "The Resource Room ecosystem",
        title: "Pathways is the intensive option within a complete",
        accent: "support system.",
        description:
          "Most schools offer one program. Resource Room offers a complete ecosystem, coordinated support across academics, behavior, executive functioning, communication, and clinical services. Families don't have to piece it together alone.",
        cards: [
          {
            title: "Pathways Academy",
            body: "Private diploma-granting high school for neurodiverse learners. Small cohort, licensed educators, full-day structured support with SEL built into every day.",
            icon: "compass",
          },
          {
            title: "Private tutoring",
            body: "One-on-one K–12 tutoring across all subjects. Pathways students access individual academic support whenever it's needed, fully coordinated with their school program.",
            icon: "pencil",
          },
          {
            title: "Homeschool co-op",
            body: "A structured middle ground for families not yet ready for full private school. Often the natural gateway into Pathways for students transitioning from homeschool.",
            icon: "home",
          },
          {
            title: "ABA services, POPS ABA",
            body: "Applied Behavior Analysis delivered in coordination with Pathways, targeting communication, emotional regulation, task initiation, and independence where learning actually happens.",
            icon: "heart",
          },
          {
            title: "STEM programs",
            body: "Camps, enrichment, and hands-on science and engineering programs that reinforce the problem-solving skills that transfer across every subject area.",
            icon: "sparkle",
          },
          {
            title: "College and test prep",
            body: "SAT, ACT, AP prep, and college readiness support available when Pathways students are ready to take the next step toward higher education.",
            icon: "cap",
          },
        ],
      },
      {
        kind: "steps",
        eyebrow: "Your family's journey",
        title: "How families find their way to",
        accent: "Pathways.",
        description:
          "There is no single path to enrollment. What matters is that the right support is available when your student is ready for it, and we guide you every step of the way.",
        steps: [
          {
            title: "Free consultation",
            body: "An honest conversation about your student's needs. No sales pitch. We'll tell you directly whether Pathways is the right fit.",
          },
          {
            title: "Student visit",
            body: "Come see the environment. Meet the educators. Let your student experience the difference before any commitment is made.",
          },
          {
            title: "Funding navigation",
            body: "We help you access ESA+ grants and Opportunity Scholarships that may significantly offset or fully cover tuition costs.",
          },
          {
            title: "Enrollment plan",
            body: "We build a personalized academic and developmental plan for your student before the first day of school begins.",
          },
          {
            title: "Ongoing support",
            body: "Regular progress updates and full access to the Resource Room ecosystem as your student grows and their needs evolve.",
          },
        ],
      },
      {
        kind: "pricing",
        eyebrow: "Tuition and funding",
        title: "Making Pathways accessible for your",
        accent: "family.",
        description:
          "Pathways Academy's full tuition is $24,000 per year, but most families pay significantly less. North Carolina offers two grant programs that can cover most or all of tuition. We help every family navigate both.",
        tiers: [
          {
            name: "Annual tuition",
            price: "$24,000",
            cadence: "per year",
            meta: "Full published rate before grants",
            features: [
              "Full diploma-granting high school program",
              "Small cohort and individualized pacing",
              "Daily executive functioning and social development",
              "Access to the full Resource Room ecosystem",
            ],
          },
          {
            name: "ESA+ grant",
            price: "$17,000",
            cadence: "max",
            badge: "Autism diagnosis",
            meta: "NC Opportunity for Students with Disabilities",
            featured: true,
            features: [
              "North Carolina's ESA+ program provides funding for students with qualifying disabilities",
              "Students with an autism spectrum diagnosis may receive up to $17,000 annually toward private school tuition",
              "We guide families through the application and waitlist process",
            ],
          },
          {
            name: "Opportunity Scholarship",
            price: "$7,000+",
            cadence: "income-tiered",
            meta: "NC School Choice Scholarship",
            features: [
              "Available to any family pursuing school choice, awarded on an income-tiered basis",
              "Unlike ESA+, there is no waitlist",
              "Combined with ESA+, many families can cover the full cost of Pathways tuition",
            ],
          },
        ],
        note: "We help you access every dollar available. Many families don't know these grants exist, or don't know how to apply. We walk you through both programs, help with paperwork, and work with your family to structure tuition in a way that works. A consultation is always free, and we will never place a student in a program that isn't the right fit.",
      },
      {
        kind: "prose",
        eyebrow: "After graduation",
        title: "About the Pathways",
        accent: "diploma.",
        body: [
          "Pathways Academy awards a private high school diploma upon completion of the program. A private diploma does not preclude students from entering college. Graduates may apply to two-year and four-year institutions, and students who are academically ready have the opportunity to enroll in Wake Technical Community College courses during their senior year, earning college credit before graduation.",
          "Every student's path after Pathways looks different. For some, that means a four-year university. For others, a community college, a trade program, or entering the workforce with real skills and genuine confidence. Our goal is to prepare students for what comes next, whatever that looks like for them, not to funnel every graduate into a single definition of success.",
        ],
      },
      {
        kind: "cards",
        eyebrow: "Coordinated care",
        title: "A complete support system, working together for your",
        accent: "student.",
        description:
          "Most families of neurodiverse students spend years coordinating between disconnected providers. At Resource Room, every service communicates, collaborates, and aligns around one shared goal, your student's growth. Every service communicates. Every specialist aligns. Nothing falls through the cracks.",
        cards: [
          {
            title: "Coordinated communication",
            body: "Every provider in our network communicates directly with Pathways educators. No information gets lost between appointments, sessions, and school days.",
            icon: "users",
          },
          {
            title: "Unified goals",
            body: "Academic, behavioral, and clinical support all align around the same objectives for your student, developed collaboratively, not in isolation.",
            icon: "target",
          },
          {
            title: "One point of contact",
            body: "You don't coordinate between five separate providers. We do. One team, one phone call, one plan, so you can focus on your family.",
            icon: "phone",
          },
        ],
      },
    ],
  },
  {
    slug: "homeschool-co-op",
    name: "Homeschool Co-Op in Holly Springs, NC",
    shortName: "Homeschool Co-Op",
    category: "Structured Daytime Learning",
    tagline: "Flexible classes. Real connection. Stronger together.",
    summary:
      "Small-group classes for middle and high school homeschool students — a comfortable middle ground between homeschooling at home and a larger school environment.",
    intro:
      "Homeschooling gives your family flexibility. But flexibility doesn't have to mean doing it all alone. Some students need more structure in their week. Some need a teacher who knows them. Some need the chance to learn alongside peers in a setting that still feels safe and personal. That's what our co-op provides: a comfortable middle ground between homeschooling at home and a larger school environment, with real instruction from experienced educators who care about your child.",
    icon: "home",
    accent: "blue",
    image: {
      src: "/images/tile-homeschool-coop.jpg",
      alt: "Resource Room Homeschool Co-Op for middle and high school students.",
      kind: "tile",
    },
    popular: true,
    stats: [
      { value: "Grades 6–12", label: "Middle and high school programs" },
      { value: "2 days", label: "Academic day plus lab day" },
      { value: "From $425", label: "Per class, per semester" },
    ],
    highlights: [
      {
        title: "Educator-led",
        body: "Classes are led by experienced educators who know how to teach, scaffold, and support students across a range of learning needs and academic levels.",
      },
      {
        title: "Small groups, real relationships",
        body: "Students are not lost in the mix. Teachers know them. Families feel connected. Learning feels human.",
      },
      {
        title: "Academics with the right support",
        body: "We care about skill-building, confidence, and steady growth. Students are challenged but supported every step of the way.",
      },
      {
        title: "A comfortable bridge",
        body: "More structure than homeschooling alone. Far more personal and flexible than a traditional school. The middle ground many families are looking for.",
      },
    ],
    includes: [
      "Small-group classes taught by experienced educators",
      "An academic day and a lab day each week",
      "Core subjects: English, math, science, history and civics",
      "Learning strategies and executive function lab",
      "SAT foundations lab for high school students",
      "Mix and match any combination of academic and lab classes",
    ],
    audience: [
      "Students who need more structure than homeschooling at home provides",
      "Students who need connection and want to learn alongside peers",
      "Families exploring what comes next, including Pathways Academy",
      "Middle and high school homeschool students in the Holly Springs area",
    ],
    blocks: [
      {
        kind: "cards",
        eyebrow: "Who it's for",
        title: "Who this co-op",
        accent: "is for.",
        cards: [
          {
            title: "Students who need more structure",
            body: "A few days of structured classes each week can give your child the consistency and accountability that's hard to maintain at home alone.",
            icon: "clock",
          },
          {
            title: "Students who need connection",
            body: "Learning alongside peers in a small, supportive group builds friendships, communication skills, and the kind of belonging that matters.",
            icon: "users",
          },
          {
            title: "Families exploring what comes next",
            body: "For some students, the co-op is exactly the right fit long-term. For others, it becomes a natural stepping stone toward Pathways Academy, our private high school for neurodiverse learners.",
            icon: "compass",
          },
        ],
      },
      {
        kind: "schedule",
        eyebrow: "Fall 2026 · September – December",
        title: "The weekly",
        accent: "schedule.",
        groups: [
          {
            title: "High School Program",
            subtitle: "Mondays & Wednesdays",
            rows: [
              { label: "Monday · 9:30 – 10:30", value: "English Composition" },
              { label: "Monday · 10:40 – 11:40", value: "Algebra / Algebra Foundations" },
              { label: "Monday · 12:15 – 1:15", value: "U.S. History, Government & Civics" },
              { label: "Monday · 1:25 – 2:25", value: "Introductory Biology" },
              { label: "Wednesday · 9:30 – 10:30", value: "SAT Foundations Lab" },
              { label: "Wednesday · 10:40 – 11:40", value: "Integrated Science Lab" },
            ],
          },
          {
            title: "Middle School Program",
            subtitle: "Tuesdays & Thursdays",
            rows: [
              { label: "Tuesday · 9:30 – 10:30", value: "Writing Workshop" },
              { label: "Tuesday · 10:40 – 11:40", value: "Math Foundations / Pre-Algebra" },
              { label: "Tuesday · 12:15 – 1:15", value: "Earth Science" },
              { label: "Tuesday · 1:25 – 2:25", value: "American History & Civics" },
              { label: "Thursday · 9:30 – 10:30", value: "Science & Investigation Lab" },
              {
                label: "Thursday · 10:40 – 11:40",
                value: "Learning Strategies & Executive Function Lab",
              },
            ],
          },
        ],
      },
      {
        kind: "pricing",
        eyebrow: "Enrollment and pricing",
        title: "Build the program that fits your",
        accent: "child.",
        description:
          "Families can build the program in whatever way makes sense for their child. Pick individual classes or bundle for better value.",
        tiers: [
          {
            name: "1 Class",
            price: "$425",
            cta: { label: "Enrol now", href: "/programs/homeschool-co-op/homeschool-co-op#buy" },
            cadence: "per semester",
            features: ["One class from the academic day or lab day"],
          },
          {
            name: "2 Classes",
            price: "$850",
            cta: { label: "Enrol now", href: "/programs/homeschool-co-op/homeschool-co-op#buy" },
            cadence: "per semester",
            features: ["Any two classes, academic day or lab day"],
          },
          {
            name: "3 Classes",
            price: "$1,250",
            cta: { label: "Enrol now", href: "/programs/homeschool-co-op/homeschool-co-op#buy" },
            cadence: "per semester",
            features: ["Any three classes, academic day or lab day"],
          },
          {
            name: "Full Academic Day",
            price: "$1,650",
            cta: { label: "Enrol now", href: "/programs/homeschool-co-op/homeschool-co-op#buy" },
            cadence: "per semester",
            meta: "4 classes",
            featured: true,
            features: ["The complete academic day", "All four core subjects"],
          },
          {
            name: "Academic + Lab Track",
            price: "$2,450",
            cta: { label: "Enrol now", href: "/programs/homeschool-co-op/homeschool-co-op#buy" },
            cadence: "per semester",
            meta: "The full two-day program",
            features: [
              "The complete academic day",
              "Plus the full lab day",
              "The most structure available in the co-op",
            ],
          },
        ],
        note: "Mix and match any combination. Choose classes from the academic day, lab day, or both. Final class or block selection is made after you choose grade level and enrollment type; registration is finalized by phone.",
      },
      {
        kind: "prose",
        eyebrow: "What comes next",
        title: "A natural path to Pathways",
        accent: "Academy.",
        body: [
          "For some students, the co-op is exactly the right fit. For others, it becomes a stepping stone toward something more structured. Pathways Academy is our private diploma-granting high school for neurodiverse learners in grades 9-12, offering small cohorts, daily executive functioning support, and a full ecosystem of services.",
          "Many homeschool students aren't ready to jump directly into a full private school program. The co-op provides a transition period where students can build comfort, routines, and confidence before making that move.",
        ],
      },
    ],
  },
  {
    slug: "aba-services",
    name: "ABA Support in an Educational Setting",
    shortName: "ABA Services",
    category: "Structured Daytime Learning",
    tagline: "A different kind of ABA — personal, purposeful, and built around your child",
    summary:
      "In partnership with POPS ABA, behavior support delivered where learning actually happens — alongside tutoring, the co-op and Pathways Academy.",
    intro:
      "Resource Room partnering with POPS ABA gives families access to behavior support that can work alongside tutoring, executive functioning support, Pathways Academy programming, and our homeschool co-ops. This opportunity is designed for students who need help building the skills that make learning possible. By connecting ABA support with real educational settings, students can practice these skills during academic work, group activities, and everyday learning routines.",
    icon: "heart",
    accent: "sun",
    image: {
      src: "/images/tile-aba.png",
      alt: "Resource Room and POPS ABA partnership — ABA support in an educational setting.",
      kind: "tile",
    },
    popular: true,
    stats: [
      { value: "BCBA", label: "Board Certified Behavior Analyst" },
      { value: "In-setting", label: "Support where learning happens" },
      { value: "Adolescents", label: "And young adults, often underserved" },
    ],
    highlights: [
      {
        title: "Real learning demands",
        body: "Working through challenging assignments, following directions, receiving feedback, and persisting when a task gets hard.",
      },
      {
        title: "Real social expectations",
        body: "Practicing communication, cooperation, group participation, conflict management, and flexibility where it counts.",
      },
      {
        title: "Real independence skills",
        body: "Building transitions, routines, self-advocacy, task completion, emotional regulation, and future readiness.",
      },
    ],
    includes: [
      "Individualized, data-driven support from a Board Certified Behavior Analyst",
      "Support delivered inside real educational settings",
      "Coordination with one-to-one tutoring and academic instruction",
      "Integration with Pathways Academy programming where appropriate",
      "Goals tied to communication, regulation, independence and readiness",
      "Ongoing communication with families",
    ],
    audience: [
      "Students who benefit from behavioral support during the school day",
      "Students working on transitions, attention and self-regulation",
      "Adolescents and young adults often underserved by early-childhood-focused ABA",
      "Neurodiverse students who may be a strong fit for Pathways but need readiness skills first",
      "Families seeking ABA support tied to academic progress",
    ],
    blocks: [
      {
        kind: "prose",
        eyebrow: "Our model",
        title: "Why ABA in an educational setting",
        accent: "matters.",
        body: [
          "If you've researched ABA, you may have encountered strong opinions. Some families worry it can feel rigid, repetitive, or focused on compliance over the child. We share those concerns, and that's exactly why this partnership exists.",
          "Our model is built on a simple belief: the goal is never to replace learning with therapy or to add hours for the sake of adding hours. The goal is to help students access learning more effectively by supporting the behavioral, social, emotional, and functional skills that make learning possible.",
          "ABA is often delivered at home, in a clinic, or in one-on-one therapy rooms. Those settings have value, but students also need to practice skills where they're actually expected to use them. An educational setting provides that.",
          "This collaboration is uncommon. In most educational environments, outside ABA providers can't work directly with students during the school day, and families are left coordinating school, tutoring, therapy, and home routines separately. Resource Room is building a more connected model.",
        ],
      },
      {
        kind: "checklist",
        eyebrow: "The skills behind academic success",
        title: "What ABA support can help",
        accent: "with.",
        description:
          "A student may know how to solve the math problem but shut down when it feels overwhelming. They may understand the reading but struggle to join the discussion. These aren't separate from education — they're often the very skills that determine whether a student can access their education.",
        items: [
          "Starting and completing academic tasks",
          "Managing frustration during hard assignments",
          "Transitioning between activities",
          "Accepting feedback or correction",
          "Participating in group instruction",
          "Handling disagreement appropriately",
          "Communicating needs clearly",
          "Building independence and self-advocacy",
        ],
      },
      {
        kind: "person",
        eyebrow: "The person behind the work",
        title: "Meet Hunter",
        accent: "Weber.",
        name: "Hunter Weber",
        credentials: "M.A., BCBA, LBA — Lead ABA Specialist",
        body: [
          "The reason we're confident in this partnership is the person leading it. Hunter is a Board Certified Behavior Analyst who cares deeply about providing the right support for each student, not a one-size-fits-all program.",
          "Hunter has extensive experience supporting adolescents and young adults in communication, social development, independence, emotional regulation, and life skills. That matters: middle schoolers, high schoolers, and adult learners are often underserved in ABA, where services traditionally focus on early childhood.",
          "His approach is individualized, practical, and centered on long-term growth. Hunter believes every student has strengths worth building on, and his work focuses on helping them discover and practice the skills that lead to greater independence, stronger relationships, and more successful participation in school, home, community, and future work.",
        ],
        bullets: [
          "Supporting adolescents, older students, and young adults",
          "Building communication and social problem-solving",
          "Developing independence and flexibility",
          "Strengthening emotional regulation and life skills",
          "Practicing communication in real-world contexts",
          "Developing workplace readiness",
          "Helping students feel supported, challenged, and valued",
        ],
      },
      {
        kind: "cards",
        eyebrow: "How it works",
        title: "How families can use ABA",
        accent: "support.",
        description:
          "Families pursue ABA in different ways. For many, most ABA services still happen outside the educational setting. The unique opportunity here is that ABA can also coordinate with real educational services.",
        cards: [
          {
            title: "With one-on-one educational support",
            body: "For students in tutoring or individualized instruction, ABA may support attention, task initiation, frustration tolerance, communication, flexibility, organization, and independence during academic work.",
            icon: "pencil",
          },
          {
            title: "With Pathways Academy",
            body: "For Pathways students, ABA can be woven into the school environment, focusing on group dynamics, cooperation, communication, conflict management, emotional regulation, and real-world readiness.",
            icon: "compass",
          },
        ],
        wide: true,
      },
      {
        kind: "faq",
        eyebrow: "Questions",
        title: "Frequently asked",
        accent: "questions.",
        items: [
          {
            q: "Does ABA replace tutoring or academic instruction?",
            a: "No. The goal is never to replace academic instruction with therapy. It's to help students access learning more effectively by supporting the behavioral, social, emotional, and functional skills that make learning possible.",
          },
          {
            q: "Can ABA support be used with one-on-one tutoring?",
            a: "Yes. Families may explore ABA that coordinates with one-on-one educational support, especially when a student needs help with task initiation, frustration tolerance, flexibility, communication, or independence during academic work.",
          },
          {
            q: "Can ABA support be used with Pathways Academy?",
            a: "Yes. For Pathways students, ABA support may be incorporated into the educational environment, particularly around group dynamics, cooperation, emotional regulation, conflict management, and real-world readiness.",
          },
          {
            q: "Will all ABA services happen at Resource Room?",
            a: "Not necessarily. Many families use the majority of their ABA services outside the educational setting, including home-based support, parent consultation, or independent living routines. Resource Room provides the opportunity for some support to occur alongside educational services.",
          },
          {
            q: "Why is this model rare?",
            a: "In many school environments, outside ABA providers can't work directly with students during the day. Resource Room and Pathways Academy offer a more flexible private setting where educational support and behavior support work together meaningfully.",
          },
          {
            q: "What makes Hunter's approach a good fit for older students?",
            a: "Hunter has experience supporting adolescents, young adults, and adult learners in communication, social development, independence, emotional regulation, life skills, and workplace readiness. This matters because older students are often underserved in ABA compared with younger children.",
          },
        ],
      },
    ],
    disclaimer:
      "Services are recommended with purpose. This partnership is not about adding hours for the sake of it. ABA services should always be individualized, appropriate, and connected to meaningful goals for the student and family. That is the standard we hold.",
  },
  {
    slug: "college-prep",
    name: "College Admissions & Essay Guidance",
    shortName: "College Prep",
    category: "College Advisement",
    tagline: "Expert-led support from an admissions insider, 10+ years of experience",
    summary:
      "College admissions advisement and essay guidance led by a former College Admissions Officer — from the personal essay to the final application.",
    intro:
      "The college process can feel overwhelming. Our team turns it into a clear, confident, and rewarding journey, from the personal essay to the final application, guided by someone who has sat on the other side of the admissions desk. We help your student tell their story with clarity and confidence.",
    icon: "cap",
    accent: "sun",
    image: {
      src: "/images/program-college-prep.jpg",
      alt: "A student filling in bubbles on a standardized test answer sheet with a pencil.",
      kind: "photo",
    },
    featured: true,
    stats: [
      { value: "10+ yrs", label: "Admissions experience" },
      { value: "Insider", label: "Former admissions officer" },
      { value: "Holistic", label: "Whole-student approach" },
    ],
    highlights: [
      {
        title: "Insider expertise",
        body: "Led by Mr. C, a former College Admissions Officer and Senior High School Adviser, our team brings unparalleled insight into how the admissions process actually works.",
      },
      {
        title: "Personalized attention",
        body: "We build around your student's unique profile and college portfolio, ensuring the essay and application stand out for the right reasons.",
      },
      {
        title: "Collaborative support",
        body: "Our approach brings students and parents together, working as partners toward a shared goal with clear communication throughout.",
      },
      {
        title: "Quality and care",
        body: "We are committed to essays and applications that genuinely reflect each student's strengths, character, and aspirations.",
      },
    ],
    includes: [
      "Free consultation and admissions strategy",
      "Guided brainstorming and theme exploration",
      "Common App personal statement support",
      "Supplemental and 'Why Us' essay support",
      "Detailed editorial feedback across multiple revision rounds",
      "Holistic review of GPA, test scores, essays and financials",
      "Early action deadline targeting and application timeline planning",
    ],
    audience: [
      "Sophomores building foundational skills and preparing for the PSAT",
      "Juniors selecting colleges and preparing for the SAT or ACT",
      "Seniors finalizing applications and making college decisions",
      "Families wanting an experienced second set of eyes on the process",
    ],
    blocks: [
      {
        kind: "pricing",
        eyebrow: "Packages",
        title: "Essay and application",
        accent: "support.",
        tiers: [
          {
            name: "Common App Essay Only",
            price: "$549",
            meta: "The centerpiece of most applications",
            cta: { label: "Buy this package", href: "/programs/college-prep/college-admissions#buy" },
            features: [
              "Guided brainstorming and topic discovery",
              "Narrative structure and outlining",
              "Multiple rounds of detailed editorial feedback",
              "Final draft polish in the student's own voice",
            ],
          },
          {
            name: "Essay + Common App + Supplements",
            price: "$899",
            badge: "Complete support",
            cta: { label: "Buy this package", href: "/programs/college-prep/college-admissions#buy" },
            meta: "Common App essay, the application itself, and up to 5 supplements",
            featured: true,
            features: [
              "Everything in the Common App Essay package",
              "Common App walkthrough, section by section",
              "Up to 5 supplemental or 'Why Us' essays",
              "Deadline tracking through submission",
            ],
          },
        ],
        note: "Consultations are always free.",
      },
      {
        kind: "person",
        eyebrow: "Who leads it",
        title: "Guided by a true admissions",
        accent: "insider.",
        name: "Mr. C",
        credentials: "Former College Admissions Officer and Senior High School Adviser",
        body: [
          "Our admissions services are led by Mr. C, a former College Admissions Officer and Senior High School Adviser. His firsthand experience inside university admissions offices gives our students a distinct, hard-to-find advantage: a real understanding of what admissions teams look for, how applications are read, and what makes a candidate stand out.",
        ],
        summary:
          "Mr. C's insider knowledge from university-level admissions gives your student a genuine, distinct advantage.",
      },
      {
        kind: "steps",
        eyebrow: "Our process",
        title: "From first conversation to final",
        accent: "submission.",
        description: "A clear, collaborative path, tailored to your student.",
        steps: [
          {
            title: "Free consultation",
            body: "We begin with your student's unique story. We listen, understand their background and goals, and map out a strategy for an essay and application that reflect who they truly are.",
          },
          {
            title: "Planning meetings",
            body: "Through guided brainstorming and theme exploration, we lay a solid foundation for the essay and partner with your student at every step.",
          },
          {
            title: "First draft creation",
            body: "We help transform ideas into a compelling first draft, with expert guidance that keeps the student's authentic voice front and center.",
          },
          {
            title: "Edits and revisions",
            body: "Our editors provide detailed, constructive feedback, collaborating with your student to refine and strengthen the narrative.",
          },
          {
            title: "Final draft perfection",
            body: "We polish a powerful final draft built to capture an admissions officer's attention and leave a lasting impression.",
          },
        ],
      },
      {
        kind: "prose",
        eyebrow: "The heart of the application",
        title: "The student does the writing. We",
        accent: "coach.",
        body: [
          "Grades and scores tell admissions officers what a student has done. The essay tells them who the student is. The personal essay is often the deciding factor between two students with similar transcripts — the one place in the entire application where a student speaks directly to the admissions committee in their own voice.",
          "Our essay support rests on three commitments we hold equally. We protect the student's authentic voice, because admissions officers can spot a manufactured or over-edited essay instantly. We help every student uncover the standout story or angle that genuinely sets them apart, since the best topics are often hiding in ordinary moments students would never think to write about. And we bring an insider's understanding of exactly what admissions teams are looking for.",
          "This matters, so we say it plainly. Your student writes their own essay. We are coaches and editors, not ghostwriters. We guide brainstorming, ask the right questions, and give detailed feedback that sharpens the writing, but the words, the voice, and the story remain the student's own. That is what keeps the essay honest, what keeps it admissions-safe, and what makes it ring true to the people reading it.",
        ],
      },
      {
        kind: "cards",
        eyebrow: "Essays we help with",
        title: "The two that decide",
        accent: "the most.",
        cards: [
          {
            title: "The Common App personal statement",
            body: "The centerpiece of most applications. We help students find a meaningful topic, structure a compelling narrative, and polish it into a personal statement that works across every school on their list.",
            icon: "pencil",
          },
          {
            title: "Supplemental and 'Why Us' essays",
            body: "The essays that trip students up most. We help them research each school authentically and write targeted supplements that show genuine fit, not recycled, generic answers that admissions officers see hundreds of times.",
            icon: "book",
          },
        ],
        wide: true,
      },
      {
        kind: "cards",
        eyebrow: "Year by year",
        title: "The strongest applications are built over",
        accent: "time.",
        description: "We meet students wherever they are.",
        cards: [
          {
            title: "Sophomore year",
            body: "PSAT preparation with a focus on potential scholarships and building the foundational skills that pay off later.",
            icon: "book",
          },
          {
            title: "Junior year",
            body: "Guidance on college selection and application requirements, paired with intensive SAT and ACT preparation.",
            icon: "target",
          },
          {
            title: "Senior year",
            body: "Tailored admissions services, finalizing applications, and making informed, confident college decisions.",
            icon: "cap",
          },
        ],
      },
    ],
  },
  {
    slug: "iep-504-advocate",
    name: "IEP & 504 Advocate Services",
    shortName: "IEP & 504 Advocate",
    category: "Family Advocacy",
    tagline: "IEP and 504 support from a licensed career educator",
    summary:
      "A licensed special education teacher reviews the plan, prepares your strategy, and sits beside you at the IEP or 504 table, focused on your child.",
    intro:
      "When your child needs more from their school, the meeting can feel like you against the room. I help you walk in prepared and walk out with a plan that actually works, guided by someone who has spent a career on the same side of the table as you. You know your child better than anyone in that room. The special education process moves fast and speaks its own language. My job is to slow it down, make it make sense, and keep the focus on what your child truly needs to succeed.",
    icon: "shield",
    accent: "blue",
    image: {
      src: "/images/tile-iep-advocacy.png",
      alt: "Resource Room Learning Center IEP and 504 advocate services.",
      kind: "tile",
    },
    stats: [
      { value: "Licensed", label: "Special education teacher" },
      { value: "NYC & WCPSS", label: "Public school classroom experience" },
      { value: "FBA / BIP", label: "Former behavior support teacher" },
    ],
    highlights: [
      {
        title: "Experienced from the inside",
        body: "I have spent more than a decade in real classrooms and now lead programs built for students who learn differently. I have sat where the teachers sit, and I know how strong plans actually get written.",
      },
      {
        title: "Firm but fair",
        body: "I build real partnerships with your child's school, and most of the time that is what gets results. But when your child's needs are on the line, I am not afraid to push. Fair when we can be, firm when we need to be, always focused on your child.",
      },
      {
        title: "Built to empower you",
        body: "I never want you to need me forever. As we work together, I hand you the language, the questions, and the confidence to lead the next meeting yourself.",
      },
      {
        title: "Rooted in your community",
        body: "As a local learning center serving families across the Triangle, I know the schools in this area and the people in the room. You get an advocate who is present, invested, and here for the long run.",
      },
    ],
    includes: [
      "A free initial consultation, always complimentary",
      "Full review of the current IEP or 504 plan, evaluations and progress reports",
      "Meeting strategy and preparation before you sit down at the table",
      "Placement and environment review",
      "Attendance and advocacy at IEP, 504, eligibility or intervention meetings, in person or virtually",
      "Parent coaching for families who want to lead the meetings themselves",
      "Follow-up support on implementation",
    ],
    audience: [
      "Your child is struggling and has no plan yet",
      "The current IEP or 504 is not working",
      "An important meeting is coming up",
      "You feel unheard at the table",
      "You are weighing a school change",
    ],
    blocks: [
      {
        kind: "steps",
        eyebrow: "How I can help",
        title: "Start",
        accent: "here.",
        description:
          "Whether you are just starting to wonder if your child qualifies for support, or you have a meeting on the calendar that feels like it matters, there is a clear next step.",
        steps: [
          {
            title: "Free consultation",
            body: "Tell me what is going on with your child. I will listen, give you an honest read on where things stand, and recommend the smartest next move. No pressure, no obligation.",
            note: "Always complimentary",
          },
          {
            title: "Records & plan review",
            body: "I read the full picture: the current IEP or 504 Plan, evaluations, and progress reports. Then I give you a clear summary of what is working, what is missing, and exactly what to ask for.",
            note: "Fees reviewed at consultation",
          },
          {
            title: "Meeting strategy & prep",
            body: "We map your goals, organize your concerns, and build the case before you ever sit down at the table. You walk in calm, clear, and ready for whatever comes up.",
            note: "Fees reviewed at consultation",
          },
          {
            title: "Placement & environment review",
            body: "Is your child in the right setting, and is it actually working? I look at the current placement, accommodations, and goals to make sure they fit your child and are being carried out the way they should be, day to day.",
            note: "Fees reviewed at consultation",
          },
          {
            title: "Meeting attendance & support",
            body: "I am right beside you at your IEP, 504, eligibility, or intervention meeting, in person or virtually. I ask the right questions, take detailed notes, and keep the team focused on your child.",
            note: "Fees reviewed at consultation",
          },
        ],
      },
      {
        kind: "person",
        eyebrow: "Who is in your corner",
        title: "Meet Joe",
        accent: "Cuccurullo.",
        name: "Joe Cuccurullo",
        credentials: "Co-founder, Resource Room Learning Center",
        image: {
          src: "/images/joe-cuccurullo.jpg",
          alt: "Joe Cuccurullo, co-founder of Resource Room Learning Center.",
          kind: "photo",
        },
        body: [
          "I have built my entire career around one belief: every child can learn when the right supports are in place. I started as a classroom teacher, and in 2015 my wife Sam and I founded Resource Room to do education the way we always believed it should be done, one student at a time. Today our family of programs reaches well beyond tutoring.",
          "Through Pathways Academy and our ABA support work, we serve neurodiverse students every single day. That means I am not learning the special education world from a textbook. I live in it. I am a licensed special education teacher who has taught in both the New York City and Wake County (WCPSS) public school systems, and I served as a Behavior Support Teacher working directly with the students who needed the most help. Advocacy is simply me bringing that experience to your side of the table.",
        ],
        bullets: [
          "Licensed special education teacher — formally trained and certified in the exact system your child's plan lives in",
          "Taught in NYC and Wake County (WCPSS) schools — real classroom experience inside two of the country's major public school systems",
          "Former Behavior Support Teacher — hands-on expertise with FBAs, BIPs, and the students who need the most support",
        ],
        summary:
          "Some parents want to build the skills to advocate on their own, for this child and for every year that follows. In focused coaching sessions I teach you how the process works, what your rights are, and how to walk into any meeting prepared and confident.",
      },
      {
        kind: "steps",
        eyebrow: "How it works",
        title: "Every family starts in a different",
        accent: "place.",
        description:
          "We begin with a conversation. You share the story, I listen closely, and together we figure out the smartest next step.",
        steps: [
          {
            title: "Talk",
            body: "A free consultation where you share what is happening and we map the smartest next move together.",
          },
          {
            title: "Review",
            body: "I dig into the IEP, 504, and evaluations so we both know exactly what your child has and needs.",
          },
          {
            title: "Prepare",
            body: "We build a clear plan and the right language before you ever walk into the room.",
          },
          {
            title: "Advocate",
            body: "I stand with you at the table, then hand you the tools to keep leading on your own.",
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "In plain language",
        title: "The IEP process,",
        accent: "decoded.",
        description:
          "The special education world is full of acronyms and meeting types, and parents are often expected to keep up without a guide. Here is a clear look at the pieces you are most likely to run into.",
        cards: [
          {
            title: "Initial evaluation",
            body: "The starting point. A full evaluation to determine whether your child has a disability and qualifies for special education services. It sets the foundation for everything that follows, so it is worth getting right.",
          },
          {
            title: "Reevaluation",
            body: "At least every three years, the team takes a fresh look at whether your child still qualifies and what their needs are now. This is your chance to update the full picture as your child grows and changes.",
          },
          {
            title: "IEP annual meeting",
            body: "Once a year, the team reviews progress on goals and revises the plan for the year ahead. It is the single most important meeting on the calendar, and preparation makes all the difference.",
          },
          {
            title: "Addendum meetings",
            body: "When something needs to change between annual reviews, an addendum meeting lets the team adjust the IEP without starting over. Useful for adding a service, refining an accommodation, or responding to a new need.",
          },
          {
            title: "Testing accommodations",
            body: "From extended time to small-group settings, these are the supports that let your child show what they actually know on classroom and standardized tests. Getting them documented correctly matters in school and well beyond it.",
          },
          {
            title: "Service delivery",
            body: "The how: how often, how long, where, and by whom your child's services are provided. Vague service delivery is one of the most common places a strong-sounding plan quietly falls short.",
          },
          {
            title: "FBA: Functional Behavior Assessment",
            body: "When behavior gets in the way of learning, an FBA digs into why it is happening, what triggers it, and what the student is getting from it. Good data here is the difference between guessing and actually helping.",
          },
          {
            title: "BIP: Behavior Intervention Plan",
            body: "Built from the FBA, a BIP lays out proactive strategies, supports, and how the team will respond, with a focus on teaching new skills rather than just managing behavior. This is work I know firsthand from my years as a Behavior Support Teacher.",
          },
        ],
      },
      {
        kind: "prose",
        eyebrow: "The most overlooked tool",
        title: "Why Prior Written Notice",
        accent: "matters.",
        /* Paired with a photograph: this sits between two dense card grids and
           was the one section on the page that read as a wall of text. */
        image: {
          src: "/images/consultation.jpg",
          alt: "A Resource Room educator talking a parent through paperwork across a desk.",
          kind: "photo",
        },
        body: [
          "Prior Written Notice, or PWN, is one of the most powerful and most overlooked parts of the entire process. Any time the school proposes or refuses to change your child's identification, evaluation, placement, or services, they are required to put it in writing: what they decided, why, what options they considered, and what they ruled out.",
          "A well-done PWN creates a clear record, holds everyone accountable to what was actually agreed, and protects your child if a disagreement ever comes up later. I make sure these decisions are documented the right way, every time.",
        ],
      },
      {
        kind: "faq",
        eyebrow: "Questions",
        title: "Advocacy questions,",
        accent: "answered.",
        items: [
          {
            q: "What exactly does an educational advocate do?",
            a: "An educational advocate helps you understand the special education process and stands with you while you secure the right supports for your child. That can mean reviewing records, preparing your case, decoding the jargon, and attending IEP or 504 meetings as your knowledgeable partner. The goal is a plan that fits your child, and a parent who feels confident instead of outnumbered.",
          },
          {
            q: "Are you an attorney?",
            a: "No. I am an educational advocate, not a lawyer, and I do not provide legal advice or legal representation. If your situation ever calls for an attorney, I will tell you honestly and help you understand when that step makes sense. Most families never get there, and a prepared advocate at the table is often exactly what was missing.",
          },
          {
            q: "Do you only work with Resource Room students?",
            a: "Not at all. Advocacy is open to any family, whether or not your child has ever attended one of our programs. Of course, if your child could also benefit from tutoring, test prep, or one of our specialized programs, we are a full learning center and happy to help there too.",
          },
          {
            q: "What does it cost?",
            a: "Your initial consultation is always free. Fees for record reviews, meeting preparation, attendance, and coaching are straightforward and depend on the level of support you need. We go over everything during your consultation so there are never any surprises.",
          },
          {
            q: "What areas do you serve?",
            a: "I serve Holly Springs, Apex, Cary, and the greater Triangle, with virtual support available more broadly. Many services can be done by video, so distance is rarely a barrier.",
          },
          {
            q: "How do we get started?",
            a: "Schedule a free consultation or call (984) 777-1244. We will talk through what is happening, and I will give you an honest read on whether I can help and what the right next step looks like.",
          },
        ],
      },
    ],
    disclaimer:
      "Resource Room Learning Center provides educational advocacy and consulting services. An educational advocate is not an attorney and does not provide legal advice or legal representation. Information on this page is general and is not a substitute for guidance tailored to your child's specific situation.",
  },
  {
    slug: "executive-functioning",
    name: "Executive Functioning Tutoring & Coaching",
    shortName: "Executive Functioning",
    category: "Tutoring Programs",
    tagline: "Building the skills students need to succeed in school and beyond",
    summary:
      "Weekly coaching in organization, planning, time management and follow-through — led by Samara, co-founder and certified EF coach.",
    intro:
      "Many students are bright and capable yet still struggle with organization, planning, time management, focus, and follow-through. We help close that gap with personalized coaching that builds real, lasting habits. Our goal is not just to finish tonight's homework. It is to teach students how to manage their own learning over time.",
    icon: "chart",
    accent: "blue",
    image: {
      src: "/images/tile-executive-functioning.png",
      alt: "Resource Room Executive Functioning coaching and support.",
      kind: "tile",
    },
    popular: true,
    stats: [
      { value: "Individualized", label: "No one-size-fits-all plans" },
      { value: "Whole-student", label: "Pairs with subject tutoring" },
      { value: "In-person & virtual", label: "Flexible scheduling" },
    ],
    highlights: [
      {
        title: "Organization & planning",
        body: "We help students organize materials, use planners, and create systems that make schoolwork manageable. Better organization means better follow-through and less stress at home.",
      },
      {
        title: "Time management",
        body: "Students learn to estimate how long work takes, prioritize tasks, break large assignments into smaller parts, and meet deadlines more consistently.",
      },
      {
        title: "Task initiation",
        body: "Many students know what to do but struggle to begin. We help them overcome procrastination, start with more confidence, and reduce avoidance.",
      },
      {
        title: "Focus & attention",
        body: "We teach practical strategies to stay on task, reduce distractions, and build stronger, more reliable study habits.",
      },
      {
        title: "Working memory",
        body: "Critical for following directions and solving problems. We build strategies to retain information, process instructions, and manage multi-step tasks.",
      },
      {
        title: "Self-monitoring & independence",
        body: "Students learn to check their own work, reflect on performance, recognize patterns, and make better academic decisions on their own.",
      },
      {
        title: "Problem-solving",
        body: "We help students work through obstacles without shutting down, building the flexibility to navigate challenges as they come.",
      },
      {
        title: "Emotional regulation",
        body: "We help students develop tools to manage frustration, stress, and academic anxiety so they can stay productive and engaged.",
      },
    ],
    includes: [
      "One 1-hour coaching session each week",
      "Two 15-minute video check-ins each week",
      "Consistent accountability and follow-through",
      "Strategies that carry across every subject",
      "Coaching led by a certified executive functioning coach",
      "Optional pairing with subject tutoring and homework help",
    ],
    audience: [
      "Students who have trouble starting assignments",
      "Students who struggle to stay organized or remember directions",
      "Students who lose track of homework and deadlines",
      "Students who struggle with planning ahead and multi-step tasks",
      "Students who have difficulty staying focused or controlling frustration",
      "Students from elementary through high school, including AP coursework",
    ],
    blocks: [
      {
        kind: "prose",
        eyebrow: "The basics",
        title: "What is executive",
        accent: "functioning?",
        body: [
          "Executive functioning is the set of mental skills that help students plan, organize, start tasks, stay focused, manage time, remember directions, solve problems, and regulate emotions.",
          "These skills shape performance in every subject and play a major role in school success. When they lag behind a student's actual ability, the result is often frustration for everyone — capable students who cannot show what they know.",
        ],
      },
      {
        kind: "schedule",
        eyebrow: "The weekly rhythm",
        title: "Three touch points out of five school",
        accent: "days.",
        description:
          "Days are scheduled to fit your family. The structure stays the same: one session, two check-ins, every week.",
        groups: [
          {
            title: "A week of coaching",
            rows: [
              {
                label: "Check-in · 15 minutes",
                value: "Set the week up right",
              },
              {
                label: "Between sessions",
                value: "Independent practice",
                note: "Student applies the strategies",
              },
              {
                label: "Session · 1 hour",
                value: "Deep work on skills and assignments",
              },
              {
                label: "Between sessions",
                value: "Independent practice",
                note: "Student applies the strategies",
              },
              {
                label: "Check-in · 15 minutes",
                value: "Close the week strong",
              },
            ],
            note: "We hold the accountability, track the follow-through, and keep your student moving, so you can step out of the homework-enforcer role and simply be a parent again.",
          },
        ],
      },
      {
        kind: "pricing",
        eyebrow: "Coached by a certified EF coach",
        title: "Executive functioning",
        accent: "coaching.",
        tiers: [
          {
            name: "Executive Functioning Coaching",
            price: "$100",
            cadence: "/ week",
            badge: "Get started today",
            meta: "Led by Samara, co-founder and certified EF coach",
            featured: true,
            features: [
              "One 1-hour coaching session each week",
              "Two 15-minute video check-ins each week",
              "Consistent accountability and follow-through",
              "Strategies that carry across every subject",
            ],
            note: "Requires a 3-month commitment, paid weekly by recurring invoice. Reserve your spot with your first week today; the remaining 11 weeks are billed weekly.",
          },
        ],
      },
      {
        kind: "checklist",
        eyebrow: "The payoff",
        title: "How it helps",
        accent: "students.",
        description:
          "As these skills grow, students gain more than better grades. They build confidence and lifelong habits that carry into high school, college, work, and daily life.",
        items: [
          "Complete homework more consistently",
          "Stay more organized",
          "Improve focus and productivity",
          "Manage time more effectively",
          "Reduce stress around schoolwork",
          "Become more independent learners",
          "Build stronger confidence",
          "Carry skills beyond the classroom",
        ],
      },
      {
        kind: "faq",
        eyebrow: "Questions",
        title: "Questions families",
        accent: "ask.",
        items: [
          {
            q: "Is this tutoring or coaching?",
            a: "It is both, and the blend is the point. We coach the underlying skills like planning, focus, and time management while working through real, current schoolwork. Students practice the strategies on the assignments actually in front of them, which is what makes the habits stick.",
          },
          {
            q: "What ages and grades do you work with?",
            a: "We support students across grade levels, from elementary through high school, and tailor the strategies to the student's age and the specific demands they are facing. The approach for a fifth grader looks different from the approach for a junior managing AP courses.",
          },
          {
            q: "Can this be combined with subject tutoring?",
            a: "Yes, and many families do exactly that. Because we offer tutoring across subjects under one roof, we can weave executive functioning support into math, reading, or any subject your student is working on, so the skills and the content reinforce each other.",
          },
          {
            q: "Do you offer in-person and virtual sessions?",
            a: "Both, with scheduling built around school, sports, and family commitments. The coaching works well in either format.",
          },
          {
            q: "How do we get started?",
            a: "It begins with a free consultation. We learn about your student, the challenges they are facing, and your goals, then map out a plan that fits. There is no cost and no obligation to start that conversation.",
          },
        ],
      },
    ],
  },
  {
    slug: "summer-bridge",
    name: "Summer Bridge Tutoring Programs",
    shortName: "Summer Bridge",
    category: "Tutoring Programs",
    tagline: "Summer is your child's best chance to reset",
    summary:
      "Whether they need to catch up, stay sharp, or get ahead — a summer plan built around the student in front of us, not a generic workbook.",
    intro:
      "During the school year, students who are behind are always chasing new material while still missing older skills. That cycle creates stress, frustration, and a gap that only widens. Summer breaks that cycle. At Resource Room, Summer Bridge isn't a generic workbook or a one-size-fits-all packet. We look at the student in front of us, figure out exactly what they need, and build a plan that sends them into the next school year more confident, more prepared, and more independent.",
    icon: "sun",
    accent: "sun",
    image: {
      src: "/images/tile-summer-bridge.png",
      alt: "Resource Room Summer Bridge tutoring — prevent the summer slide.",
      kind: "tile",
    },
    popular: true,
    stats: [
      { value: "100+", label: "Five-star reviews", stars: true },
      { value: "2022", label: "Holly Springs Business of the Year" },
      { value: "Since 2015", label: "Trusted by local families" },
    ],
    highlights: [
      {
        title: "Reading & writing",
        body: "Phonics, fluency, comprehension, grammar, essay writing, and written expression at every level.",
      },
      {
        title: "Math",
        body: "Number sense, math facts, fractions, pre-algebra, algebra, geometry, or course-specific review and preview.",
      },
      {
        title: "Executive functioning",
        body: "Organization, planning, task initiation, time management, study habits, and building academic independence.",
      },
      {
        title: "Next-year preview",
        body: "Get ahead on upcoming material so your child walks into the first day of school with confidence, not anxiety.",
      },
    ],
    includes: [
      "A consultation reviewing last year, current skills, strengths and goals",
      "A plan recommended for your student, not a preset formula",
      "Reading, writing and math skill work at every level",
      "Executive functioning support where it is the real obstacle",
      "Preview of next year's material",
      "Flexible packages so you choose the level of support that makes sense",
    ],
    audience: [
      "The student who struggled and needs to rebuild foundational skills",
      "The student who excelled and wants to stay sharp or work ahead",
      "The disorganized student who knows the material but can't get the work done",
      "Neurodiverse learners with ADHD, autism, learning differences, IEPs or 504 plans",
    ],
    blocks: [
      {
        kind: "cards",
        eyebrow: "Every student is different",
        title: "Every student comes to summer with a different",
        accent: "story.",
        cards: [
          {
            title: "The student who struggled",
            body: "Had a rough year. Falling behind in reading, writing, or math. Summer is the chance to slow down, rebuild foundational skills, and start the next year with momentum instead of anxiety.",
            icon: "heart",
          },
          {
            title: "The student who excelled",
            body: "Doing well and wants to stay sharp. Summer is a great time to preview next year's material, explore advanced work, or strengthen skills that don't get enough attention during the school year.",
            icon: "sparkle",
          },
          {
            title: "The disorganized student",
            body: "Knows the material but can't get the work done. Struggles with planning, starting tasks, managing time, or staying organized. Summer is the window to build executive functioning skills without the daily pressure of school.",
            icon: "chart",
          },
          {
            title: "The neurodiverse learner",
            body: "Students with ADHD, autism, learning differences, IEPs, or 504 plans who need instruction that's structured, patient, and responsive to how they actually learn. Summer gives us room to work at their pace.",
            icon: "compass",
          },
        ],
        wide: true,
      },
      {
        kind: "pricing",
        eyebrow: "A practical starting point",
        title: "Ten hours is a strong place to",
        accent: "begin.",
        description:
          "For many students, 10 hours of summer tutoring is enough time to review key skills, reinforce important concepts, and prepare for the next school year without overwhelming your child during their break.",
        tiers: [
          {
            name: "Summer Bridge Program",
            price: "$699",
            wasPrice: "$759",
            badge: "On sale",
            meta: "A practical starting point at 10 hours",
            featured: true,
            features: [
              "Consultation to identify exactly what your student needs",
              "A plan built around their gaps, strengths and goals",
              "Reading, writing, math or executive functioning focus",
              "Next-year preview where it helps most",
            ],
            note: "For students with more significant gaps or executive functioning challenges, families may choose a more intensive plan. We offer flexible packages so you can choose the level of support that actually makes sense.",
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "By grade level",
        title: "Summer Bridge by",
        accent: "grade level.",
        cards: [
          {
            title: "Elementary (K–5)",
            body: "Foundational reading, writing, and math skills. Phonics, decoding, fluency, comprehension, spelling, number sense, math facts, fractions, word problems, and written expression.",
            icon: "book",
          },
          {
            title: "Middle School (6–8)",
            body: "Core skill reinforcement plus preparation for increased academic demands. Reading comprehension, writing structure, math foundations, algebra readiness, organization, and study habits.",
            icon: "chart",
          },
          {
            title: "High School (9–12)",
            body: "Skill strengthening, advanced course preparation, essay writing, math review, science prep, executive functioning, and light SAT, ACT, or PSAT preparation.",
            icon: "cap",
          },
        ],
      },
      {
        kind: "prose",
        eyebrow: "Not sure what your child needs?",
        title: "That's what the consultation is",
        accent: "for.",
        body: [
          "One of the hardest parts for parents is knowing what kind of help to choose. Does your child need remediation? Enrichment? Executive functioning support? A preview of next year's material? A combination?",
          "During your Summer Bridge consultation, we talk through your child's previous school year, current skills, strengths, frustrations, and goals for the fall. Then we recommend a plan that fits, so your family invests in the kind of support that will actually make a difference.",
        ],
      },
    ],
  },
];

/**
 * The six cards in the home page "What Families Are Booking Now" grid, in the
 * order the live site shows them.
 */
export const popularOfferings: {
  title: string;
  category: string;
  body: string;
  href: string;
  icon: IconName;
  image: ProgramImage;
}[] = [
  {
    title: "ABA Support in an Educational Setting",
    category: "Structured Daytime Learning",
    body: "Behavioral support delivered inside a real learning environment, where the skills need to hold up.",
    href: "/programs/aba-services",
    icon: "heart",
    image: {
      src: "/images/tile-aba.png",
      alt: "Resource Room and POPS ABA partnership — ABA support in an educational setting.",
      kind: "tile",
    },
  },
  {
    title: "Homeschool Co-Op in Holly Springs, NC",
    category: "Structured Daytime Learning",
    body: "Small-group classes for middle and high school homeschool students, from $425 per semester.",
    href: "/programs/homeschool-co-op",
    icon: "home",
    image: {
      src: "/images/tile-homeschool-coop.jpg",
      alt: "Resource Room Homeschool Co-Op for middle and high school students.",
      kind: "tile",
    },
  },
  {
    title: "Executive Functioning Coaching and Support",
    category: "Tutoring Programs",
    body: "One session and two check-ins every week, $100 a week, led by a certified EF coach.",
    href: "/programs/executive-functioning",
    icon: "chart",
    image: {
      src: "/images/tile-executive-functioning.png",
      alt: "Resource Room Executive Functioning coaching and support.",
      kind: "tile",
    },
  },
  {
    title: "STEM Themed Camps",
    category: "STEAM Programs",
    body: "Full weeks and single days for grades K-6. Hands-on science, robotics, coding and outdoor time.",
    href: "/programs/camps",
    icon: "sun",
    image: {
      src: "/images/tile-stem-camps.png",
      alt: "Resource Room track-out and summer camps — STEM themed fun.",
      kind: "tile",
    },
  },
  {
    title: "SAT Test Prep in Holly Springs, NC",
    category: "Test Prep Programs",
    body: "Diagnostic-driven SAT preparation focused on the sections actually costing points.",
    href: "/programs/sat-act-prep",
    icon: "target",
    image: {
      src: "/images/tile-sat-prep.jpg",
      alt: "Resource Room SAT Test Prep — digital SAT ready.",
      kind: "tile",
    },
  },
  {
    title: "Summer Bridge Tutoring Programs",
    category: "Tutoring Programs",
    body: "A summer plan built around your student — catch up, stay sharp, or get ahead.",
    href: "/programs/summer-bridge",
    icon: "pencil",
    image: {
      src: "/images/tile-summer-bridge.png",
      alt: "Resource Room Summer Bridge tutoring — prevent the summer slide.",
      kind: "tile",
    },
  },
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}

export const featuredPrograms = programs.filter((program) => program.featured);
