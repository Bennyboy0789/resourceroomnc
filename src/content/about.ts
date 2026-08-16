import type { IconName } from "@/components/icons";

/**
 * About-page content, transcribed from
 * resourceroomnc.com/about-resource-room-learning-center/ and its
 * Preferred Partners child page. See `docs/live-content/`.
 */

/* The About and Preferred Partners page mastheads live in `sections.ts` with
   every other page hero. */

export const philosophy = {
  heading: "Our philosophy at Resource Room Learning Center",
  body: [
    "At Resource Room, we start from a simple belief. Every student learns differently, and every student deserves a place built around that. Not a franchise. Not a one-size worksheet. A real learning center run by real educators.",
    "We are career educators with well over a decade of experience in private and public schools, and we bring that training to every session. Our instruction is structured, curriculum-based, and shaped around the student in front of us. We meet kids where they are, close the gaps holding them back, and push them toward goals they did not think were in reach.",
    "Whether your child needs to catch up, keep up, or get out ahead, our philosophy stays the same. Teach the whole student. Build real confidence. Make learning something they carry for life.",
  ],
};

export const foundingStory = {
  heading: "The story of our founders",
  body: [
    "Resource Room Learning Center was founded by a husband and wife team who are both career educators. Joe and Sam met while teaching together at the High School of Art and Design in midtown Manhattan. As time went by, their classroom experience led them to recognize the need for professional tutoring services that would focus on the needs of each student and specifically target the work they were doing in their respective classrooms.",
    "Resource Room instructors do not follow a “cookie-cutter” approach. Our students never sit in front of a predetermined set of worksheets that may or may not have anything to do with their daily classroom instruction. The first question a tutoring client will be asked when sitting down with a Resource Room tutor is, “What did you do today in school, and what do you have for homework?”",
    "Resource Room Learning Center started with one small room on a busy Staten Island street. Joe and Sam opened Resource Room Learning Center Holly Springs in October of 2021. Today, that one room in Staten Island has grown into one of the Triangle's most complete learning centers: tutoring, test prep, camps, a homeschool co-op, ABA support, and Pathways Academy.",
    "Named Holly Springs Business of the Year in 2022, Raleigh's Best Bronze Award in Educational Services 2025, and winner of the distinguished Parrish “Ham” Womble Service Award, Joe and Sam remain devoted to their community, the benefits of tailored in-person instruction, and their mission to help students of all ages reach their goals.",
  ],
};

export const coreValues: { title: string; body: string; icon: IconName }[] = [
  {
    title: "Commitment",
    body: "We are committed to the success of every student, whether they struggle or excel there is a program for them at Resource Room. We are committed to in-person education and we are energized by working alongside our students.",
    icon: "heart",
  },
  {
    title: "Dedication",
    body: "We will always strive to meet the needs of our students and parents. We work to ensure we deliver high quality instruction and if anyone feels their needs are not met — we will work tirelessly to adjust our approach until the intended goals are met.",
    icon: "target",
  },
  {
    title: "Integrity",
    body: "We will never oversell our clients. Our business will always offer free, personalized consultations for new clients. We explore what the need is, and propose programs and services to match. We value honesty and integrity, and place the needs of our students first.",
    icon: "shield",
  },
  {
    title: "Innovation",
    body: "We constantly update our curriculum for our STEAM Programs and regularly add new programs. We adjust to changing educational environments and stay ahead of the curve when it comes to fostering an immersive and engaging learning environment.",
    icon: "sparkle",
  },
];

export type Partner = {
  name: string;
  /** Practice or role line under the name. */
  credentials: string;
  body: string[];
  links?: { label: string; href: string }[];
};

export const partnersIntro =
  "Resource Room provides educational support for all types of learners, and we work with many other providers who help us identify, manage, and support students along their educational journey. Below are some of our preferred partners in that process.";

export const partners: Partner[] = [
  {
    name: "Dr. Shannon Erklin",
    credentials: "Ph.D., PLLC — Licensed Clinical Psychologist",
    body: [
      "Dr. Shannon Erklin is a licensed clinical psychologist specializing in diagnostic and psychoeducational evaluations, neurodevelopmental disorders, and evidence-based therapy for children, adolescents, and families.",
      "Her work focuses on Autism Spectrum Disorder, ADHD, learning differences, behavioral challenges, and parent support using research-backed approaches including CBT and ABA-informed interventions.",
    ],
    links: [{ label: "drerklin.com", href: "https://www.drerklin.com" }],
  },
  {
    name: "Hunter Weber",
    credentials: "M.A., BCBA, LBA — Lead ABA Specialist",
    body: [
      "ABA services can support neurodiverse students who may be a strong fit for Pathways Academy but need additional readiness skills before fully integrating into the academic environment. The goal is not to replace the Pathways model, but to strengthen a student's ability to access it successfully and more independently.",
      "As the collaborating BCBA, services focus on individualized, data-driven support targeting skills such as communication, emotional regulation, executive functioning, transition tolerance, task completion, social interaction, and adaptive independence.",
      "This partnership can help students build the foundational skills needed to participate successfully in Pathways while reducing barriers that may interfere with learning, group participation, and long-term academic success.",
    ],
    links: [{ label: "ABA support at Resource Room", href: "/programs/aba-services" }],
  },
  {
    name: "Jolyn Welsh",
    credentials:
      "M.S., CCC-SLP — Licensed Speech-Language Pathologist, Owner of JW Speech and Language, PLLC",
    body: [
      "Jolyn Welsh is a licensed Speech-Language Pathologist serving children and families in Holly Springs and surrounding areas through JW Speech and Language, PLLC. With more than 10 years of experience, she provides mobile, play-based therapy in children's natural environments, including homes, schools, and daycares.",
      "Her warm, child-led approach focuses on building meaningful communication skills that carry over into everyday life. Jolyn has experience supporting children with speech sound disorders, language delays, childhood apraxia of speech, AAC, oral motor development, and orofacial myofunctional disorders.",
    ],
    links: [
      { label: "jwspeech.com", href: "https://www.jwspeech.com" },
      { label: "jw@jwspeech.com", href: "mailto:jw@jwspeech.com" },
      { label: "724-464-8602", href: "tel:+17244648602" },
    ],
  },
];

/**
 * The referral web on the Preferred Partners page.
 *
 * Same six roles as the Pathways diagram, because it is the same network —
 * but framed from the other direction. There the question is what surrounds a
 * Pathways student; here it is what a family gains by starting with us, which
 * is that the referral and the coordination afterwards are somebody else's job.
 *
 * Order is the diagram's, not the page's: top, mid-left, mid-right, then the
 * lower three left to right. The two we deliver ourselves sit left and centre,
 * the three partner disciplines to the right and below.
 */
export const partnerNetwork = {
  eyebrow: "How referrals work",
  title: "One network around",
  accent: "one student.",
  body: "Families usually arrive holding a stack of phone numbers and no way to make them talk to each other. Starting here means the referral is ours to make and the coordination afterwards is ours to keep — the evaluation, the therapy and the schoolwork all pointed at the same goal.",
  nodes: [
    { title: "Your", strong: "Student", meta: "" },
    { title: "Academic", strong: "Support", meta: "Tutoring · Test Prep" },
    { title: "Behavioral", strong: "Support", meta: "Hunter Weber, BCBA" },
    { title: "Clinical", strong: "Evaluation", meta: "Dr. Shannon Erklin" },
    { title: "Executive", strong: "Functioning", meta: "Planning · Organization" },
    { title: "Speech &", strong: "Language", meta: "Jolyn Welsh, CCC-SLP" },
  ],
  quote: "One conversation to start. One team from then on.",
};
