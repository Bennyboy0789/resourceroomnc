export type Review = {
  name: string;
  role: string;
  quote: string;
  /** Where the review came from, e.g. "Google". Shown as attribution. */
  source?: string;
  /** Links back to the review on its original platform, when there is one. */
  url?: string;
};

/** Kept for the existing import name. */
export type Testimonial = Review;

/**
 * Reviews shown on the home page.
 *
 * These four are the ones carried over from resourceroomnc.com. Anything added
 * here must be a real review a real person wrote — see docs/google-reviews.md
 * for how to wire the Google Business Profile feed in rather than adding them
 * by hand.
 */
export const testimonials: Review[] = [
  {
    name: "Jenny H",
    role: "Parent",
    quote:
      "The Resource Room has been such a help to our family! From elementary to high school they know their stuff. So glad we found them!",
  },
  {
    name: "Megan R",
    role: "Student",
    quote:
      "Amazing staff and environment! They helped me tremendously to do well in my courses and with the SAT.",
  },
  {
    name: "Karen C",
    role: "Parent",
    quote:
      "Resource Room has been a tremendous help to my 4th grade daughter. Her grades went up significantly and she is far more confident in class.",
  },
  {
    name: "Victoria V",
    role: "Parent",
    quote:
      "We use Resource Room for multiple children, and each of them gets a program that fits where they actually are. That is rare.",
  },
];
