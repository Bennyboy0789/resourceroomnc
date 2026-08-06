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
  pricesEffective: "Prices effective June 20, 2026.",
};

/** Every package is priced across the same four bands, in this order. */
export const gradeTiers = ["K–5", "Grades 6–8", "Grades 9–12", "SAT/AP"] as const;

export const registrationFee = {
  title: "Registration Fee",
  body: "A one-time $75 registration fee applies to new clients. This fee is waived for:",
  waivedFor: [
    "Purchases of 10+ hours",
    "Enrollment in a Full Academic Year Plan",
    "3-month commitment to the Scholar's Subscription",
  ],
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
      meta: "5 Hours · From $70/hr",
      prices: ["$350", "$360", "$385", "$440"],
      note: "Registration fee applies",
      bestFor:
        "Families new to Resource Room, or those targeting one subject, prepping for a quiz, or trying tutoring before a longer commitment.",
    },
    {
      name: "Study Sprint",
      meta: "10 Hours · From $68/hr",
      prices: ["$680", "$700", "$750", "$855"],
      note: "Registration waived + discounted rate",
      bestFor:
        "Students who need academic reinforcement over a few weeks. Ideal for mid-quarter check-ins or project-based support.",
    },
    {
      name: "Honor Roll Plan",
      meta: "20 Hours · From $65/hr",
      prices: ["$1,300", "$1,340", "$1,420", "$1,625"],
      note: "Registration waived + best discounted rate",
      badge: "Best value",
      featured: true,
      bestFor:
        "Students who benefit from consistent weekly tutoring. Great for improving grades, prepping for state tests, and building executive functioning skills.",
    },
  ],
};

export const subscription = {
  title: "Scholar's Subscription",
  description:
    "Monthly auto-pay for new clients. Our most flexible, family-friendly plan. Registration fee waived with a 3-month commitment.",
  plans: [
    {
      name: "4 Hours / Month",
      meta: "Monthly Auto-Pay",
      prices: ["$270/mo", "$280/mo", "$300/mo", "$330/mo"],
    },
    {
      name: "8 Hours / Month",
      meta: "Monthly Auto-Pay",
      prices: ["$515/mo", "$535/mo", "$575/mo", "$640/mo"],
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
      prices: ["$260/mo", "$270/mo", "$290/mo", "$315/mo"],
    },
    {
      name: "8 Hours / Month",
      meta: "72 Hours Total · Monthly Billing",
      prices: ["$505/mo", "$525/mo", "$560/mo", "$630/mo"],
    },
    {
      name: "4 Hours / Month",
      meta: "36 Hours Total · One-time payment",
      prices: ["$2,225", "$2,310", "$2,480", "$2,695"],
      badge: "Save 5%",
      featured: true,
    },
    {
      name: "8 Hours / Month",
      meta: "72 Hours Total · One-time payment",
      prices: ["$4,320", "$4,490", "$4,790", "$5,385"],
      badge: "Save 5%",
      featured: true,
    },
  ] satisfies PricedPlan[],
  oneTimeNote: "One-time payment · save 5% · our lowest rate, as low as $60/hr",
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
            "Packages cannot be split between siblings unless approved",
            "Virtual and in-person sessions available",
            "Tutor assignments based on subject and availability",
            "All cancellations and changes must be submitted via email",
            "Policies reviewed annually and subject to change",
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
    q: "Do you offer a sibling or referral discount?",
    a: "Yes. Siblings receive 5% off the second child's package, and you earn a $50 referral credit when a friend enrolls in 10+ hours.",
  },
];
