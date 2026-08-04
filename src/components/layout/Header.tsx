"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { CartButton } from "@/components/shop/CartDrawer";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { categories, resolveItems } from "@/content/categories";
import { navigation, site } from "@/content/site";
import { cn } from "@/lib/cn";

const triggerClasses =
  "flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors";

export function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

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
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-navy-950/10 bg-white"
      onMouseLeave={() => setOpenMenu(null)}
    >
      {/* gap-3 on small screens: at a 320px viewport (the 400% zoom target for
          WCAG 1.4.10) a 24px gap pushed the cart and menu buttons past the
          right edge and put a horizontal scrollbar on every page. */}
      <Container size="wide" className="flex h-20 items-center justify-between gap-3 sm:gap-6">
        {/* Allowed to shrink so the logo — not the controls — gives way when a
            visitor's text-spacing overrides widen everything (WCAG 1.4.12). */}
        <div className="min-w-0 shrink">
          <Logo />
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {navigation.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(triggerClasses, "text-navy-700 hover:text-navy-950")}
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  {item.label}
                  <Icon name="arrowUpRight" className="h-3 w-3 opacity-60" />
                </a>
              );
            }

            if (!item.mega && !item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setOpenMenu(null)}
                  className={cn(
                    triggerClasses,
                    isActive(item.href) ? "text-navy-950" : "text-navy-700 hover:text-navy-950",
                  )}
                >
                  {item.label}
                </Link>
              );
            }

            const open = openMenu === item.label;
            return (
              <button
                key={item.label}
                type="button"
                aria-expanded={open}
                onMouseEnter={() => setOpenMenu(item.label)}
                onClick={() => setOpenMenu(open ? null : item.label)}
                className={cn(
                  triggerClasses,
                  isActive(item.href) || open
                    ? "text-navy-950"
                    : "text-navy-700 hover:text-navy-950",
                )}
              >
                {item.label}
                <Icon
                  name="chevronDown"
                  className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-navy-700 transition-colors hover:text-navy-950 xl:flex"
          >
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </a>
          {/* `max-sm:hidden` rather than `hidden sm:inline-flex`: Button already
              sets `inline-flex`, and an unvariant utility would win the cascade. */}
          <Button href={site.consultationUrl} variant="navy" className="max-sm:hidden">
            Free Consultation
          </Button>
          <CartButton />
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center border border-navy-950/15 text-navy-950 lg:hidden"
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </Container>

      {/* Desktop panels. Rendered outside the Container so the program menu can
          span the full width the way the header border does. Only the open
          panel is mounted, so AnimatePresence can play it out on close. */}
      <AnimatePresence initial={false}>
        {navigation.map((item) => {
          if (item.external || (!item.mega && !item.children)) return null;
          if (openMenu !== item.label) return null;

          return (
            <motion.div
              key={item.label}
              className="absolute inset-x-0 top-full hidden overflow-hidden border-b border-navy-950/10 bg-white shadow-xl shadow-navy-950/5 lg:block"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.mega ? <ProgramMega /> : <SimpleMenu links={item.children ?? []} />}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.div
            key="mobile"
            className="overflow-hidden lg:hidden"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <MobileMenu section={mobileSection} onSection={setMobileSection} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/**
 * Full-width program menu: one column per category, each headed by a link to
 * the category page and listing the products inside it.
 *
 * The previous version rendered a 48px photograph beside all ten programs.
 * Joe's note was that the site felt overwhelming, and a menu of ten pictures is
 * a large part of that — so the thumbnails are gone and the menu is now a plain
 * list under four headings. The heading itself is a link, which is what makes
 * "home → category → product" reachable in the promised three clicks.
 */
function ProgramMega() {
  return (
    <Container size="wide" className="grid gap-10 py-10 lg:grid-cols-[1fr_18rem] lg:gap-14">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category.slug}>
            <Link
              href={`/${category.slug}`}
              className="eyebrow group flex items-center gap-1.5 border-b border-navy-950/10 pb-3 text-brand-500 hover:text-navy-950"
            >
              {category.label}
              <Icon
                name="arrowRight"
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <ul className="mt-4 space-y-0.5">
              {resolveItems(category).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-1.5 text-sm font-semibold leading-snug text-navy-700 transition-colors hover:text-brand-500"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Featured slot — the menu's one merchandised position. */}
      <Link href={site.consultationUrl} className="group flex flex-col">
        <span className="relative block overflow-hidden rounded-card bg-navy-950">
          <PhotoSlot
            src="/images/why-individualized.jpg"
            alt=""
            icon="target"
            ratio="4/3"
            sizes="18rem"
            className="rounded-none transition-transform duration-500 group-hover:scale-105"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-navy-950/45" />
          <span className="absolute inset-0 flex flex-col justify-end p-5">
            <span className="eyebrow text-sun-500">Not sure which fits?</span>
            <span className="mt-2 text-lg font-extrabold uppercase leading-tight tracking-tight text-white">
              Talk to an educator, free
            </span>
          </span>
        </span>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-navy-950">
          Book a consultation
          <Icon
            name="arrowRight"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      </Link>
    </Container>
  );
}

function SimpleMenu({ links }: { links: { label: string; href: string }[] }) {
  return (
    <Container size="wide" className="py-8">
      <ul className="flex flex-wrap gap-x-10 gap-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-bold uppercase tracking-[0.05em] text-navy-700 transition-colors hover:text-navy-950"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

function MobileMenu({
  section,
  onSection,
}: {
  section: string | null;
  onSection: (value: string | null) => void;
}) {
  return (
    <div className="border-t border-navy-950/10 bg-white lg:hidden">
      <Container className="max-h-[75vh] overflow-y-auto py-4">
        <ul className="flex flex-col">
          {navigation.map((item) => {
            if (item.external) {
              return (
                <li key={item.label} className="border-b border-navy-950/8">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-[0.06em] text-navy-900"
                  >
                    {item.label}
                    <Icon name="arrowUpRight" className="h-4 w-4 opacity-60" />
                  </a>
                </li>
              );
            }

            if (!item.mega && !item.children) {
              return (
                <li key={item.label} className="border-b border-navy-950/8">
                  <Link
                    href={item.href}
                    className="block py-4 text-sm font-bold uppercase tracking-[0.06em] text-navy-900"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            const expanded = section === item.label;
            /* On a phone the Programs section lists the four categories, not
               all ten programs — tapping a category is the second of the three
               clicks, and a flat list of every product here would rebuild the
               wall of links this restructure removed. */
            const links = item.mega
              ? categories.map((category) => ({
                  label: category.label,
                  href: `/${category.slug}`,
                }))
              : (item.children ?? []);

            return (
              <li key={item.label} className="border-b border-navy-950/8">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => onSection(expanded ? null : item.label)}
                  className="flex w-full items-center justify-between py-4 text-sm font-bold uppercase tracking-[0.06em] text-navy-900"
                >
                  {item.label}
                  <Icon
                    name="chevronDown"
                    className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
                  />
                </button>
                {expanded ? (
                  <ul className="mb-3 flex flex-col border-l border-navy-950/10 pl-4">
                    {item.mega ? (
                      <li>
                        <Link href="/programs" className="block py-2.5 text-sm font-semibold text-navy-950">
                          All programs
                        </Link>
                      </li>
                    ) : null}
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="block py-2.5 text-sm text-navy-600">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-col gap-3">
          <Button href={site.consultationUrl} variant="navy" size="lg">
            Schedule a Free Consultation
          </Button>
          <Button href={site.phoneHref} variant="quiet" size="lg">
            <Icon name="phone" className="h-4 w-4" />
            {site.phone}
          </Button>
        </div>
      </Container>
    </div>
  );
}
