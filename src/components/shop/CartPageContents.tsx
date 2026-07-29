"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { useCart } from "@/components/shop/CartProvider";
import { Button } from "@/components/ui/Button";

function money(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

export function CartPageContents() {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            priceId: item.priceId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error ?? "Checkout is unavailable.");
      window.location.href = data.url;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setBusy(false);
    }
  }

  // Until localStorage has been read the cart is genuinely unknown — showing
  // "empty" here would flash the wrong answer to someone with items.
  if (!cart.ready) {
    return <p className="py-16 text-center text-sm text-navy-600">Loading your cart…</p>;
  }

  if (!cart.items.length) {
    return (
      <div className="py-12 text-center">
        <h2 className="display text-3xl text-navy-950">Your cart is empty.</h2>
        <p className="mx-auto mt-4 max-w-md text-navy-600">
          Browse the programs to find the right fit, or call us and we will help you choose.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/programs" variant="navy" size="lg">
            Browse programs
          </Button>
          <Button href="/contact" variant="quiet" size="lg">
            Talk to an educator
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
      <ul className="border-t border-navy-950/12">
        {cart.items.map((item) => (
          <li
            key={item.priceId}
            className="flex flex-wrap items-start justify-between gap-6 border-b border-navy-950/12 py-7"
          >
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold uppercase tracking-tight text-navy-950">
                {item.productName}
              </h2>
              <p className="mt-1 text-sm text-navy-600">{item.variantLabel}</p>
              {item.notes
                ? Object.entries(item.notes).map(([name, value]) => (
                    <p key={name} className="mt-1 text-sm text-navy-600">
                      {name}: {value}
                    </p>
                  ))
                : null}

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center border border-navy-950/15">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.productName}`}
                    onClick={() => cart.setQuantity(item.priceId, item.quantity - 1)}
                    className="h-9 w-9 text-navy-950"
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-sm tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.productName}`}
                    onClick={() => cart.setQuantity(item.priceId, item.quantity + 1)}
                    className="h-9 w-9 text-navy-950"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => cart.remove(item.priceId)}
                  className="text-xs font-semibold uppercase tracking-[0.06em] text-navy-600 underline underline-offset-4 hover:text-navy-950"
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="text-lg font-bold text-navy-950">
              {money(item.amount * item.quantity, item.currency)}
            </p>
          </li>
        ))}
      </ul>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-navy-950/12 bg-mist p-7">
          <h2 className="eyebrow text-brand-600">Summary</h2>
          <div className="mt-5 flex items-baseline justify-between">
            <span className="text-sm text-navy-600">Subtotal</span>
            <span className="text-2xl font-extrabold text-navy-950">
              {money(cart.subtotal, cart.items[0]?.currency)}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-navy-600">
            Taxes and any discount codes are applied on the secure Stripe checkout page.
          </p>

          {error ? (
            <p role="alert" className="mt-4 text-xs font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={checkout}
            disabled={busy}
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-sm bg-sun-500 text-sm font-bold uppercase tracking-[0.08em] text-navy-950 transition-colors hover:bg-sun-400 disabled:opacity-60"
          >
            {busy ? "Redirecting…" : "Checkout"}
            {busy ? null : <Icon name="arrowRight" className="h-4 w-4" />}
          </button>

          <Link
            href="/programs"
            className="mt-4 block text-center text-xs font-bold uppercase tracking-[0.06em] text-navy-600 underline underline-offset-4 hover:text-navy-950"
          >
            Keep browsing
          </Link>
        </div>
      </aside>
    </div>
  );
}
