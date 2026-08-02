import type { IconName } from "@/components/icons";
import type { Course } from "@/content/courses";

/** Icon fallback per catalog group, used when a course has no image. */
const GROUP_ICONS: Record<string, IconName> = {
  "STEAM Programs": "sparkle",
  "LEGO Robotics": "target",
  "Gaming Education": "play",
  "Emerging Learners": "book",
  Workshops: "users",
  "Tutoring Programs": "pencil",
  "Test Prep": "target",
};

export function groupIcon(group: string): IconName {
  return GROUP_ICONS[group] ?? "sparkle";
}

/** Which program page a catalog group belongs under. */
const GROUP_PROGRAM: Record<string, string> = {
  "STEAM Programs": "camps",
  "LEGO Robotics": "camps",
  "Gaming Education": "camps",
  "Emerging Learners": "tutoring",
  Workshops: "tutoring",
  "Tutoring Programs": "tutoring",
  "Test Prep": "sat-act-prep",
};

export function programForGroup(group: string): string {
  return GROUP_PROGRAM[group] ?? "camps";
}

function money(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatPrice(price: Course["price"]): string | null {
  if (!price) return null;
  if (price.low === price.high) return money(price.low);
  return `${money(price.low)} – ${money(price.high)}`;
}
