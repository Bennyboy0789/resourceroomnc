/**
 * Join Our Team page content, transcribed from join-our-team-mockup.html.
 *
 * The live page was a bare form with no context and no roles listed, which is
 * what this replaces. Copy is the mockup's, unchanged — it is the client's
 * writing, not ours.
 */

export const careersHero = {
  eyebrow: "Careers at Resource Room",
  titleLead: "Teach the way you",
  /* Rendered in gold on its own line, as in the mockup. */
  titleAccent: "always wanted to teach.",
  body: "Small classes. Real relationships. A team of licensed educators who actually have time to know every student's name. If that sounds like the classroom you signed up for, we want to meet you.",
  cta: "Apply Now",
};

export const careersWhy = {
  eyebrow: "Why Resource Room",
  title: "A place educators actually want to stay.",
  intro:
    "We built Resource Room because we were tired of watching great teachers burn out in systems that didn't let them teach. Here's what's different.",
  cards: [
    {
      title: "Small by Design",
      body: "Low student-to-teacher ratios mean you actually get to teach, not just manage a room.",
    },
    {
      title: "Family-Run",
      body: "Owned and operated by licensed educators, not a franchise or private equity roll-up. Decisions get made by people who've been in your seat.",
    },
    {
      title: "Flexible Schedules",
      body: "Part-time, full-time, seasonal camp work, we build roles around real life, not the other way around.",
    },
    {
      title: "Room to Grow",
      body: "Start as a tutor, move into camp leadership, coaching, or admissions. We promote from within, often.",
    },
  ],
};

export const careersRoles = {
  eyebrow: "Open Roles",
  title: "Where you could fit in.",
  intro:
    "We hire year-round across these areas. Even if your exact role isn't listed, tell us where your strengths are, we're always building the right seat for the right person.",
  /* `initial` is the letter tile beside each role on the mockup. */
  items: [
    {
      initial: "T",
      title: "Private Tutors, All Subjects",
      body: "K-12 through AP Math and Science. One-on-one, in-person or virtual.",
    },
    {
      initial: "S",
      title: "STEM Camp Instructors",
      body: "Lead hands-on, curriculum-based activities for track-out, summer, and teacher workday camps.",
    },
    {
      initial: "A",
      title: "ABA Support Staff",
      body: "Deliver behavioral support inside a real learning environment, partnered with our BCBA team.",
    },
    {
      initial: "H",
      title: "Homeschool Co-Op Instructors",
      body: "Teach small-group classes for middle and high school homeschool families.",
    },
    {
      initial: "P",
      title: "Pathways Academy Teachers",
      body: "Licensed special education teachers for our private diploma-granting high school for neurodiverse learners.",
    },
    {
      initial: "C",
      title: "College Admissions Coaches",
      body: "Guide students through essays, applications, and the Common App process.",
    },
  ],
};

export const careersProcess = {
  eyebrow: "How It Works",
  title: "Four steps to joining the team.",
  steps: [
    { title: "Apply", body: "Submit the form below and email your resume." },
    {
      title: "Review",
      body: "We review every application personally, usually within a few days.",
    },
    {
      title: "Interview",
      body: "A relaxed conversation with Joe or Sam about your background and goals.",
    },
    {
      title: "Welcome Aboard",
      body: "Onboarding, training, and your first placement with a student or camp group.",
    },
  ],
};

export const careersQuote = {
  quote:
    "We built Resource Room with one goal in mind: to create a place where great educators want to build a career, not just fill a schedule.",
  attribution: "Joe & Sam, Resource Room Founders",
};

export const careersApply = {
  eyebrow: "Apply Today",
  title: "Tell us about you.",
  intro:
    "Fill out the form and attach your resume. We'll follow up personally.",
};

/** Options for the two selects on the application form. */
export const educationLevels = [
  "High School Diploma",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
];

export const careersPositions = [
  "Private Tutor",
  "STEM Camp Instructor",
  "ABA Support Staff",
  "Homeschool Co-Op Instructor",
  "Pathways Academy Teacher",
  "College Admissions Coach",
  "Other / Not Sure Yet",
];
