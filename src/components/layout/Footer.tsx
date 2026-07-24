import Link from "next/link";
import { Icon, SocialIcon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { addressLine, footerColumns, site, socials } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="text-xl font-bold tracking-tight text-white">Resource Room</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              A complete learning center in Holly Springs, NC — tutoring, camps, test prep and
              specialized programs for learners of all ages.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-gold-500" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-gold-500" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>{addressLine}</span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-500 hover:text-navy-950"
                >
                  <SocialIcon name={social.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="eyebrow text-gold-400">{column.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>Holly Springs Business of the Year 2022 · Raleigh&rsquo;s Best 2025 Bronze, Education</p>
        </div>
      </Container>
    </footer>
  );
}
