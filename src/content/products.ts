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
    includes: [
      "A free consultation to identify goals and gaps",
      "A tutor matched on subject expertise, teaching style and personality",
      "A personalized instruction plan reviewed as the student progresses",
      "One-to-one sessions with an experienced educator",
      "Homework, test and project support alongside skill building",
      "Ongoing communication with families about progress",
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
        eyebrow: "By subject",
        title: "High school subject",
        accent: "expertise.",
        wide: true,
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
        kind: "checklist",
        eyebrow: "Who it's for",
        title: "Who we",
        accent: "help.",
        description:
          "Resource Room serves the full range of students, from those catching up to high achievers who want an edge:",
        items: [
          "Students who have fallen behind and need to catch up",
          "High-achieving students who want to get ahead or master advanced material",
          "Students who need stronger study habits and academic routines",
          "Students preparing for quizzes, tests, and major assignments",
          "Students who simply learn better with a more personalized approach",
          "Neurodiverse learners who benefit from educators trained to support how they learn",
        ],
      },
      {
        kind: "links",
        eyebrow: "The wider center",
        title: "More than a",
        accent: "tutoring center.",
        description:
          "Because Resource Room is a full-service learning center, families can access far more than subject tutoring in one trusted place.",
        wide: true,
        links: [
          {
            title: "SAT & ACT Prep",
            body: "Targeted test preparation that trains content, timing, pacing, and test-day stamina alongside the score.",
            href: "/programs/sat-act-prep",
            icon: "target",
          },
          {
            title: "STEM Camps & Programs",
            body: "Track-out, teacher workday, and summer camps built on hands-on science, robotics, coding, and creative building.",
            href: "/programs/camps",
            icon: "sparkle",
          },
          {
            title: "Homeschool Co-Op",
            body: "Structured daytime learning in Holly Springs for homeschool families who want more than homeschooling alone.",
            href: "/programs/homeschool-co-op",
            icon: "home",
          },
          {
            title: "Pathways Academy",
            body: "A private high school for neurodiverse learners with autism, run on its own campus and its own calendar.",
            href: "/programs/pathways-academy",
            icon: "cap",
          },
        ],
      },
    ],
    seeAlso: ["summer-bridge"],
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
    seeAlso: ["private-tutoring"],
  },
  /*
   * The four below were catalog courses at /courses/<slug> — noindex pages with
   * a single inbound link. Joe asked for them in the Tutoring menu, and a page
   * in the primary navigation should be one search can find, so they were moved
   * onto the product URL pattern and the old paths redirect here. The copy is
   * the copy that was already on them, restructured into blocks.
   */
  {
    slug: "end-of-course-end-of-grade-exams",
    programSlug: "tutoring",
    catalogSlug: null,
    name: "End-of-Course/End-of-Grade Exams",
    shortName: "EOG & EOC Prep",
    tagline: "Targeted preparation aligned to North Carolina standards.",
    summary:
      "Targeted End of Grade and End of Course prep for North Carolina students in grades 3–8 and high school. We help students review key standards, strengthen weak areas, and build confidence before test day.",
    image: {
      src: "/images/courses/end-of-course-end-of-grade-exams.jpg",
      alt: "A Resource Room teacher reviewing exam practice questions with a student.",
      kind: "photo",
    },
    intro: [
      "Not generic worksheets. Not last-minute cramming. Real review that builds real confidence.",
      "State testing season creates stress for the whole family. Your child has spent the entire year learning material, and now a single set of exams is supposed to measure how much stuck. The best preparation isn't more pressure. It's targeted review that helps students organize what they already know and strengthen what they don't.",
      "At Resource Room, our EOG and EOC prep is built around the actual North Carolina Standard Course of Study, not a generic test prep program. We identify where your child is strong, where they're unsure, and where focused review will make the biggest difference on test day.",
    ],
    stats: [
      { value: "100+", label: "Five-star reviews", stars: true },
      { value: "2022", label: "Holly Springs Business of the Year" },
      { value: "Since 2015", label: "Trusted by local families" },
    ],
    highlights: [
      {
        title: "Standards-aligned",
        body: "Our review is rooted in the NC Standard Course of Study. We reinforce the actual skills your child is expected to know, not random test tricks.",
      },
      {
        title: "Gap-focused",
        body: "We identify where your child is strong and where they need reinforcement, then target the review where it will make the biggest impact.",
      },
      {
        title: "Confidence-building",
        body: "For students with test anxiety, attention challenges, or executive functioning difficulties, we break review into manageable pieces and build comfort with the test format.",
      },
    ],
    blocks: [
      {
        kind: "cards",
        eyebrow: "Two programs, one goal",
        title: "Confidence on",
        accent: "test day.",
        wide: true,
        cards: [
          {
            title: "EOG Prep (Grades 3–8)",
            body: "End-of-Grade assessments measure reading and math for grades 3–8, with science in grades 5 and 8. We focus on reading comprehension across literary and informational texts, vocabulary in context and close reading, math problem solving, computation and multi-step reasoning, science review for grades 5 and 8, test pacing and stamina, and reducing test-related anxiety.",
            icon: "book",
          },
          {
            title: "EOC Prep (High School)",
            body: "End-of-Course assessments are given in specific high school courses: NC Math 1, NC Math 3, English II, and Biology. High school students often need more than a broad review — they need help organizing what they've learned across the full course and understanding how to apply it under test conditions.",
            icon: "cap",
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "Who benefits most",
        title: "Built for the student who",
        accent: "knows more than the score shows.",
        cards: [
          {
            title: "The capable but inconsistent student",
            body: "Does well day-to-day but struggles on cumulative assessments. Needs help organizing a full year of material into a coherent review.",
            icon: "chart",
          },
          {
            title: "The student with gaps",
            body: "Missed key concepts earlier in the year, or has foundational weaknesses that show up under testing pressure. Needs targeted reinforcement before exam day.",
            icon: "target",
          },
          {
            title: "The anxious test-taker",
            body: "Knows the material but freezes up during tests. Needs practice with the format, the pacing, and the confidence that comes from structured preparation.",
            icon: "heart",
          },
        ],
      },
    ],
    seeAlso: ["private-tutoring", "homework-help"],
  },
  {
    slug: "homework-help",
    programSlug: "tutoring",
    catalogSlug: null,
    name: "Homework Help Tutoring",
    shortName: "Homework Help",
    tagline: "Homework should build understanding, not create a nightly battle.",
    summary:
      "Additional academic support benefits all types of students. Through our private tutoring sessions, school assignments can always be addressed by any of our teachers and tutors on staff.",
    image: {
      src: "/images/courses/homework-help.jpg",
      alt: "A Resource Room tutor helping a student work through a homework assignment.",
      kind: "photo",
    },
    intro: [
      "If homework has become a source of stress in your home — the arguments, the tears, the hours spent on what should take thirty minutes — you're not alone, and it's not your child's fault.",
      "The problem usually isn't the content. It's that no one ever taught your child how to manage the work itself: how to get started, stay focused, break things into steps, and actually retain what they're learning. That's what we fix.",
    ],
    stats: [
      { value: "100+", label: "Five-star reviews", stars: true },
      { value: "2022", label: "Holly Springs Business of the Year" },
      { value: "Since 2015", label: "Trusted by local families" },
    ],
    highlights: [
      {
        title: "Understand the why",
        body: "Not just complete the assignment. Understand the concepts behind it so the work actually reinforces learning.",
      },
      {
        title: "Plan and prioritize",
        body: "Break multi-step tasks into manageable pieces, manage time, and build routines that transfer to independent work.",
      },
      {
        title: "Build independence",
        body: "The goal isn't permanent support. It's teaching your child the skills to eventually manage their work on their own.",
      },
    ],
    blocks: [
      {
        kind: "cards",
        eyebrow: "Who benefits most",
        title: "Designed for all students,",
        accent: "especially these.",
        wide: true,
        cards: [
          {
            title: "The overwhelmed student",
            body: "Gets paralyzed by multi-step assignments. Doesn't know where to start. Shuts down when the workload feels like too much. Needs someone to help break it down and build a plan.",
            icon: "compass",
          },
          {
            title: "The rusher",
            body: "Flies through work just to be done. Makes avoidable mistakes. Doesn't review. Needs support slowing down, checking work, and actually engaging with what they're learning.",
            icon: "clock",
          },
          {
            title: "The neurodiverse learner",
            body: "Students with ADHD, autism, executive functioning challenges, or attention difficulties who need structure, pacing, redirection, and patient support from someone who understands how they think.",
            icon: "heart",
          },
          {
            title: "The digitally lost student",
            body: "Struggling with Google Classroom, Canvas, DeltaMath, or online portals? We help students navigate the platforms, not just the content, so nothing slips through the cracks.",
            icon: "chart",
          },
        ],
      },
      {
        kind: "steps",
        eyebrow: "A session",
        title: "What homework help",
        accent: "actually looks like.",
        steps: [
          {
            title: "Check in",
            body: "Review what's due, what's coming up, and what needs priority. Build a plan for the session.",
          },
          {
            title: "Work together",
            body: "Tackle assignments with real-time support. Teaching concepts, not just giving answers. Building understanding that sticks.",
          },
          {
            title: "Reinforce",
            body: "When school assignments aren't enough, we provide additional practice to close gaps and build long-term retention.",
          },
          {
            title: "Build skills",
            body: "Every session reinforces planning, organization, and independence, so students need less help over time, not more.",
          },
        ],
      },
      {
        kind: "checklist",
        eyebrow: "What changes",
        title: "What consistent support",
        accent: "actually changes.",
        description:
          "Most students are never formally taught how to study. They're assigned work but not shown how to manage it. With consistent support, families typically see improvements in:",
        items: [
          "Accuracy and completion of daily assignments",
          "Deeper understanding of classroom material",
          "Stronger study habits and routines",
          "Ability to retain information over time",
          "Confidence and willingness to engage with schoolwork",
          "Growing independence — less help needed at home",
        ],
      },
    ],
    seeAlso: ["private-tutoring", "students-with-ieps"],
  },
  {
    slug: "students-with-ieps",
    programSlug: "tutoring",
    catalogSlug: null,
    name: "Students With IEP's",
    shortName: "Students With IEP's",
    tagline: "Your child has an IEP. Now what?",
    summary:
      "Supportive, individualized academic help for students with IEPs, including reading and math instruction, executive functioning support, and guidance for neurodiverse learners and their families.",
    image: {
      src: "/images/courses/students-with-ieps.jpg",
      alt: "A Resource Room educator working one-to-one with a student who has an IEP.",
      kind: "photo",
    },
    intro: [
      "We help families turn the plan on paper into real academic progress.",
      "If you're a parent of a student with an IEP, you already know: having a plan doesn't mean the plan is working. You're managing accommodations, decoding school recommendations, supporting homework at home, and trying to figure out what kind of help will actually move the needle.",
      "You are not alone, and there are real options for support. At Resource Room, we work with students who need more individualized instruction, more structure, more patience, and a teaching approach that genuinely responds to how they learn.",
    ],
    stats: [
      { value: "100+", label: "Five-star reviews", stars: true },
      { value: "2022", label: "Holly Springs Business of the Year" },
      { value: "Since 2015", label: "Trusted by local families" },
    ],
    highlights: [
      {
        title: "Reading & math",
        body: "Foundational skill-building, reinforcement of classroom material, and individualized instruction at the right level for your child.",
      },
      {
        title: "Executive functioning",
        body: "Organization, planning, task initiation, and follow-through — the skills that make all other learning possible.",
      },
      {
        title: "Accommodation coaching",
        body: "We help students understand and use supports like extended time, modified assignments, and testing accommodations effectively.",
      },
      {
        title: "Self-advocacy",
        body: "Students learn to ask questions, communicate their needs, and understand how they learn best. Independence starts here.",
      },
    ],
    blocks: [
      {
        kind: "prose",
        eyebrow: "Funding",
        title: "ESA+ funding may",
        accent: "cover the cost.",
        body: [
          "Resource Room is an approved provider for ESA+ grant-funded reading and math instruction for students with IEPs. North Carolina's ESA+ program helps families of students with disabilities pay for education services, including tutoring and supplemental instruction in core academic subjects.",
          "If your child has an IEP, you may already qualify for funding that covers the cost of outside academic support. We help families navigate the application process and understand their options.",
        ],
      },
      {
        kind: "cards",
        eyebrow: "Is this the right fit?",
        title: "This support is designed for",
        accent: "students who:",
        cards: [
          {
            title: "Are falling behind despite having an IEP",
            body: "The accommodations help, but they haven't closed the gap. Your child needs more targeted, individualized instruction than the classroom can provide.",
            icon: "chart",
          },
          {
            title: "Are losing confidence",
            body: "Your child is bright and capable but increasingly frustrated, avoidant, or shut down when it comes to schoolwork. They need a setting that rebuilds belief in themselves.",
            icon: "heart",
          },
          {
            title: "Need a different kind of environment",
            body: "Some students need concepts broken down more clearly. Some need repetition and guided practice. Some need a setting that's calmer, more structured, and more responsive to their pace.",
            icon: "home",
          },
        ],
      },
      {
        kind: "prose",
        eyebrow: "A note for parents",
        title: "Needing more support doesn't mean",
        accent: "your child isn't capable.",
        body: [
          "It often means your child needs instruction that is more targeted and better matched to how they actually learn. That's exactly what we provide.",
          "For some families, weekly tutoring is the right level of support. For others — especially families with high-school-aged neurodiverse learners — a more immersive educational environment may be a better fit. Pathways Academy at Resource Room is a private diploma-granting high school for neurodiverse learners in grades 9–12: small cohort, structured support, executive functioning development, and a full ecosystem of services coordinated under one roof.",
        ],
      },
    ],
    seeAlso: ["private-tutoring", "homework-help"],
  },
  {
    slug: "virtual-tutoring",
    programSlug: "tutoring",
    catalogSlug: null,
    name: "Virtual Tutoring",
    shortName: "Virtual Tutoring",
    tagline: "The same quality. The same personal attention. Available anywhere.",
    summary:
      "Resource Room offers live virtual tutoring to students across the country. Our teachers provide the same personalized instruction, academic support, and high-quality service online that families know and trust from our in-person programs.",
    image: {
      src: "/images/courses/zoom-tutoring.jpg",
      alt: "A student in a live online tutoring session with a Resource Room teacher.",
      kind: "photo",
    },
    intro: [
      "Not every family can get to our Holly Springs location, and not every schedule allows for it. That shouldn't mean your child goes without quality academic support. Our virtual tutoring delivers the same personalized, one-on-one instruction Resource Room is known for, live through Zoom or Google Meet.",
      "This isn't a passive screen experience. Sessions are live, interactive, and built around your child. Real teaching, real feedback, real progress.",
    ],
    stats: [
      { value: "7 days", label: "Available every day of the week" },
      { value: "30, 60, 120 min", label: "Flexible session lengths" },
      { value: "Nationwide", label: "Students anywhere in the U.S." },
    ],
    highlights: [
      {
        title: "Subject tutoring",
        body: "Math, reading, writing, science, and social studies across all grade levels, K–12.",
      },
      {
        title: "Homework help",
        body: "Not just getting it done. Understanding the concepts, building habits, and reinforcing what's being taught in class.",
      },
      {
        title: "Executive functioning",
        body: "Organization, planning, task initiation, time management, and building independence as a learner.",
      },
      {
        title: "Digital platform support",
        body: "Help navigating Google Classroom, Canvas, DeltaMath, and other online tools your child uses for school.",
      },
    ],
    blocks: [
      {
        kind: "steps",
        eyebrow: "How it works",
        title: "From booking to",
        accent: "real progress.",
        steps: [
          {
            title: "Schedule",
            body: "Book a session that fits your family. Available 7 days a week, daytime and evening.",
          },
          {
            title: "Click and join",
            body: "We send a Zoom or Google Meet link before the session. Your child clicks and they're in. That's it.",
          },
          {
            title: "Learn",
            body: "Live instruction, screen sharing, guided practice, and real accountability. Not a video your child watches alone.",
          },
          {
            title: "Stay connected",
            body: "We provide regular feedback to parents on progress, patterns, and areas of focus.",
          },
        ],
      },
      {
        kind: "cards",
        eyebrow: "Who benefits most",
        title: "Virtual tutoring suits",
        accent: "these families.",
        cards: [
          {
            title: "Families outside Holly Springs",
            body: "You want Resource Room's quality but don't live nearby. Virtual tutoring brings our team to your child no matter where you are in the country.",
            icon: "pin",
          },
          {
            title: "Busy families",
            body: "Between school, activities, and work, getting to a physical location isn't always realistic. Virtual sessions fit around your schedule, not the other way around.",
            icon: "clock",
          },
          {
            title: "Students who learn better at home",
            body: "Some students focus better in their own space. Virtual tutoring removes the travel and transitions, letting them settle into learning more comfortably.",
            icon: "home",
          },
        ],
      },
      {
        kind: "prose",
        eyebrow: "Hybrid",
        title: "Want the best",
        accent: "of both?",
        body: [
          "A hybrid approach is always available. Your child can do some sessions online and come in person at other times — whatever combination works best for your family.",
        ],
      },
    ],
    seeAlso: ["private-tutoring", "homework-help"],
  },
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
      src: "/images/tile-trackout-workday-camps.jpg",
      alt: "Campers building STEM projects with cars and gadgets during Track-Out & Teacher Workday Camps.",
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
      src: "/images/tile-stem-camps.jpg",
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

/**
 * The product pages worth showing as a nested tier in the nav.
 *
 * A dropdown holding one item is not a choice — it just puts an extra step in
 * front of a page the parent link already reaches. College Prep and Homeschool
 * Co-Op each have a single product, so they get no tier; the program link goes
 * straight there. Add a second product and the tier appears on its own.
 */
export function menuChildrenFor(programSlug: string): ProductPage[] {
  const pages = productPagesForProgram(programSlug);
  return pages.length > 1 ? pages : [];
}
