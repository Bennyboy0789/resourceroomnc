/**
 * Tutoring Packages & Policies — the full rate card.
 *
 * Transcribed from docs/live-content/tutoring-packages-policies.txt, which is
 * the snapshot of the page this replaces. The rebuild dropped this page and
 * redirected the URL at /programs/tutoring, so every published rate and every
 * cancellation policy went with it.
 *
 * It is deliberately UNLISTED: no nav entry, no sitemap entry, noindex. Joe
 * shares the link directly with families rather than publishing a price list,
 * which is also why the figures live here rather than in Stripe — these are
 * quoted rates for a conversation, not a checkout.
 *
 * Prices carry an effective date. If they change, update `pricesEffective` in
 * the same edit so the page never shows a stale figure as if it were current.
 */

export const packagesMeta = {
  title: "Tutoring Packages & Policies",
  tagline: "Personalized One-on-One Instruction | Teacher Owned & Operated | Flexible Options",
  intro:
    "At Resource Room Learning Center, we offer tutoring that meets students where they are, academically and emotionally. As a teacher owned and operated center, every tutor is hand-selected and trained in our approach, building confidence, filling learning gaps, and accelerating progress.",
  pricesEffective: "Prices effective September 1, 2026.",
};

/** Every package is priced across the same four bands, in this order. */
export const gradeTiers = ["K–5", "Grades 6–8", "Grades 9–12", "SAT/AP"] as const;

/**
 * The intake fee, renamed from "Registration Fee" and raised from $75 to $95
 * in the September 2026 rate card.
 *
 * Note what moved: 10+ hours no longer waives it, so Study Sprint now carries
 * the fee where it used to be free. Honor Roll, a 3-month subscription, any
 * reading term and the full-year plan waive it.
 */
export const registrationFee = {
  title: "New Student Enrollment · $95",
  body: "A one-time fee for new families. Covers intake, tutor matching, scheduling, and all standard session materials.",
  waivedTitle: "Waived with",
  waivedFor: [
    "The Honor Roll Plan",
    "A 3-month Scholar's Subscription",
    "Any Reading Intervention term",
    "A Full Academic Year Plan",
  ],
  upgradeNote:
    "Upgrading? Move up to a larger package within 30 days and the $95 is credited toward it.",
  note: "Not sure where to start? New families often begin with a Starter Stack. Students working with us weekly save the most with the Honor Roll Plan or a monthly subscription.",
};

export type PricedPlan = {
  name: string;
  /** Sits under the name — hours, billing cadence, or total commitment. */
  meta: string;
  /** One price per entry in `gradeTiers`, same order. */
  prices: string[];
  note?: string;
  badge?: string;
  featured?: boolean;
};

export const hourlyPackages = {
  title: "Standard Hourly Packages",
  description: "Great for first-time families, short-term goals, or flexible scheduling.",
  plans: [
    {
      name: "Starter Stack",
      meta: "5 Hours · From $75/hr",
      prices: ["$375", "$385", "$400", "$425"],
      note: "$95 New Student Enrollment applies",
      bestFor:
        "Families new to Resource Room, or those targeting one subject, prepping for a quiz, or trying tutoring before a longer commitment.",
    },
    {
      name: "Study Sprint",
      meta: "10 Hours · From $73/hr",
      prices: ["$730", "$750", "$780", "$830"],
      note: "$95 New Student Enrollment applies · discounted rate",
      bestFor:
        "Students who need academic reinforcement over a few weeks. Ideal for mid-quarter check-ins or project-based support.",
    },
    {
      name: "Honor Roll Plan",
      meta: "20 Hours · From $71/hr",
      prices: ["$1,420", "$1,460", "$1,520", "$1,620"],
      note: "Enrollment fee waived + best discounted rate",
      badge: "Best value",
      featured: true,
      bestFor:
        "Students who benefit from consistent weekly tutoring. Great for improving grades, prepping for state tests, and building executive functioning skills.",
    },
  ],
};

/**
 * Emerging Reader Intervention — new in the September 2026 rate card.
 *
 * Priced per session rather than across the four grade bands, because it is
 * one programme at one rate rather than a package that costs more for older
 * students. That is why it needs its own shape instead of `PricedPlan`.
 */
export type TermPlan = {
  name: string;
  /** Sits under the name — sessions and total hours. */
  meta: string;
  /** The per-session rate, shown as the headline cue. */
  perSession: string;
  price: string;
  priceLabel: string;
  /** The window the term has to be completed inside. */
  completeWithin: string;
  bestFor: string;
  badge?: string;
  featured?: boolean;
};

export const readingIntervention = {
  title: "Emerging Reader Intervention",
  description:
    "Three sessions per week, 30 minutes each, one-on-one. Explicit, systematic reading instruction for students in grades K–5 who are not yet reading at grade level, and for older students who need to go back and build the foundation.",
  rationaleTitle: "Why three shorter sessions instead of one long one",
  rationale:
    "Reading is a skill, not a subject. Skills are built through frequent, spaced practice, not through one long weekly block. Thirty minutes three times a week gives a student repeated exposure, faster correction of errors, and steady retention between sessions. Just as important, thirty minutes is about as long as an early reader can hold focused attention on decoding work. Shorter sessions mean the student stays engaged for all of it, and we end while they still feel successful.",
  includesTitle: "Every plan includes",
  includes: [
    "Initial reading diagnostic and skill profile",
    "Instruction from licensed, trained educators",
    "Individualized scope and sequence",
    "Phonemic awareness, phonics, and decoding",
    "Fluency, spelling, and comprehension work",
    "Written progress report every 6 weeks",
    "Parent conference at the end of each term",
    "$95 New Student Enrollment waived",
  ],
  plans: [
    {
      name: "12-Week Core",
      meta: "36 Sessions · 18 Hours",
      perSession: "$38 per session",
      price: "$1,370",
      priceLabel: "One-on-One Instruction",
      completeWithin: "Complete within 15 weeks",
      bestFor:
        "Students with a targeted gap, or families new to intervention who want a defined term with measurable results before committing to the full arc.",
    },
    {
      name: "24-Week Intervention",
      meta: "72 Sessions · 36 Hours",
      perSession: "$35 per session",
      price: "$2,520",
      priceLabel: "One-on-One Instruction",
      completeWithin: "Complete within 28 weeks",
      badge: "Best value",
      featured: true,
      bestFor:
        "Most students who are meaningfully below grade level. Reading gaps close over a school year, not a quarter. Students with an IEP or 504 reading goal belong here, and this is our lowest per-session rate.",
    },
  ] satisfies TermPlan[],
};

export const subscription = {
  title: "Scholar's Subscription",
  description:
    "Monthly auto-pay for new clients. Our most flexible, family-friendly plan. New Student Enrollment fee waived with a 3-month commitment.",
  plans: [
    {
      name: "4 Hours / Month",
      meta: "Monthly Auto-Pay",
      prices: ["$295/mo", "$300/mo", "$310/mo", "$335/mo"],
    },
    {
      name: "8 Hours / Month",
      meta: "Monthly Auto-Pay",
      prices: ["$570/mo", "$585/mo", "$610/mo", "$650/mo"],
    },
  ] satisfies PricedPlan[],
  bestFor:
    "Busy families who want consistent academic support without tracking hours. Easy monthly billing with academic consistency.",
};

export const academicYear = {
  title: "Full Academic Year Plan",
  description:
    "9 months, August through June. Returning clients only. Includes loyalty discount & priority scheduling.",
  plans: [
    {
      name: "4 Hours / Month",
      meta: "36 Hours Total · Monthly Billing",
      prices: ["$285/mo", "$295/mo", "$305/mo", "$325/mo"],
    },
    {
      name: "8 Hours / Month",
      meta: "72 Hours Total · Monthly Billing",
      prices: ["$560/mo", "$575/mo", "$595/mo", "$630/mo"],
    },
    {
      name: "4 Hours / Month",
      meta: "36 Hours Total · One-time payment",
      prices: ["$2,435", "$2,520", "$2,605", "$2,780"],
      badge: "Save 5%",
      featured: true,
    },
    {
      name: "8 Hours / Month",
      meta: "72 Hours Total · One-time payment",
      prices: ["$4,790", "$4,915", "$5,085", "$5,385"],
      badge: "Save 5%",
      featured: true,
    },
  ] satisfies PricedPlan[],
  oneTimeNote: "One-time payment · save 5% · our lowest rate, as low as $66/hr",
  bestFor:
    "Returning families who want consistent support and the best hourly rate we offer. Perfect for students with academic gaps or long-term goals.",
};

export const bonusIncentives = {
  title: "Bonus Incentives",
  items: [
    { title: "Referral Credit", body: "$50 credit when your friend enrolls in 10+ hours." },
    { title: "Sibling Discount", body: "5% off the second child's package." },
    {
      title: "Free Consult or Mock Exam",
      body: "Included with all 20-hour and full-year plans.",
    },
    {
      title: "Priority Scheduling",
      body: "Available to all 20-hour and full-year clients.",
    },
  ],
};

export const policies = {
  title: "Policies & Procedures",
  sections: [
    {
      title: "A. Standard Hourly Packages",
      groups: [
        {
          title: "Usage Timelines",
          items: [
            "Starter Stack: use within 45 days",
            "Study Sprint: use within 75 days",
            "Honor Roll: use within 120 days",
          ],
        },
        {
          title: "Scheduling & Flexibility",
          items: [
            "Sessions must be booked in advance",
            "Can be split into 30 / 60 / 90-minute blocks",
            "One-time 30-day extension may be granted in writing for emergencies",
          ],
        },
        {
          title: "Cancellations",
          items: [
            "24-hour notice required to cancel or reschedule",
            "Late cancellations result in forfeiture of the session unless documented emergency",
          ],
        },
        {
          title: "Credits & Refunds",
          items: [
            "Unused hours may convert to credit (90-day expiration)",
            "Packages are non-refundable",
            "Withdrawal requests may be reviewed with a $50 admin fee",
          ],
        },
      ],
    },
    {
      title: "B. Scholar's Subscription (Monthly Auto-Pay)",
      groups: [
        {
          title: "Billing & Structure",
          items: ["Billed monthly", "3-month minimum to waive registration fee"],
        },
        {
          title: "Unused Hours",
          items: [
            "Do not roll over automatically",
            "May be extended 30 days upon written request",
            "May convert to credit (90-day expiration)",
          ],
        },
        {
          title: "Cancellation Policy",
          items: [
            "Requires 14-day written notice to pause or cancel",
            "No refunds for unused time once a billing cycle starts",
          ],
        },
      ],
    },
    {
      title: "C. Full Academic Year Plan (Returning Clients)",
      groups: [
        {
          title: "Structure",
          items: [
            "Runs late August through mid-June",
            "Hours must be used by June 15",
            "Bulk use not permitted unless approved",
          ],
        },
        {
          title: "Unused Hours",
          items: [
            "Up to 4 unused hours may convert into credit (90-day expiration)",
            "No summer rollover unless pre-approved",
          ],
        },
        {
          title: "Withdrawal & Refunds",
          items: [
            "Plans are non-refundable",
            "Withdrawal requests reviewed case-by-case",
            "May be subject to a $100 administrative fee",
          ],
        },
      ],
    },
    {
      title: "D. General Terms (All Packages)",
      groups: [
        {
          title: "",
          items: [
            "The $95 New Student Enrollment fee applies to the first student only; siblings enrolling within the same 12 months pay $50",
            "Enrollment credit toward an upgrade must be requested within 30 days of the first session",
            "The enrollment fee is non-refundable once a student has been matched and scheduled",
            "Packages cannot be split between siblings unless approved",
            "Virtual and in-person sessions available",
            "Tutor assignments based on subject and availability",
            "All cancellations and changes must be submitted via email",
            "Policies reviewed annually and subject to change",
          ],
        },
      ],
    },
    {
      title: "E. Emerging Reader Intervention",
      groups: [
        {
          title: "Scheduling",
          items: [
            "Sessions are booked on fixed weekly days and times to protect frequency",
            "Consistency is the intervention; sporadic attendance changes the outcome",
            "Sessions are 30 minutes and are not combined into longer blocks",
          ],
        },
        {
          title: "Cancellations & Make-Ups",
          items: [
            "24-hour notice required to cancel or reschedule",
            "One make-up session included per 8 weeks of enrollment",
            "Additional missed sessions are forfeited unless documented emergency",
          ],
        },
        {
          title: "Terms & Refunds",
          items: [
            "12-Week Core: complete within 15 weeks",
            "24-Week Intervention: complete within 28 weeks",
            "Plans are non-refundable; withdrawal requests reviewed case-by-case and may be subject to a $100 administrative fee",
          ],
        },
      ],
    },
  ],
};

export const packagesFaqs = [
  {
    q: "Do you offer virtual or in-person sessions?",
    a: "Both. You can choose virtual, in-person, or a mix, based on what works best for your family and your tutor's availability.",
  },
  {
    q: "How soon can we get started?",
    a: "Most families begin within a week of their free consultation. We match your child with a tutor based on subject and schedule, then book your first session.",
  },
  {
    q: "What happens to hours we don't use?",
    a: "Unused hours may convert to credit with a 90-day expiration. Specific timelines vary by package; see the Policies section above for the details that apply to your plan.",
  },
  {
    q: "What subjects and grade levels do you cover?",
    a: "We tutor K-12 across all core subjects, including AP Math and Science, plus SAT and ACT preparation.",
  },
  {
    q: "What does the New Student Enrollment fee cover?",
    a: "A one-time $95 fee for new families covering intake, tutor matching, scheduling, and all standard session materials. It applies to the Starter Stack and Study Sprint, and is waived with the Honor Roll Plan, a 3-month Scholar's Subscription, any Reading Intervention term, or a Full Academic Year Plan. Move up to a larger package within 30 days and we credit it toward your new plan.",
  },
  {
    q: "My child is struggling with reading. Which option is right?",
    a: "Start with the Emerging Reader Intervention rather than general tutoring. Reading gaps close through frequent, structured practice, which is why that program meets three times a week in shorter sessions. If you are not sure whether your child needs intervention or subject support, book a consultation and we will run a reading diagnostic first.",
  },
  {
    q: "Do you offer a sibling or referral discount?",
    a: "Yes. Siblings receive 5% off the second child's package, and you earn a $50 referral credit when a friend enrolls in 10+ hours.",
  },
];
