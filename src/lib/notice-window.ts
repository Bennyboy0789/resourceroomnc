export type SiteNotice = {
  /** Inclusive UTC dates. Outside them the notice does not render at all. */
  from: string;
  until: string;
  title: string;
  body: string;
};

/** Midnight UTC, so the window never depends on where the server runs. */
function day(date: string) {
  return Date.parse(`${date}T00:00:00Z`);
}

/** `until` is inclusive, so the window runs to the end of that day rather than
    cutting out at midnight as it begins. */
function endOfDay(date: string) {
  return day(date) + 24 * 60 * 60 * 1000 - 1;
}

/**
 * Whether a notice is inside its own window.
 *
 * Lives apart from the component so the dates can be exercised directly — the
 * component is JSX, and the boundary either side of a closure week is exactly
 * the thing worth testing rather than eyeballing.
 */
export function isNoticeLive(notice: SiteNotice, now = Date.now()) {
  return now >= day(notice.from) && now <= endOfDay(notice.until);
}
