import type { IconName } from "@/components/icons";

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
  accent: "gold" | "blue";
  /** Shown as the three-up feature row on the program page. */
  highlights: { title: string; body: string }[];
  /** "What's included" checklist. */
  includes: string[];
  /** "Who it's for" list. */
  audience: string[];
  /** Programs featured in the "Popular Programs" grid on the home page. */
  popular?: boolean;
  /** Programs featured in the 2x2 grid and the quick-link pill row. */
  featured?: boolean;
  /** Set when the program lives on its own site. */
  externalUrl?: string;
};

export const programs: Program[] = [
  {
    slug: "tutoring",
    name: "Tutoring Programs",
    shortName: "Tutoring",
    category: "Tutoring Programs",
    tagline: "Private one-to-one instruction for every grade level",
    summary:
      "Private one-to-one instruction for all grade levels, K-12, including AP Math and Science. Every session is built around the student in front of us.",
    intro:
      "Tutoring at Resource Room starts with the student, not the curriculum. We identify exactly where a learner is, where they need to be, and build a plan that closes the gap — whether that means shoring up foundational reading or working through AP Calculus problem sets.",
    icon: "pencil",
    accent: "blue",
    featured: true,
    highlights: [
      {
        title: "Every subject, K-12",
        body: "Reading, writing, math, science and social studies, through AP Math and AP Science courses.",
      },
      {
        title: "One-to-one, always",
        body: "Sessions are private. No group rates, no split attention, no waiting your turn for help.",
      },
      {
        title: "Licensed educators",
        body: "Instruction comes from classroom-experienced, licensed teachers who know the standards.",
      },
    ],
    includes: [
      "An initial consultation to identify goals and gaps",
      "A personalized instruction plan reviewed as the student progresses",
      "One-to-one sessions with a licensed educator",
      "Homework, test and project support alongside skill building",
      "Ongoing communication with families about progress",
    ],
    audience: [
      "Students who need to catch up in a specific subject",
      "Students who are ready to move ahead of their current class",
      "AP and honors students preparing for exams",
      "Families looking for consistent, year-round academic support",
    ],
  },
  {
    slug: "camps",
    name: "Track-Out, Summer & Teacher-Workday Camps",
    shortName: "Camps",
    category: "STEAM Programs",
    tagline: "Fun, engaging STEAM activities all year long",
    summary:
      "Camps for track-out weeks, summer, and teacher workdays. Curriculum-based STEAM activities that keep learning going when school is out.",
    intro:
      "When school is out, learning does not have to stop — and it definitely does not have to feel like school. Our camps pair hands-on STEAM projects with the structure of a curriculum-based program, so students stay engaged and families have coverage on track-out weeks, teacher workdays and all summer.",
    icon: "sun",
    accent: "gold",
    featured: true,
    highlights: [
      {
        title: "Curriculum based",
        body: "Camp days follow standards-aligned STEAM curriculum, not filler activities.",
      },
      {
        title: "Built for the NC calendar",
        body: "Track-out weeks, teacher workdays and summer sessions, scheduled around year-round schools.",
      },
      {
        title: "Small groups",
        body: "Group sizes stay small so every camper gets attention from an instructor.",
      },
    ],
    includes: [
      "Full-day and partial-week camp options",
      "Themed STEAM projects that build across the week",
      "Instruction from licensed educators, not seasonal staff",
      "Track-out, teacher workday and summer scheduling",
    ],
    audience: [
      "Year-round school families needing track-out coverage",
      "Families looking for summer programming with academic value",
      "Students who learn best through hands-on projects",
      "Parents who need reliable teacher-workday care",
    ],
  },
  {
    slug: "sat-act-prep",
    name: "SAT & ACT Test Prep",
    shortName: "SAT / ACT Prep",
    category: "Test Prep Programs",
    tagline: "Professional test prep in Holly Springs, NC",
    summary:
      "Targeted SAT and ACT preparation that starts with a diagnostic, then focuses practice where it moves the score most.",
    intro:
      "Score gains come from working on the right things. We start with a diagnostic to find which sections and question types are actually costing points, then build a prep plan around them — combining content review, timing strategy and repeated practice under real test conditions.",
    icon: "target",
    accent: "gold",
    popular: true,
    featured: true,
    highlights: [
      {
        title: "Diagnostic first",
        body: "We measure before we teach, so prep time goes to the sections that need it.",
      },
      {
        title: "Content and strategy",
        body: "Students learn the math and grammar behind the questions, plus how to pace a real section.",
      },
      {
        title: "Practice under pressure",
        body: "Timed practice sections build the stamina the actual test day demands.",
      },
    ],
    includes: [
      "A full diagnostic SAT or ACT to establish a baseline",
      "One-to-one prep sessions targeting the weakest sections",
      "Section-level pacing and test-day strategy",
      "Timed practice tests with review of every missed question",
      "Guidance on test dates and how many times to sit the exam",
    ],
    audience: [
      "Juniors and seniors preparing for college applications",
      "Sophomores getting an early start on testing",
      "Students retaking a test to raise a specific section score",
      "Students deciding between the SAT and the ACT",
    ],
  },
  {
    slug: "pathways-academy",
    name: "Pathways Academy",
    shortName: "Pathways Academy",
    category: "Private High School",
    tagline: "A private high school for neurodiverse learners with autism",
    summary:
      "A full private high school program designed for neurodiverse learners with autism, with its own campus, staff and curriculum.",
    intro:
      "Pathways Academy is our private high school for neurodiverse learners with autism. It runs as its own program with dedicated staff, a tailored academic path and a focus on the life and executive functioning skills that carry students beyond graduation.",
    icon: "compass",
    accent: "blue",
    featured: true,
    externalUrl: "https://pathways.resourceroom.com",
    highlights: [
      {
        title: "Built for neurodiverse learners",
        body: "The whole program — pacing, environment and instruction — is designed for students with autism.",
      },
      {
        title: "A full high school path",
        body: "Academics, executive functioning and life skills together, not academics alone.",
      },
      {
        title: "Small by design",
        body: "Enrollment stays small so instruction can stay individualized.",
      },
    ],
    includes: [
      "A full private high school academic program",
      "Individualized pacing and instruction",
      "Executive functioning and life skills instruction",
      "Transition planning toward life after high school",
    ],
    audience: [
      "Neurodiverse high school students with autism",
      "Families seeking a smaller, structured school environment",
      "Students who need academics and life skills taught together",
    ],
  },
  {
    slug: "homeschool-co-op",
    name: "Homeschool Co-Op",
    shortName: "Homeschool Co-Op",
    category: "Structured Daytime Learning",
    tagline: "Structured daytime learning in Holly Springs, NC",
    summary:
      "A structured daytime program for homeschool families — consistent instruction, real classmates, and a schedule you can plan around.",
    intro:
      "Homeschooling gives families control over how their students learn. Our co-op adds what is hardest to build at home: a consistent daytime schedule, instruction from licensed educators, and a group of classmates to learn alongside.",
    icon: "home",
    accent: "blue",
    popular: true,
    highlights: [
      {
        title: "Structured daytime hours",
        body: "A predictable weekly schedule families can build the rest of their homeschool plan around.",
      },
      {
        title: "Licensed instruction",
        body: "Core subjects taught by licensed educators with classroom experience.",
      },
      {
        title: "Real peer learning",
        body: "Students work in groups, present, and collaborate with classmates their own age.",
      },
    ],
    includes: [
      "Structured daytime instruction on a set weekly schedule",
      "Core academic subjects taught by licensed educators",
      "Group projects and peer collaboration",
      "Coordination with each family's homeschool plan",
    ],
    audience: [
      "Homeschool families wanting structured outside instruction",
      "Students who want peers and group learning",
      "Parents balancing homeschooling with work schedules",
    ],
  },
  {
    slug: "aba-services",
    name: "ABA Support in an Educational Setting",
    shortName: "ABA Services",
    category: "Structured Daytime Learning",
    tagline: "Applied behavior analysis support inside a learning environment",
    summary:
      "ABA support delivered in an educational setting, so behavioral goals and academic goals are worked on in the same place.",
    intro:
      "Our ABA support runs inside an educational setting rather than a clinic. That means the skills a student is building — attention, transitions, communication, self-regulation — are practiced in the same environment where they need to hold up: a learning environment with instruction, peers and routine.",
    icon: "heart",
    accent: "gold",
    popular: true,
    highlights: [
      {
        title: "In an educational setting",
        body: "Support happens where learning happens, so skills transfer to real academic demands.",
      },
      {
        title: "Individualized goals",
        body: "Programming is built around each student's specific goals and reviewed as they progress.",
      },
      {
        title: "Family communication",
        body: "Families stay looped in on goals, progress and what to reinforce at home.",
      },
    ],
    includes: [
      "ABA support delivered within a structured learning day",
      "Individualized behavioral and academic goals",
      "Data-informed progress review",
      "Ongoing communication with families",
    ],
    audience: [
      "Students who benefit from behavioral support during the school day",
      "Families seeking ABA support tied to academic progress",
      "Students working on transitions, attention and self-regulation",
    ],
  },
  {
    slug: "college-prep",
    name: "College Prep & Admissions Support",
    shortName: "College Prep",
    category: "College Advisement",
    tagline: "Professional support through the entire application process",
    summary:
      "SAT and ACT tutoring, college admissions advisement, essay writing and Common App support — start to submitted.",
    intro:
      "The college application is a long process with a lot of moving parts: testing, school lists, essays, the Common App, deadlines. We work with students through all of it, so the process stays organized and the final application actually sounds like the student who wrote it.",
    icon: "cap",
    accent: "gold",
    featured: true,
    highlights: [
      {
        title: "Admissions advisement",
        body: "Building a realistic, well-balanced school list and a plan for each deadline.",
      },
      {
        title: "Essay writing",
        body: "Personal statements and supplements developed with the student, in the student's voice.",
      },
      {
        title: "Common App support",
        body: "Walking through the application itself so nothing gets missed or rushed.",
      },
    ],
    includes: [
      "College list building and admissions advisement",
      "Professional SAT and ACT tutoring",
      "Personal statement and supplemental essay support",
      "Common App walkthrough and deadline tracking",
      "Guidance on recommendations and application timelines",
    ],
    audience: [
      "Juniors beginning the college search",
      "Seniors working through applications and essays",
      "Families wanting an experienced second set of eyes on the process",
    ],
  },
  {
    slug: "iep-504-advocate",
    name: "IEP & 504 Advocacy",
    shortName: "IEP & 504 Advocate",
    category: "Family Advocacy",
    tagline: "An experienced educator on your side of the table",
    summary:
      "Preparation, documentation review and in-meeting advocacy so families walk into IEP and 504 meetings knowing what to ask for.",
    intro:
      "IEP and 504 meetings are easier when someone at the table has sat on the other side of it. Our advocates are career educators who know how these plans are written, what accommodations are realistic to request, and how to make sure the plan a family agrees to is the plan their student actually receives.",
    icon: "shield",
    accent: "blue",
    highlights: [
      {
        title: "Meeting preparation",
        body: "We review the current plan and evaluations, then build the list of goals to raise.",
      },
      {
        title: "In-meeting advocacy",
        body: "An experienced educator attends alongside you and speaks to the specifics.",
      },
      {
        title: "Follow-through",
        body: "Support after the meeting to confirm the agreed accommodations are being delivered.",
      },
    ],
    includes: [
      "Review of existing IEP or 504 documentation and evaluations",
      "Preparation sessions before the meeting",
      "Attendance and advocacy during IEP or 504 meetings",
      "Plain-language explanation of rights, options and next steps",
      "Follow-up support on implementation",
    ],
    audience: [
      "Families preparing for an initial IEP or 504 meeting",
      "Families who feel an existing plan is not being followed",
      "Parents who want to understand their options before signing",
    ],
  },
];

/** Additional home-page cards that are offerings within the programs above. */
export const popularOfferings: {
  title: string;
  category: string;
  body: string;
  href: string;
  icon: IconName;
}[] = [
  {
    title: "ABA Support in an Educational Setting",
    category: "Structured Daytime Learning",
    body: "Behavioral support delivered inside a real learning environment, where the skills need to hold up.",
    href: "/programs/aba-services",
    icon: "heart",
  },
  {
    title: "Homeschool Co-Op in Holly Springs, NC",
    category: "Structured Daytime Learning",
    body: "Structured daytime instruction, licensed educators and real classmates for homeschool families.",
    href: "/programs/homeschool-co-op",
    icon: "home",
  },
  {
    title: "Executive Functioning Coaching and Support",
    category: "Tutoring Programs",
    body: "Planning, organization, time management and follow-through — coached the same way we teach any other skill.",
    href: "/programs/tutoring",
    icon: "chart",
  },
  {
    title: "STEM Themed Summer Camps",
    category: "STEAM Programs",
    body: "Hands-on, themed summer camps built on standards-aligned STEAM curriculum.",
    href: "/programs/camps",
    icon: "sun",
  },
  {
    title: "SAT Test Prep in Holly Springs, NC",
    category: "Test Prep Programs",
    body: "Diagnostic-driven SAT preparation focused on the sections actually costing points.",
    href: "/programs/sat-act-prep",
    icon: "target",
  },
  {
    title: "Summer Bridge Tutoring Programs",
    category: "Tutoring Programs",
    body: "Summer sessions that hold ground over the break and get students ready for the next grade level.",
    href: "/programs/tutoring",
    icon: "pencil",
  },
];

export function getProgram(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}

export const featuredPrograms = programs.filter((program) => program.featured);
