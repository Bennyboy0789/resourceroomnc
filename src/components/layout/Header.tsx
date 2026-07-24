"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navigation, site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Any navigation closes whatever was open. Reset during render rather than
  // in an effect so the menus never paint open on the new route.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />

        <nav ref={navRef} className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navigation.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-navy-700 transition-colors hover:text-navy-900"
                >
                  {item.label}
                  <Icon name="arrowUpRight" className="h-3.5 w-3.5 opacity-60" />
                </a>
              );
            }

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-navy-900",
                    isActive(item.href) ? "text-navy-900" : "text-navy-700",
                  )}
                >
                  {item.label}
                </Link>
              );
            }

            const open = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenMenu(open ? null : item.label)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-navy-900",
                    isActive(item.href) ? "text-navy-900" : "text-navy-700",
                  )}
                >
                  {item.label}
                  <Icon
                    name="chevronDown"
                    className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
                  />
                </button>
                <div
                  className={cn(
                    "absolute left-0 top-full w-64 origin-top-left pt-2 transition",
                    open
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0",
                  )}
                >
                  <ul className="overflow-hidden rounded-xl border border-navy-900/10 bg-white p-2 shadow-lg shadow-navy-900/10">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-navy-700 transition-colors hover:bg-mist hover:text-navy-900"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* `max-sm:hidden` rather than `hidden sm:inline-flex`: Button already
              sets `inline-flex`, and an unvariant utility would win the cascade. */}
          <Button href={site.consultationUrl} className="max-sm:hidden">
            Free Consultation
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-lg border border-navy-900/15 text-navy-900 lg:hidden"
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div className="border-t border-navy-900/10 bg-white lg:hidden">
          <Container className="max-h-[70vh] overflow-y-auto py-4">
            <ul className="flex flex-col gap-1">
              {navigation.map((item) => {
                if (item.external) {
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-navy-800"
                      >
                        {item.label}
                        <Icon name="arrowUpRight" className="h-4 w-4 opacity-60" />
                      </a>
                    </li>
                  );
                }

                if (!item.children) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-3 py-3 text-base font-medium text-navy-800"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                const expanded = mobileSection === item.label;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setMobileSection(expanded ? null : item.label)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-navy-800"
                    >
                      {item.label}
                      <Icon
                        name="chevronDown"
                        className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
                      />
                    </button>
                    {expanded ? (
                      <ul className="mb-2 ml-3 flex flex-col gap-1 border-l border-navy-900/10 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2.5 text-sm text-navy-600"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex flex-col gap-3 border-t border-navy-900/10 pt-4">
              <Button href={site.consultationUrl} size="lg">
                Schedule a Free Consultation
              </Button>
              <Button href={site.phoneHref} variant="quiet" size="lg">
                <Icon name="phone" className="h-4 w-4" />
                {site.phone}
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
