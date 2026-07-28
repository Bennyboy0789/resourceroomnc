import { Icon } from "@/components/icons";

/**
 * Continuously scrolling strip of credentials.
 *
 * The list is rendered twice: the first copy is the real content, the second is
 * `aria-hidden` so screen readers and search engines see each credential once
 * while the animation still has a duplicate to loop against.
 */
export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee-viewport border-y border-white/12 bg-navy-950 py-5 text-white">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <li key={item} className="flex shrink-0 items-center gap-6 px-6">
                <Icon name="badge" className="h-4 w-4 shrink-0 text-sun-500" />
                <span className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.12em]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
