import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { addressLine, site } from "@/content/site";

export function TopBar() {
  return (
    <div className="bg-navy-950 text-white/80">
      <Container className="flex h-10 items-center justify-between gap-4 text-xs sm:text-sm">
        <p className="flex items-center gap-2 truncate">
          <Icon name="pin" className="h-4 w-4 shrink-0 text-sun-500" />
          <span className="truncate">{addressLine}</span>
        </p>
        <div className="flex items-center gap-5">
          <a
            href={site.emailHref}
            className="hidden items-center gap-2 transition-colors hover:text-white sm:flex"
          >
            <Icon name="mail" className="h-4 w-4 text-sun-500" />
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="flex items-center gap-2 font-semibold text-white transition-colors hover:text-sun-400"
          >
            <Icon name="phone" className="h-4 w-4 text-sun-500" />
            {site.phone}
          </a>
        </div>
      </Container>
    </div>
  );
}
