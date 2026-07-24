export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
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
