import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { isNoticeLive, type SiteNotice } from "@/lib/notice-window";

/**
 * A short-lived announcement under a page hero — a closure, a pause on a
 * product, anything true this week and wrong next week.
 *
 * Dated rather than hand-managed, for the same reason the back-to-school band
 * is: a notice somebody has to remember to delete is a notice still on the
 * site in November, and this one contradicts the booking calendar the moment
 * it goes stale. Outside its window it renders nothing at all, and the pages
 * revalidate hourly, so it retires without a deploy.
 *
 * Gold on navy rather than a red alert: nothing has gone wrong, a week is
 * simply full. It has to be noticed without reading like an outage.
 *
 * `fall` reuses the ember pair the back-to-school band introduced, rather than
 * adding more colour outside the two-colour brand. Those values were chosen
 * dark enough to carry gold, so the same gold chip and heading clear AA on
 * them: white body text measures 7.96:1 and 5.55:1 at the two ends of the
 * gradient, gold 7.33:1 and 4.94:1.
 */
const tones = {
  navy: "border-sun-500/30 bg-navy-950",
  fall: "border-sun-500/30 bg-gradient-to-br from-ember-700 to-ember-600",
} as const;

export function Notice({ notice }: { notice: SiteNotice }) {
  if (!isNoticeLive(notice)) return null;

  return (
    <div className={`border-b py-5 text-white ${tones[notice.tone ?? "navy"]}`}>
      <Container>
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun-500 text-navy-950">
            <Icon name="clock" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-sun-500">
              {notice.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/85">{notice.body}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
