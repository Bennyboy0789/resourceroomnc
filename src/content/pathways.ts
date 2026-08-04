/**
 * Pathways Academy page content, transcribed verbatim from
 * pathways.resourceroom.com as it stood on 3 August 2026.
 *
 * Joe asked for this page to look and read exactly like the standalone site it
 * replaces, so nothing here is rewritten or trimmed — the wording, the order of
 * the sections and the order of the items inside them all match the original.
 * The only edits are to links: the old site sent visitors out to
 * resourceroomnc.com and back again, which is the round trip this merge exists
 * to remove, so those are now ordinary on-site paths.
 */

export const pathwaysHero = {
  badge: "Holly Springs, NC  ·  Grades 9–12",
  /* The headline is set as three parts so "different" can carry the italic and
     the gold underline it has on the original. */
  titleLead: "A",
  titleEmphasis: "different",
  titleRest: "kind\nof high school.",
  subtitle: "A meaningful path to graduation.",
  body: "Pathways Academy is a private diploma-granting high school for neurodiverse teens who thrive in smaller settings, with individualized support, real-world learning, and educators who genuinely understand how they learn.",
  primaryCta: { label: "Schedule a Consultation", href: "/contact" },
  secondaryCta: { label: "Learn More", href: "#about" },
};

/** The ecosystem strip directly under the hero. */
export const pathwaysEcosystemStrip = {
  title: "Part of The Resource Room Ecosystem",
  subtitle: "Full-service educational support, all under one roof in Holly Springs, NC",
  links: [
    { label: "Private Tutoring", href: "/programs/tutoring" },
    { label: "SAT / ACT Prep", href: "/programs/sat-act-prep" },
    { label: "STEM Programs", href: "/programs/camps" },
    { label: "Homeschool Co-Op", href: "/programs/homeschool-co-op" },
    { label: "ABA Services", href: "/programs/aba-services" },
    { label: "College Prep", href: "/programs/college-prep" },
  ],
};

export const pathwaysWhoFor = {
  eyebrow: "Who Pathways is for",
  titleLead: "Built for students who need",
  titleEmphasis: "a better environment",
  body: "Traditional high school wasn't designed for every learner. For neurodiverse students, large classrooms, rigid pacing, and limited support create frustration rather than growth. Pathways was built to solve that.",
  items: [
    "Students with ADHD, autism, anxiety, or learning differences",
    "Students who feel overwhelmed or disengaged in traditional settings",
    "Students who need individualized pacing toward diploma completion",
    "Students who benefit from smaller, structured learning environments",
    "Students needing executive functioning and organizational support",
    "Homeschool students ready for a more structured academic program",
  ],
  callout: {
    label: "Diploma-granting program",
    body: "Students at Pathways Academy work toward earning a private high school diploma in an environment built around how they actually learn, not how they're expected to perform.",
  },
};

export const pathwaysDifference = {
  titleLead: "What makes",
  titleEmphasis: "Pathways",
  titleRest: "different",
  body: "We don't separate academics from development. Every part of the school day builds both: simultaneously, intentionally, and without forcing students to choose between the two.",
  items: [
    "Small cohort model: intimate, calm, focused learning environment",
    "Licensed educators with real special education classroom experience",
    "Social-emotional learning built into the daily structure, not an add-on",
    "Project-based learning connecting academics to the real world",
    "Executive functioning coaching built into every school day",
    "Direct access to the full Resource Room support ecosystem",
  ],
};

export type PathwaysHighlight = {
  icon: "users" | "book" | "check" | "target" | "sparkle" | "cap";
  title: string;
  body: string;
};

export const pathwaysHighlights = {
  eyebrow: "Program highlights",
  title: "What students experience\nat Pathways every day",
  body: "Pathways isn't a school that happens to serve neurodiverse students. It's a school specifically designed for them, from the structure of the day to the way instruction is delivered.",
  items: [
    {
      icon: "users",
      title: "Small group learning",
      body: "Individualized attention, steady support, and a calmer learning environment where every student is known, not just a number in a roster.",
    },
    {
      icon: "book",
      title: "Personalized academic pathways",
      body: "Core subjects (English, writing, math, science, history) delivered at each student's level and scaled to readiness, ability, and long-term goals.",
    },
    {
      icon: "check",
      title: "Executive function support",
      body: "Daily help with organization, planning, task initiation, and follow-through: the foundational skills that make all other academic learning possible.",
    },
    {
      icon: "target",
      title: "Social development",
      body: "Structured interaction that builds communication, collaboration, and self-advocacy, woven into daily routines, not reserved for occasional pull-out sessions.",
    },
    {
      icon: "sparkle",
      title: "Hands-on project learning",
      body: "Meaningful projects that help students apply academic skills in real situations, building genuine confidence alongside genuine competence.",
    },
    {
      icon: "cap",
      title: "Real-world readiness",
      body: "Career exploration, community experiences, independence skills, and future planning, because graduation is a beginning, not just an endpoint.",
    },
  ] satisfies PathwaysHighlight[],
};

export const pathwaysEcosystem = {
  eyebrow: "The Resource Room ecosystem",
  titleLead: "Pathways is the intensive option\nwithin a",
  titleEmphasis: "complete",
  titleRest: "support system",
  body: "Most schools offer one program. Resource Room offers a complete ecosystem, coordinated support across academics, behavior, executive functioning, communication, and clinical services. Families don't have to piece it together alone.",
  cards: [
    {
      title: "Pathways Academy",
      body: "Private diploma-granting high school for neurodiverse learners. Small cohort, licensed educators, full-day structured support with SEL built into every day.",
      href: null,
      here: true,
    },
    {
      title: "Private Tutoring",
      body: "One-on-one K–12 tutoring across all subjects. Pathways students access individual academic support whenever it's needed, fully coordinated with their school program.",
      href: "/programs/tutoring",
      here: false,
    },
    {
      title: "Homeschool Co-Op",
      body: "A structured middle ground for families not yet ready for full private school. Often the natural gateway into Pathways for students transitioning from homeschool.",
      href: "/programs/homeschool-co-op",
      here: false,
    },
    {
      title: "ABA Services, POPS ABA",
      body: "Applied Behavior Analysis delivered in coordination with Pathways, targeting communication, emotional regulation, task initiation, and independence where learning actually happens.",
      href: "/programs/aba-services",
      here: false,
    },
    {
      title: "STEM Programs",
      body: "Camps, enrichment, and hands-on science and engineering programs that reinforce the problem-solving skills that transfer across every subject area.",
      href: "/programs/camps",
      here: false,
    },
    {
      title: "College & Test Prep",
      body: "SAT, ACT, AP prep, and college readiness support available when Pathways students are ready to take the next step toward higher education.",
      href: "/programs/sat-act-prep",
      here: false,
    },
  ],
};

export const pathwaysJourney = {
  eyebrow: "Your family's journey",
  titleLead: "How families",
  titleEmphasis: "find their way",
  titleRest: "to Pathways",
  body: "There is no single path to enrollment. What matters is that the right support is available when your student is ready for it, and we guide you every step of the way.",
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
};

export const pathwaysFunding = {
  eyebrow: "Tuition & funding",
  titleLead: "Making Pathways",
  titleEmphasis: "accessible",
  titleRest: "for your family",
  body: "Pathways Academy's full tuition is $24,000 per year, but most families pay significantly less. North Carolina offers two grant programs that can cover most or all of tuition. We help every family navigate both.",
  grants: [
    {
      amount: "$17,000",
      label: "ESA+ Grant (max, autism diagnosis)",
      title: "NC Opportunity for Students with Disabilities",
      body: "North Carolina's ESA+ program provides funding for students with qualifying disabilities. Students with an autism spectrum diagnosis may receive up to $17,000 annually toward private school tuition. We guide families through the application and waitlist process.",
      dark: false,
    },
    {
      amount: "$7,000+",
      label: "Opportunity Scholarship (income-tiered)",
      title: "NC School Choice Scholarship",
      body: "North Carolina's Opportunity Scholarship is available to any family pursuing school choice, awarded on an income-tiered basis. Unlike ESA+, there is no waitlist. Combined with ESA+, many families can cover the full cost of Pathways tuition.",
      dark: true,
    },
  ],
  callout: {
    title: "We help you access every dollar available",
    body: "Many families don't know these grants exist, or don't know how to apply. We walk you through both programs, help with paperwork, and work with your family to structure tuition in a way that works. A consultation is always free, and we will never place a student in a program that isn't the right fit.",
  },
};

export const pathwaysDiploma = {
  title: "About the Pathways Diploma",
  paragraphs: [
    "Pathways Academy awards a **private high school diploma** upon completion of the program. A private diploma does not preclude students from entering college. Graduates may apply to two-year and four-year institutions, and students who are academically ready have the opportunity to enroll in **Wake Technical Community College** courses during their senior year, earning college credit before graduation.",
    "Every student's path after Pathways looks different. For some, that means a four-year university. For others, a community college, a trade program, or entering the workforce with real skills and genuine confidence. Our goal is to prepare students for what comes next, whatever that looks like for them, not to funnel every graduate into a single definition of success.",
  ],
};

export const pathwaysCoordinated = {
  eyebrow: "Coordinated care",
  titleLead: "A complete support system,",
  titleEmphasis: "working together",
  titleRest: "for your student",
  body: "Most families of neurodiverse students spend years coordinating between disconnected providers. At Resource Room, every service communicates, collaborates, and aligns around one shared goal, your student's growth.",
  /** The radial diagram: the student at the top, services around the mark. */
  nodes: [
    { title: "Your", strong: "Student", meta: "" },
    { title: "Academic", strong: "Support", meta: "Tutoring · Test Prep" },
    { title: "Behavioral", strong: "Support", meta: "ABA · Regulation" },
    { title: "Clinical", strong: "Evaluation", meta: "Psych · Diagnostic" },
    { title: "Executive", strong: "Functioning", meta: "Planning · Organization" },
    { title: "Speech &", strong: "Communication", meta: "Language · Social" },
  ],
  quote: "Every service communicates. Every specialist aligns. Nothing falls through the cracks.",
  points: [
    {
      title: "Coordinated communication",
      body: "Every provider in our network communicates directly with Pathways educators. No information gets lost between appointments, sessions, and school days.",
    },
    {
      title: "Unified goals",
      body: "Academic, behavioral, and clinical support all align around the same objectives for your student, developed collaboratively, not in isolation.",
    },
    {
      title: "One point of contact",
      body: "You don't coordinate between five separate providers. We do. One team, one phone call, one plan, so you can focus on your family.",
    },
  ],
};

export const pathwaysCta = {
  eyebrow: "Get started",
  titleLead: "Your student deserves a school",
  titleEmphasis: "built for how they learn",
  body: "Consultations are always free. We will never recommend a program that isn't the right fit, and we will help you navigate every funding option available to your family.",
};
