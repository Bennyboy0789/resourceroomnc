import type { IconName } from "@/components/icons";

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

export const whyChooseUs: { title: string; body: string; icon: IconName }[] = [
  {
    title: "Individualized",
    body: "A targeted approach for each student. We find the gap, build the plan, and adjust it as the student moves.",
    icon: "target",
  },
  {
    title: "Engaging",
    body: "Curriculum-based STEAM programs that are hands-on and standards aligned — learning students want to show up for.",
    icon: "sparkle",
  },
  {
    title: "Professional",
    body: "Owned and operated by licensed educators with classroom experience and multiple graduate degrees.",
    icon: "badge",
  },
];

export const founders = {
  heading: "Owned and operated by licensed career educators.",
  body: [
    "Joe and Sam, husband and wife, each have over a decade of classroom experience, are duly licensed, and hold multiple graduate degrees.",
    "That background shapes everything here — from how programs are designed, to who is standing in front of your student, to how we talk with families about progress.",
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

export const finalCta = {
  heading: "Every student learns differently. Let's talk about yours.",
  body: "Tell us where your student is and where you want them to be. The first conversation is free, and it is with an educator — not a salesperson.",
};
