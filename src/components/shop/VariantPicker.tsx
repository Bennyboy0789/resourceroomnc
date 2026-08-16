"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { useCart } from "@/components/shop/CartProvider";
import type { CatalogProduct, CatalogVariant } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { groupByMonth } from "@/lib/option-date";

/*
 * Below this many options a flat wrap is easier to read than a filtered one:
 * the chips fit on a couple of rows and the month headings would be more
 * furniture than help. A camp season runs to about sixty and needs them.
 */
const GROUP_FROM = 12;

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

/**
 * Asks for an attribute by name. Some are already phrased as an instruction in
 * Stripe ("Choose Your Program"), and prefixing those gave "Choose Choose Your
 * Program" on the button.
 */
function prompt(name: string) {
  return /^(choose|select|pick)\b/i.test(name) ? name : `Choose ${name}`;
}

/**
 * Enrollment options for one product, resolving to one or more Stripe Prices.
 *
 * Most products here vary along a single axis — which camp week, which test
 * date, which section. Families routinely buy several at once (two weeks of
 * summer camp, three teacher workdays), so when a product has exactly one
 * priced attribute every option is a checkbox and each one chosen becomes its
 * own line in the cart. Making them add the weeks one at a time, waiting for
 * the drawer between each, was the single most tedious thing about enrolling.
 *
 * Homeschool Co-Op is the one product priced on two axes (Grade Level ×
 * Enrollment Type). A cross-product of those is meaningless — you enrol one
 * child at one grade — so it stays single-select, and a second child is a
 * second trip through the picker.
 *
 * Not every combination of attributes exists: WooCommerce products routinely
 * priced some pairings and not others. Rather than let someone pick a dead end,
 * each option is checked against the remaining variants and disabled when
 * nothing is left, the same way the old store behaved.
 *
 * Informational attributes (Semester, and anything else that was declared a
 * variation attribute but left unset on every variant) are collected here and
 * travel with the order as a note. They deliberately take no part in resolving
 * the price, because in the source data they never did.
 */
export function VariantPicker({ product }: { product: CatalogProduct }) {
  const cart = useCart();
  const priced = useMemo(
    () => product.attributes.filter((a) => !a.informational),
    [product.attributes],
  );
  const informational = useMemo(
    () => product.attributes.filter((a) => a.informational),
    [product.attributes],
  );

  /** One axis to choose along means picking several is unambiguous. */
  const multiSelect = priced.length === 1 && priced[0].options.length > 1;

  // Values are arrays even in single-select mode, so the matching and pruning
  // below has one shape rather than two.
  const [selection, setSelection] = useState<Record<string, string[]>>(() =>
    // A single-variant product has nothing to choose; pre-select it so the
    // button is live immediately.
    product.variants.length === 1
      ? Object.fromEntries(
          Object.entries(product.variants[0].options).map(([name, value]) => [name, [value]]),
        )
      : {},
  );
  const [notes, setNotes] = useState<Record<string, string>>({});
  /** Active month filter per attribute; absent means "all". */
  const [month, setMonth] = useState<Record<string, string>>({});

  const chosen = (name: string) => selection[name] ?? [];

  /** Variants still reachable given everything chosen except `ignore`. */
  const matching = (ignore?: string) =>
    product.variants.filter((variant) =>
      priced.every(({ name }) => {
        if (name === ignore) return true;
        const values = chosen(name);
        return values.length === 0 || values.includes(variant.options[name]);
      }),
    );

  const selectedVariants = useMemo<CatalogVariant[]>(() => {
    if (!priced.length) return product.variants[0] ? [product.variants[0]] : [];

    // Every axis needs an answer before anything resolves to a price.
    if (!priced.every((attribute) => (selection[attribute.name] ?? []).length)) return [];

    if (multiSelect) {
      // Click order, not price order, so the cart reads back in the sequence
      // the family built it.
      const { name } = priced[0];
      return (selection[name] ?? []).flatMap((option) => {
        const variant = product.variants.find((v) => v.options[name] === option);
        return variant ? [variant] : [];
      });
    }

    return product.variants.filter((variant) =>
      priced.every((attribute) =>
        (selection[attribute.name] ?? []).includes(variant.options[attribute.name]),
      ),
    );
  }, [multiSelect, priced, product.variants, selection]);

  const total = selectedVariants.reduce((sum, variant) => sum + variant.amount, 0);
  const missingNote = informational.find((attribute) => !notes[attribute.name]);
  const canAdd = selectedVariants.length > 0 && !missingNote;

  function choose(name: string, value: string) {
    setSelection((current) => {
      const values = current[name] ?? [];
      const next: Record<string, string[]> = {
        ...current,
        [name]: values.includes(value)
          ? values.filter((v) => v !== value)
          : multiSelect
            ? [...values, value]
            : [value],
      };

      // Clear any other choice this one just invalidated, so the picker cannot
      // sit in a state that matches no variant.
      for (const attribute of priced) {
        if (attribute.name === name) continue;
        const kept = (next[attribute.name] ?? []).filter((value) =>
          product.variants.some(
            (variant) =>
              variant.options[attribute.name] === value &&
              priced.every(({ name: other }) => {
                if (other === attribute.name) return true;
                const otherValues = next[other] ?? [];
                return !otherValues.length || otherValues.includes(variant.options[other]);
              }),
          ),
        );
        if (kept.length !== (next[attribute.name] ?? []).length) next[attribute.name] = kept;
      }

      return next;
    });
  }

  function addToCart() {
    if (!canAdd) return;

    // The cart store commits synchronously, so a loop of adds accumulates
    // rather than each one racing the last.
    for (const variant of selectedVariants) {
      cart.add({
        priceId: variant.priceId,
        quantity: 1,
        productName: product.name,
        variantLabel: Object.values(variant.options).join(" / ") || "Standard",
        amount: variant.amount,
        currency: variant.currency,
        notes: Object.keys(notes).length ? notes : undefined,
      });
    }

    // Leaving five weeks highlighted after they have been added invites adding
    // them twice. Single-variant products keep their pre-selection.
    if (product.variants.length > 1) setSelection({});
  }

  const currency = product.variants[0]?.currency ?? "usd";

  return (
    <div className="overflow-hidden rounded-card border border-navy-950/12 bg-white">
      {/* Gold band, blue controls: the header is the one part of the card that
          is never interactive, so it takes the brand fill and leaves blue to
          mean "you can press this" all the way down the list. */}
      <div className="border-b border-sun-500/40 bg-gradient-to-r from-sun-50 to-white px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-xl font-extrabold uppercase tracking-tight text-navy-950">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-navy-950">
            {selectedVariants.length ? (
              money(total, currency)
            ) : (
              <span className="text-navy-700">From {money(product.fromAmount, currency)}</span>
            )}
          </p>
        </div>

        {product.description ? (
          <p className="mt-3 text-sm leading-relaxed text-navy-700">{product.description}</p>
        ) : null}
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
      {priced.map((attribute) => {
        const reachable = matching(attribute.name);
        const picked = chosen(attribute.name);

        const chip = (option: string) => {
          const soldOut = attribute.soldOut.includes(option);
          const available =
            !soldOut && reachable.some((variant) => variant.options[attribute.name] === option);
          const active = picked.includes(option);

          return (
            <button
              key={option}
              type="button"
              disabled={!available}
              aria-pressed={active}
              onClick={() => choose(attribute.name, option)}
              className={cn(
                "inline-flex items-center gap-2 rounded-chip border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors",
                active
                  ? "border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-500/25"
                  : "border-navy-950/20 bg-white text-navy-800 hover:border-brand-500 hover:text-brand-500",
                !available &&
                  "cursor-not-allowed border-navy-950/10 bg-transparent text-navy-950/30 hover:border-navy-950/10 hover:text-navy-950/30",
              )}
            >
              {/* A tick makes "several are on at once" readable at a glance,
                  which a filled background alone does not on a wall of 55. */}
              {multiSelect && active ? <Icon name="check" className="h-3.5 w-3.5" /> : null}
              {/* The strike is on the label, not the button. A decoration
                  set on the button paints through everything inside it,
                  and a descendant cannot opt out — which would draw a
                  line through "Sold out" as well. */}
              <span className={cn(!available && "line-through")}>{option}</span>
              {/* Said in words as well as struck through: the strike alone
                  also marks combinations that are merely unreachable, and
                  "full" is a different thing to tell a parent. */}
              {soldOut ? <span>· Sold out</span> : null}
            </button>
          );
        };

        /*
         * A season of camp weeks is ~60 chips; grouped under month headings
         * with a filter row, a parent looking for one week in March reads
         * four chips under "March" instead of scanning all sixty. Short
         * lists keep the flat wrap — headings on a dozen chips are more
         * furniture than help.
         */
        const months = groupByMonth(attribute.options);
        const grouped = attribute.options.length >= GROUP_FROM && months.length > 1;
        const activeMonth = month[attribute.name];
        const shown = grouped
          ? months.filter((m) => !activeMonth || m.key === activeMonth)
          : months;

        return (
          <fieldset key={attribute.name} className="mt-7 first:mt-0">
            <legend className="eyebrow mb-3 text-brand-500">
              {attribute.name}
              {multiSelect ? (
                <span className="ml-2 font-semibold normal-case tracking-normal text-navy-600">
                  — choose as many as you need
                </span>
              ) : null}
            </legend>

            {grouped ? (
              <div className="mb-5 flex flex-wrap gap-1.5">
                {[
                  { key: "", short: "All dates" },
                  ...months.map(({ key, short }) => ({ key, short })),
                ].map(({ key, short }) => {
                  const on = (activeMonth ?? "") === key;
                  /* The dot marks months holding a selection, so a family
                     filtering to July can still see they left two weeks
                     picked back in June. */
                  const holds =
                    key !== "" &&
                    months
                      .find((m) => m.key === key)
                      ?.options.some((option) => picked.includes(option));
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setMonth((current) => ({ ...current, [attribute.name]: key }))
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                        on
                          ? "bg-navy-950 text-white"
                          : "bg-brand-50 text-brand-500 hover:bg-brand-100",
                      )}
                    >
                      {short}
                      {holds ? (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            on ? "bg-sun-500" : "bg-brand-500",
                          )}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {grouped ? (
              <div className="space-y-5">
                {shown.map((m) => (
                  <div key={m.key}>
                    <p className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-navy-800">
                      {/* Gives the eye something to land on between groups, so
                          a long season reads as chapters rather than one column
                          of gray labels. */}
                      <span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-brand-500" />
                      {m.label}
                    </p>
                    <div className="flex flex-wrap gap-2">{m.options.map(chip)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">{attribute.options.map(chip)}</div>
            )}
          </fieldset>
        );
      })}

      {informational.map((attribute) => (
        <fieldset key={attribute.name} className="mt-7 first:mt-0">
          <legend className="eyebrow mb-3 text-brand-500">{attribute.name}</legend>
          <div className="flex flex-wrap gap-2">
            {attribute.options.map((option) => {
              const active = notes[attribute.name] === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setNotes((current) => ({
                      ...current,
                      [attribute.name]: current[attribute.name] === option ? "" : option,
                    }))
                  }
                  className={cn(
                    "border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors",
                    active
                      ? "border-navy-950 bg-navy-950 text-white"
                      : "border-navy-950/20 text-navy-800 hover:border-navy-950",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {/* Everything picked, wherever the month filter is pointing: with the
          list filtered to July, the two June weeks already chosen would
          otherwise be invisible until checkout. Each pill removes itself. */}
      {multiSelect && selectedVariants.length > 0 ? (
        <div className="mt-6 rounded-card border border-sun-500/40 border-l-4 border-l-sun-500 bg-sun-50 p-4">
          {/* Navy ink, not sun-700: sun-700 only clears the 3:1 floor for
              graphical marks like icons, not the 4.5:1 a text label needs.
              Navy-on-gold is the palette's own pattern for a gold fill. */}
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-navy-900">
            {selectedVariants.length} selected — {money(total, currency)} total
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {selectedVariants.map((variant) => {
              const { name } = priced[0];
              const option = variant.options[name];
              return (
                <li key={variant.priceId}>
                  <button
                    type="button"
                    onClick={() => choose(name, option)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 shadow-sm ring-1 ring-navy-950/10 transition-colors hover:text-alert-600 hover:ring-alert-600/40"
                  >
                    {option}
                    <Icon name="close" className="h-3 w-3" />
                    <span className="sr-only"> — remove</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={addToCart}
        disabled={!canAdd}
        className={cn(
          "mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-[0.08em] transition-colors",
          canAdd
            ? "bg-navy-950 text-white hover:bg-navy-800"
            : "cursor-not-allowed bg-navy-950/15 text-navy-950/50",
        )}
      >
        {canAdd ? (
          <>
            {selectedVariants.length > 1 ? `Add ${selectedVariants.length} to Cart` : "Add to Cart"}
            <Icon name="arrowRight" className="h-4 w-4" />
          </>
        ) : missingNote && selectedVariants.length ? (
          prompt(missingNote.name)
        ) : (
          prompt(priced.find((a) => !chosen(a.name).length)?.name ?? "options")
        )}
      </button>
      </div>
    </div>
  );
}
