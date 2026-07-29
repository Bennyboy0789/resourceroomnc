"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { useCart } from "@/components/shop/CartProvider";
import type { CatalogProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

/**
 * Enrollment options for one product, resolving to a Stripe Price.
 *
 * Not every combination of attributes exists — WooCommerce products routinely
 * price some pairings and not others. Rather than let someone pick a dead end,
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

  const [selection, setSelection] = useState<Record<string, string>>(() =>
    // A single-variant product has nothing to choose; pre-select it so the
    // button is live immediately.
    product.variants.length === 1 ? { ...product.variants[0].options } : {},
  );
  const [notes, setNotes] = useState<Record<string, string>>({});

  /** Variants still reachable given everything chosen except `ignore`. */
  const matching = (ignore?: string) =>
    product.variants.filter((variant) =>
      Object.entries(selection).every(
        ([name, value]) => name === ignore || !value || variant.options[name] === value,
      ),
    );

  const selected = useMemo(() => {
    if (!priced.length) return product.variants[0] ?? null;
    const complete = priced.every((attribute) => selection[attribute.name]);
    if (!complete) return null;
    return (
      product.variants.find((variant) =>
        priced.every((attribute) => variant.options[attribute.name] === selection[attribute.name]),
      ) ?? null
    );
  }, [priced, product.variants, selection]);

  const missingNote = informational.find((attribute) => !notes[attribute.name]);
  const canAdd = Boolean(selected) && !missingNote;

  function choose(name: string, value: string) {
    setSelection((current) => {
      const next = { ...current, [name]: current[name] === value ? "" : value };

      // Clear any later choice this one just invalidated, so the picker cannot
      // sit in a state that matches no variant.
      for (const attribute of priced) {
        const chosen = next[attribute.name];
        if (!chosen) continue;
        const reachable = product.variants.some((variant) =>
          Object.entries(next).every(
            ([key, value]) => !value || variant.options[key] === value,
          ),
        );
        if (!reachable) next[attribute.name] = "";
      }
      return next;
    });
  }

  function addToCart() {
    if (!selected) return;
    cart.add({
      priceId: selected.priceId,
      quantity: 1,
      productName: product.name,
      variantLabel: Object.values(selected.options).join(" / ") || "Standard",
      amount: selected.amount,
      currency: selected.currency,
      notes: Object.keys(notes).length ? notes : undefined,
    });
  }

  return (
    <div className="border border-navy-950/12 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-xl font-extrabold uppercase tracking-tight text-navy-950">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-navy-950">
          {selected ? (
            money(selected.amount, selected.currency)
          ) : (
            <span className="text-navy-600">
              From {money(product.fromAmount, product.variants[0].currency)}
            </span>
          )}
        </p>
      </div>

      {product.description ? (
        <p className="mt-3 text-sm leading-relaxed text-navy-600">{product.description}</p>
      ) : null}

      {priced.map((attribute) => {
        const reachable = matching(attribute.name);

        return (
          <fieldset key={attribute.name} className="mt-7">
            <legend className="eyebrow mb-3 text-brand-600">{attribute.name}</legend>
            <div className="flex flex-wrap gap-2">
              {attribute.options.map((option) => {
                const available = reachable.some(
                  (variant) => variant.options[attribute.name] === option,
                );
                const active = selection[attribute.name] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={!available}
                    aria-pressed={active}
                    onClick={() => choose(attribute.name, option)}
                    className={cn(
                      "border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors",
                      active
                        ? "border-navy-950 bg-navy-950 text-white"
                        : "border-navy-950/20 text-navy-800 hover:border-navy-950",
                      !available &&
                        "cursor-not-allowed border-navy-950/10 text-navy-950/30 line-through hover:border-navy-950/10",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      {informational.map((attribute) => (
        <fieldset key={attribute.name} className="mt-7">
          <legend className="eyebrow mb-3 text-brand-600">{attribute.name}</legend>
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

      <button
        type="button"
        onClick={addToCart}
        disabled={!canAdd}
        className={cn(
          "mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-sm text-sm font-bold uppercase tracking-[0.08em] transition-colors",
          canAdd
            ? "bg-navy-950 text-white hover:bg-navy-800"
            : "cursor-not-allowed bg-navy-950/15 text-navy-950/50",
        )}
      >
        {canAdd ? (
          <>
            Add to Cart
            <Icon name="arrowRight" className="h-4 w-4" />
          </>
        ) : missingNote && selected ? (
          `Choose ${missingNote.name}`
        ) : (
          `Choose ${priced.find((a) => !selection[a.name])?.name ?? "options"}`
        )}
      </button>
    </div>
  );
}
