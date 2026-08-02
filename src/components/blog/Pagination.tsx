import Link from "next/link";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Archive pagination.
 *
 * Real links, not a "load more" button: each page has to be its own crawlable
 * URL or posts past the ninth are invisible to search. Long runs collapse to
 * first / neighbours / last with an ellipsis so the control never wraps on a
 * phone.
 */
export function Pagination({
  page,
  totalPages,
  /** `href(1)` should return the un-suffixed base URL. */
  href,
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const numbers: (number | "gap")[] = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) {
      numbers.push(n);
    } else if (numbers[numbers.length - 1] !== "gap") {
      numbers.push("gap");
    }
  }

  const box =
    "inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-sm font-bold transition-colors";

  return (
    <nav aria-label="Blog pages" className="mt-16 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          rel="prev"
          className={cn(
            box,
            "border border-navy-900/20 text-navy-700 hover:border-navy-900/50 hover:text-navy-950",
          )}
        >
          <Icon name="arrowLeft" className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Link>
      ) : null}

      {numbers.map((n, index) =>
        n === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-navy-500" aria-hidden="true">
            …
          </span>
        ) : n === page ? (
          <span
            key={n}
            aria-current="page"
            className={cn(box, "border border-navy-900 bg-navy-900 text-white")}
          >
            {n}
          </span>
        ) : (
          <Link
            key={n}
            href={href(n)}
            className={cn(
              box,
              "border border-navy-900/20 text-navy-700 hover:border-navy-900/50 hover:text-navy-950",
            )}
          >
            <span className="sr-only">Page </span>
            {n}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          rel="next"
          className={cn(
            box,
            "border border-navy-900/20 text-navy-700 hover:border-navy-900/50 hover:text-navy-950",
          )}
        >
          <Icon name="arrowRight" className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Link>
      ) : null}
    </nav>
  );
}
