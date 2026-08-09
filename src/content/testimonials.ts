export type Review = {
  name: string;
  role: string;
  quote: string;
  /** Where the review came from, e.g. "Google". Shown as attribution. */
  source?: string;
  /** Links back to the review on its original platform, when there is one. */
  url?: string;
  /**
   * What the review is actually about, so a program page can show the reviews
   * that speak to it rather than the full mixed set.
   *
   * Tagged from what the reviewer wrote, not from what we would like it to
   * say — a review that only mentions SAT prep is not tutoring evidence.
   * A review can carry more than one tag when it genuinely covers more.
   */
  topics?: ("tutoring" | "test-prep" | "college-prep")[];
};

/** The reviews that speak to a given topic, in their original order. */
export function reviewsAbout(topic: NonNullable<Review["topics"]>[number]): Review[] {
  return testimonials.filter((review) => review.topics?.includes(topic));
}

/** Kept for the existing import name. */
export type Testimonial = Review;

/**
 * Reviews shown on the home page.
 *
 * Transcribed in full from resourceroomnc.com — see
 * `docs/live-content/home.txt`. Anything added here must be a real review a
 * real person wrote; wire the Google Business Profile feed in rather than
 * adding them by hand.
 */
export const testimonials: Review[] = [
  {
    name: "Jenny H",
    role: "Parent of student at Resource Room",
    quote:
      "The Resource Room has been such a help to our family! From elementary to high school they know their stuff. So glad we found them!",
    topics: ["tutoring"],
  },
  {
    name: "Megan R",
    role: "Student at Resource Room",
    quote:
      "Amazing staff and environment! I was one of the first clients at the resource room and continued with them all throughout high school. They helped me tremendously to do well in my courses at school and with the SAT. After that I began to work there because it was such a great place to be. Now, I am a tutor at my University for Nursing courses and I attribute that to all my training at the Resource room. I highly recommend.",
  },
  {
    name: "Karen C",
    role: "Parent of student at Resource Room",
    quote:
      "Resource Room has been a tremendous help to my 4th grade daughter this year — she loves working with the staff, and her grades went up significantly this year. She is on her school's high honor role for the first time in years! More importantly, she gained confidence and is much happier in school. They have also been a great resource during Covid school closure, as they kept her up to date with her work. As a dual working family, that was such a huge help!!",
    topics: ["tutoring"],
  },
  {
    name: "Victoria V",
    role: "Parent of student at Resource Room",
    quote:
      "I sent my son to the Resource Room for SAT Prep, primarily in math. He had already taken the SAT and this was an attempt to improve upon his scores when taking it again. Due to his school and work schedule, his time was limited. I reached out to the Resource Room and spoke to Sam regarding an improvement strategy. She worked with him once a week for two months and made the most of the little time they had together. My son's score went up by 70 points. I truly believe that this was a result of the work that Sam did with him. She honed in on his strengths and evened out his weaknesses. I highly recommend the Resource Room for all of your child's academic needs!",
  },
  {
    name: "Greg B",
    role: "Parent of student at Resource Room",
    quote:
      "Our 2 children have used Resource Room for the last couple of years for general tutoring in math, science and global studies. Their grades have always gotten better after RR. We have also used them for SAT/ACT and Regents and have been very pleased with the results. Staff is very professional, our children are very comfortable in the environment, and choose to go there themselves for help. RR has given them knowledge and confidence. I would recommend Resource Room to anyone that is looking for tutoring.",
    topics: ["tutoring", "test-prep"],
  },
  {
    name: "Remm B",
    role: "Student at Resource Room",
    quote:
      "Resource Room really helped me with the college application process. Joe helped me get organized with my essays and deadlines. He answered the questions all high school seniors have about applications but don't know who or how to ask. Also, I felt as though I could call or write anytime and get almost instant feedback. Resource Room indubitably made what was supposed to be one of the most stressful times in high school feel manageable and efficient.",
  },
  {
    name: "Alissa M",
    role: "Parent of student at Resource Room",
    quote:
      "The staff at the resource room was wonderful with guiding me towards the right decisions for my child. This tutoring service has improved my son's confidence in math and writing. I highly recommend any one of their tutors. Sam and Joe are excellent at getting to the heart of the issue.",
    topics: ["tutoring"],
  },
  {
    name: "Sherri S",
    role: "Student at Resource Room",
    quote:
      "Sam and Joe have given us an excellent experience. Fantastic communication and prompt response any time I had a question. Rigorous and very informative SAT prep class. Highly recommend.",
  },
  {
    name: "Erik A",
    role: "Student at Resource Room",
    quote:
      "Great experience working with Sam for Calculus and SAT I and SAT II. Have been coming here since they opened and have stayed for many other subjects including my college essay which was a major help. Highly recommend for other high school students doing SAT and college essays.",
    topics: ["tutoring", "test-prep", "college-prep"],
  },
  {
    name: "Katie M",
    role: "Student at Resource Room",
    quote:
      "Sam and Joe, the owners, are super nice, fun, and helped me boost my scores by 210 points. They also help with getting ready for college.",
    source: "Google",
  },
  {
    name: "Ashley S",
    role: "Parent of student at Resource Room",
    quote:
      "My son has moved mountains since working with the amazing staff at the Resource Room. The SAT prep courses have beyond impacted our household.",
    source: "Google",
  },
  {
    name: "Maya B",
    role: "Student at Resource Room",
    quote:
      "My biggest challenge preparing for the SAT was my lack of confidence and learning gaps caused by Covid. Sam specializes in math, Joe focuses on English. Together they make a remarkable team.",
    source: "Google",
  },
];
