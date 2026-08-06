import type { ProgramBlock, ProgramImage, ProgramStat } from "@/content/programs";

/**
 * Product pages — the individual, buyable things inside a program.
 *
 * These sit at /programs/[program]/[product]. The URL shape is the one Joe
 * specified for camps (/programs/camps/track-out-teacher-workday), and the
 * same shape is used for every other product so a family never has to learn
 * two patterns.
 *
 * Copy is transcribed from the live product pages in docs/live-content/ (and,
 * for Summer Camps, from resourceroomnc.com/product/stem/, which the snapshot
 * folder was missing).
 *
 * `catalogSlug` is the join to Stripe: it matches `metadata.woo_slug` on the
 * seeded product, which is what puts a real add-to-cart box on the page. A
 * product with no match still renders — it just shows the consultation CTA
 * instead of a buy box, so an unseeded catalog never breaks a page.
 */
export type ProductPage = {
  slug: string;
  programSlug: string;
  catalogSlug: string | null;
  name: string;
  /** Card and breadcrumb label. */
  shortName: string;
  tagline: string;
  summary: string;
  /** Published range, shown until Stripe supplies the live figure. */
  priceLabel?: string;
  image: ProgramImage;
  intro: string[];
  stats?: ProgramStat[];
  highlights?: { title: string; body: string }[];
  includes?: string[];
  blocks?: ProgramBlock[];
  /** Sibling products cross-linked at the foot of the page. */
  seeAlso?: string[];
};

export const products: ProductPage[] = [
  /* ------------------------------------------------------------ tutoring */
  {
    slug: "private-tutoring",
    programSlug: "tutoring",
    catalogSlug: null,
    name: "Private Tutoring for All Subjects",
    shortName: "Private Tutoring",
    tagline: "Educator-led. Personally matched. The right tutor for every student.",
    summary:
      "Private, individualized tutoring for all subject areas from K–12. We work alongside emerging learners all the way through the most challenging high school courses.",
    priceLabel: "Packages from $350",
    image: {
      src: "/images/program-tutoring.jpg",
      alt: "A Resource Room tutor working one-to-one with a student on geometry at a table.",
      kind: "photo",
    },
    intro: [
      "Today's students need not only content knowledge but also connection. A student who likes their tutor will always learn more than one who doesn't. That's why we match every student with a tutor who fits: the right experience level, the right teaching style, and the right personality. When that connection clicks, students stop dreading extra help and start actually engaging.",
      "Resource Room is educator-led, founded and run by career educators who set the standards and oversee every student's progress. Our tutoring team is experienced, high-achieving, and carefully selected not just for what they know, but for how they connect.",
    ],
    stats: [
      { value: "100+", label: "Five-star reviews", stars: true },
      { value: "2022", label: "Holly Springs Business of the Year" },
      { value: "Since 2015", label: "Trusted by local families" },
    ],
    highlights: [
      {
        title: "Educator-led, carefully matched",
        body: "Resource Room is founded and run by career educators who oversee every student's progress. Our tutoring team is matched to each student based on subject expertise, teaching style, and personality. The right match makes all the difference.",
      },
      {
        title: "Truly personalized instruction",
        body: "Every student learns differently. We don't use a scripted, one-size-fits-all program. Each tutoring plan is built around your child's specific strengths, gaps, pace, and goals.",
      },
      {
        title: "In-person learning that builds connection",
        body: "Face-to-face tutoring means stronger engagement, immediate feedback, and a real relationship between student and teacher, the connection that keeps students motivated and confident.",
      },
      {
        title: "One place for every subject, every grade",
        body: "From kindergarten through twelfth grade, across every core subject, Resource Room is a single trusted home for academic support, even as your child's needs change over the years.",
      },
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
    ],
    seeAlso: ["summer-bridge", "executive-functioning"],
  },
  {
    slug: "summer-bridge",
    programSlug: "tutoring",
    catalogSlug: "summer-bridge-programs-in-nc",
    name: "Summer Bridge Tutoring Programs",
    shortName: "Summer Bridge",
    tagline: "Summer is your child's best chance to reset.",
    summary:
      "Summer vacation, while much needed, does have its drawbacks. Students do lose some fundamental Reading and Math skills over the summer: this is known as “Summer Brain Drain.”",
    priceLabel: "$699",
    image: {
      src: "/images/tile-summer-bridge.png",
      alt: "Resource Room Summer Bridge — prevent the summer slide.",
      kind: "tile",
    },
    intro: [
      "Whether they need to catch up, stay sharp, or get ahead. During the school year, students who are behind are always chasing new material while still missing older skills. That cycle creates stress, frustration, and a gap that only widens. Summer breaks that cycle.",
      "At Resource Room, Summer Bridge isn't a generic workbook or a one-size-fits-all packet. We look at the student in front of us, figure out exactly what they need, and build a plan that sends them into the next school year more confident, more prepared, and more independent.",
    ],
    stats: [
      { value: "100+", label: "Five-star reviews", stars: true },
      { value: "2022", label: "Holly Springs Business of the Year" },
      { value: "Since 2015", label: "Trusted by local families" },
    ],
    blocks: [
      {
        kind: "cards",
        eyebrow: "Who it's for",
        title: "Every student comes to summer with a different",
        accent: "story.",
        wide: true,
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
            icon: "clock",
          },
          {
            title: "The neurodiverse learner",
            body: "Students with ADHD, autism, learning differences, IEPs, or 504 plans who need instruction that's structured, patient, and responsive to how they actually learn. Summer gives us room to work at their pace.",
            icon: "users",
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "What a plan includes",
        title: "Built around your",
        accent: "child.",
        description:
          "Every plan is built around your child. Depending on what they need, summer bridge may focus on:",
        cards: [
          {
            title: "Reading & Writing",
            body: "Phonics, fluency, comprehension, grammar, essay writing, and written expression at every level.",
            icon: "book",
          },
          {
            title: "Math",
            body: "Number sense, math facts, fractions, pre-algebra, algebra, geometry, or course-specific review and preview.",
            icon: "target",
          },
          {
            title: "Executive functioning",
            body: "Planning, organisation, task initiation and time management, built without the daily pressure of school.",
            icon: "compass",
          },
        ],
      },
    ],
    seeAlso: ["private-tutoring", "executive-functioning"],
  },
  {
    slug: "executive-functioning",
    programSlug: "tutoring",
    catalogSlug: "executive-functioning-coaching-and-support",
    name: "Executive Functioning Coaching and Support",
    shortName: "Executive Functioning",
    tagline: "The skills that make everything else possible.",
    summary:
      "Coaching in planning, organisation, task initiation, time management and follow-through, for students who know the material but cannot get the work done.",
    priceLabel: "$100",
    image: {
      src: "/images/tile-executive-functioning.png",
      alt: "Resource Room Executive Functioning Coaching and Support.",
      kind: "tile",
    },
    intro: [
      "Some students understand the material perfectly and still hand nothing in. The gap is not knowledge, it is the set of skills that turn knowing into doing: planning, starting, sequencing, tracking, and finishing.",
      "Executive functioning coaching works on those skills directly, with an educator who builds systems around how your student actually operates rather than handing them a planner and hoping.",
    ],
    seeAlso: ["private-tutoring", "summer-bridge"],
  },

  /* -------------------------------------------------------- test prep */
  {
    slug: "sat-prep",
    programSlug: "sat-act-prep",
    catalogSlug: "sat-prep-in-north-carolina",
    name: "SAT Test Prep in Holly Springs, NC",
    shortName: "SAT Prep",
    tagline: "Private SAT prep and SAT classes built around your student.",
    summary:
      "Professionally administered SAT instruction from licensed, career educators. Course includes in-person instruction, proctored diagnostic assessments, and homework and practice assignments.",
    priceLabel: "$75 – $2,099",
    image: {
      src: "/images/tile-sat-prep.jpg",
      alt: "Resource Room SAT Test Prep — digital SAT ready.",
      kind: "tile",
    },
    intro: [
      "For over a decade we have helped thousands of students raise their SAT scores through personalized instruction, expert diagnostics, and a proven approach. Many of our students see 200+ point increases.",
      "Premier SAT tutoring built around the student, not a one-size-fits-all program. At Resource Room Learning Center, we identify exactly where a student is losing points and build a plan to fix it efficiently and confidently. Consultations are always free.",
    ],
    stats: [
      { value: "5-Star", label: "Google reviews", stars: true },
      { value: "200–300", label: "Point gains from baseline" },
      { value: "10+ yrs", label: "SAT prep experience" },
    ],
    blocks: [
      {
        kind: "pricing",
        eyebrow: "Programs",
        title: "Choose your SAT prep",
        accent: "path.",
        description:
          "Private tutoring is available year-round and you can start anytime. Our group class runs once a year for the March SAT.",
        tiers: [
          {
            name: "20-Hour Private SAT Tutoring",
            price: "$2,099",
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
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "What families say",
        title: "Real reviews from students and",
        accent: "parents.",
        cards: [
          {
            title: "Katie M. · Google Review",
            body: "“Sam and Joe, the owners, are super nice, fun, and helped me boost my scores by 210 points. They also help with getting ready for college.”",
            icon: "badge",
          },
          {
            title: "Ashley S. · Local Guide",
            body: "“My son has moved mountains since working with the amazing staff at the Resource Room. The SAT prep courses have beyond impacted our household.”",
            icon: "badge",
          },
          {
            title: "Maya B. · Google Review",
            body: "“My biggest challenge preparing for the SAT was my lack of confidence and learning gaps caused by Covid. Sam specializes in math, Joe focuses on English. Together they make a remarkable team.”",
            icon: "badge",
          },
        ],
      },
    ],
    seeAlso: ["act-prep", "college-admissions"],
  },
  {
    slug: "act-prep",
    programSlug: "sat-act-prep",
    catalogSlug: "act-prep-in-north-carolina",
    name: "ACT Test Prep in Holly Springs, NC",
    shortName: "ACT Prep",
    tagline: "Personalized ACT prep from licensed educators, updated for the current ACT.",
    summary:
      "Professionally administered ACT exam instruction from licensed, career educators. Course includes in-person instruction, proctored diagnostic assessments, and homework and practice assignments.",
    priceLabel: "$2,399",
    image: {
      src: "/images/program-college-prep.jpg",
      alt: "A student working through an ACT practice section with a tutor.",
      kind: "photo",
    },
    intro: [
      "Build strategy, confidence, pacing, and real score growth with a program designed around your student. Our ACT support goes beyond generic online prep, focused on content mastery, timing strategy, and digital testing familiarity.",
      "At Resource Room Learning Center, we offer expert, individualized ACT tutoring for students who need more than generic online prep. Every plan is built around the student, with the confidence that comes from working with experienced licensed educators. Consultations are always free.",
    ],
    stats: [
      { value: "Licensed", label: "Educators, not casual tutors" },
      { value: "Digital-ready", label: "Updated for the current ACT" },
      { value: "In-person & virtual", label: "Flexible scheduling" },
    ],
    highlights: [
      {
        title: "Licensed educators",
        body: "Our ACT tutoring is led by professional educators, not casual tutors. Students get clear explanations, structured instruction, and real teaching that adapts to how they learn.",
      },
      {
        title: "Updated for the current ACT",
        body: "We prepare students for the current test structure, including digital test familiarity, updated pacing, and the optional Science section.",
      },
      {
        title: "Personalized instruction",
        body: "Every student has a different profile. Some need grammar review, some need math strategy, some need pacing help, and some need all three. We build the plan around the student.",
      },
      {
        title: "Diagnostics and progress tracking",
        body: "We use targeted review, section analysis, and strategic practice to show families exactly where a student is improving and where more work is needed.",
      },
      {
        title: "Score growth with strategy",
        body: "We teach where time is lost, which question types repeat, and how to stay composed under pressure, not just the underlying content.",
      },
    ],
    blocks: [
      {
        kind: "checklist",
        eyebrow: "The current ACT",
        title: "Changes families should",
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
        kind: "prose",
        eyebrow: "Hours",
        title: "Why we recommend 24 total",
        accent: "hours.",
        wide: true,
        body: [
          "We generally recommend 24 total hours of ACT instruction because the ACT uses three required core sections, English, Math, and Reading, with optional Science and Writing. ACT describes its math test as measuring skills students typically acquire through the beginning of grade 12, which means ACT prep benefits from more guided instruction, more pacing work, and more deliberate review across sections.",
          "Put simply, the ACT rewards students who have had enough time to build both section-specific strategies and test-day endurance. During your free consultation we confirm the right amount based on the student's goals and diagnostics.",
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
          {
            date: "July 11, 2026",
            note: "Regular deadline: June 5 · Late: June 24 · not offered in NY",
          },
          { date: "September 19, 2026", note: "2026–2027 testing cycle begins" },
        ],
        note: "Additional fall and winter dates (October and December) follow the September administration. Check act.org for the complete, up-to-date schedule.",
      },
    ],
    seeAlso: ["sat-prep", "college-admissions"],
  },

  /* ---------------------------------------------------- college prep */
  {
    slug: "college-admissions",
    programSlug: "college-prep",
    catalogSlug: "college-admissions",
    name: "College Admissions and Essays",
    shortName: "College Admissions",
    tagline: "Expert-led support from an admissions insider, 10+ years of experience.",
    summary:
      "College Admissions can be overwhelming. We work to lessen the stress and foster greater success, with essay writing assistance and admissions advisement through the entire application process, including the Common App Essay and any supplemental essays.",
    priceLabel: "$549 – $899",
    image: {
      src: "/images/program-college-prep.jpg",
      alt: "A student working on a college application essay.",
      kind: "photo",
    },
    intro: [
      "The college process can feel overwhelming. Our team turns it into a clear, confident, and rewarding journey, from the personal essay to the final application, guided by someone who has sat on the other side of the admissions desk.",
      "At Resource Room, our admissions experts and professional writers provide the guidance families trust at one of the most important crossroads of a student's life. We help your student tell their story with clarity and confidence. Consultations are always free.",
    ],
    stats: [
      { value: "10+ yrs", label: "Admissions experience" },
      { value: "Insider", label: "Former admissions officer" },
      { value: "Holistic", label: "Whole-student approach" },
    ],
    blocks: [
      {
        kind: "prose",
        eyebrow: "Who guides it",
        title: "Guided by a true admissions",
        accent: "insider.",
        body: [
          "Our admissions services are led by Mr. C, a former College Admissions Officer and Senior High School Adviser. His firsthand experience inside university admissions offices gives our students a distinct, hard-to-find advantage: a real understanding of what admissions teams look for, how applications are read, and what makes a candidate stand out.",
        ],
      },
      {
        kind: "steps",
        eyebrow: "Our process",
        title: "Tailored to your",
        accent: "student.",
        description: "A clear, collaborative path from first conversation to final submission.",
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
        eyebrow: "The essay",
        title: "The student does the writing. We",
        accent: "coach.",
        wide: true,
        body: [
          "Grades and scores tell admissions officers what a student has done. The essay tells them who the student is. The personal essay is often the deciding factor between two students with similar transcripts. It is the one place in the entire application where a student speaks directly to the admissions committee in their own voice.",
          "This matters, so we say it plainly. Your student writes their own essay. We are coaches and editors, not ghostwriters. We guide brainstorming, ask the right questions, and give detailed feedback that sharpens the writing, but the words, the voice, and the story remain the student's own. That is what keeps the essay honest, what keeps it admissions-safe, and what makes it ring true to the people reading it.",
        ],
      },
    ],
    seeAlso: ["sat-prep", "act-prep"],
  },

  /* ------------------------------------------------- homeschool co-op */
  {
    slug: "homeschool-co-op",
    programSlug: "homeschool-co-op",
    catalogSlug: "homeschool-co-op-holly-springs-nc",
    name: "Homeschool Co-Op in Holly Springs, NC",
    shortName: "Homeschool Co-Op",
    tagline: "Flexible classes. Real connection. Stronger together.",
    summary:
      "Choose the enrollment option that best fits your child. Final class or block selection is made after you choose Grade Level and Enrollment type. Once we receive your order, registration is finalized by phone.",
    priceLabel: "$425 – $2,450",
    image: {
      src: "/images/tile-homeschool-coop.jpg",
      alt: "Resource Room Homeschool Co-Op for middle and high school students.",
      kind: "tile",
    },
    intro: [
      "Homeschooling gives your family flexibility. But flexibility doesn't have to mean doing it all alone. Some students need more structure in their week. Some need a teacher who knows them. Some need the chance to learn alongside peers in a setting that still feels safe and personal.",
      "That's what our co-op provides: a comfortable middle ground between homeschooling at home and a larger school environment, with real instruction from experienced educators who care about your child.",
    ],
    stats: [
      { value: "Grades 6–12", label: "Middle and high school programs" },
      { value: "2 days", label: "Academic day plus lab day" },
      { value: "From $425", label: "Per class, per semester" },
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
    ],
  },

  /* -------------------------------------------------------------- camps */
  {
    slug: "track-out-teacher-workday",
    programSlug: "camps",
    catalogSlug: "teacher-workdays",
    name: "Track-Out & Teacher Workday Camps",
    shortName: "Track-Out & Teacher Workday",
    tagline: "Your track is out. We're open.",
    summary:
      "Single days and full weeks for every Wake County track, plus the days when all four tracks are out at once. Campers dive into a mix of hands-on STEM and creative art activities.",
    priceLabel: "$11 – $75",
    image: {
      src: "/images/program-camps.jpg",
      alt: "Campers stretching glow-in-the-dark slime during a hands-on STEAM camp activity.",
      kind: "photo",
    },
    intro: [
      "Track out camp at Resource Room Learning Center. Hands on projects, small groups, and a day with real structure to it. All the best parts of a school day and none of the rest. Every Wake County track, every window, all year long.",
      "From fluffy slime and erupting volcanoes to race tracks, LEGO robotics, electric potatoes, squirt-gun art, and Minecraft Education, our camp days are packed with variety. With rotating themes no two Resource Room camp days are ever the same. It's a full day of building, creating, experimenting, and fun: all led by educators who know how to keep kids engaged and excited to learn.",
    ],
    stats: [
      { value: "Grades K–6", label: "All learners welcome" },
      { value: "Licensed", label: "Teachers on staff" },
      { value: "Open", label: "Most school holidays" },
    ],
    includes: [
      "Single days and full weeks across every Wake County track",
      "Bonus camp days on teacher workdays and district holidays",
      "Hands-on science, LEGO robotics, coding and creative building",
      "Extended day available until 4:30pm",
      "Choose Single Day or Full Week at checkout, then list your dates in the order notes",
    ],
    seeAlso: ["summer-camp"],
  },
  {
    slug: "summer-camp",
    programSlug: "camps",
    catalogSlug: "stem",
    name: "STEM Themed Summer Camps",
    shortName: "Summer Camps",
    tagline: "Where kids beg to come back.",
    summary:
      "Full-week camps for grades K–6. Hands-on science, creative building, coding, nature, and real fun. Our STEM weeks offer a unique opportunity for students to learn in a hands-on “funducational” manner.",
    priceLabel: "$11 – $329",
    image: {
      src: "/images/tile-stem-camps.png",
      alt: "Resource Room STEM themed summer camps.",
      kind: "tile",
    },
    intro: [
      "You want your child to have an amazing week. You also want to feel confident about where they're spending it. At Resource Room, our STEM camps give kids a week they'll talk about at dinner, and give parents the peace of mind that comes from knowing the day is structured, safe, and led by people who genuinely care about children.",
      "This isn't daycare with crafts. Every camp day is built with intention: hands-on science, creative challenges, outdoor exploration, coding, and movement, all wrapped in the kind of routine that helps kids thrive.",
    ],
    stats: [
      { value: "8:00–3:30", label: "Monday to Friday" },
      { value: "Grades K–6", label: "Full-week sessions" },
      { value: "Until 4:30pm", label: "Late pickup, +$55/week" },
    ],
    blocks: [
      {
        kind: "cards",
        eyebrow: "A camp day",
        title: "A camp day at Resource",
        accent: "Room.",
        cards: [
          {
            title: "Hands-on science",
            body: "Slime, volcanoes, elephant toothpaste, oobleck, and experiments that spark real curiosity.",
            icon: "sparkle",
          },
          {
            title: "Building & engineering",
            body: "LEGO challenges, design thinking, creative problem-solving, and teamwork.",
            icon: "target",
          },
          {
            title: "Coding",
            body: "Interactive coding games and digital challenges that build logic and sequencing skills.",
            icon: "chart",
          },
          {
            title: "Nature & outdoor time",
            body: "Nature walks, outdoor games, fresh air, and exploration built into every day.",
            icon: "sun",
          },
          {
            title: "Crafts & creativity",
            body: "Projects that let kids create, imagine, build, and bring their ideas to life.",
            icon: "pencil",
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "Why parents trust us",
        title: "It's not just",
        accent: "childcare.",
        wide: true,
        cards: [
          {
            title: "Every day is intentionally planned",
            body: "Your child isn't just supervised; they're engaged, learning, and having the kind of fun that sparks curiosity.",
            icon: "check",
          },
          {
            title: "Structure kids can count on",
            body: "Predictable routines, clear expectations, and a balanced day. Kids who thrive with structure feel comfortable here from day one.",
            icon: "clock",
          },
          {
            title: "Led by educators, not teenagers",
            body: "Our camp team includes experienced educators who understand children, know how to manage a room, and genuinely care about each camper's experience.",
            icon: "cap",
          },
        ],
      },
    ],
    seeAlso: ["track-out-teacher-workday"],
  },
];

export function getProductPage(programSlug: string, slug: string): ProductPage | undefined {
  return products.find((p) => p.programSlug === programSlug && p.slug === slug);
}

export function productPagesForProgram(programSlug: string): ProductPage[] {
  return products.filter((p) => p.programSlug === programSlug);
}

export function getProductBySlug(slug: string): ProductPage | undefined {
  return products.find((p) => p.slug === slug);
}
