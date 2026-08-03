"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { useCart } from "@/components/shop/CartProvider";

function money(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

/** Slide-over cart. Opens itself whenever something is added. */
export function CartDrawer() {
  const cart = useCart();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") cart.close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [cart]);

  /**
   * Modal focus behaviour.
   *
   * Without this the drawer is only visually modal: focus stays wherever it was
   * in the page behind, so a keyboard or screen-reader user opens the cart and
   * then tabs through the whole site underneath it, never reaching the checkout
   * button. Focus moves in on open, cycles inside while open, and returns to
   * whatever opened it on close.
   *
   * Focusables are re-queried on each Tab rather than captured once, because
   * removing the last line item changes what is in the panel.
   */
  useEffect(() => {
    if (!cart.isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

    (focusable()[0] ?? panel).focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [cart.isOpen]);

  // Stop the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!cart.isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [cart.isOpen]);

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

  return (
    <AnimatePresence>
      {cart.isOpen ? (
        <>
          {/* Click-to-dismiss only. It was a full-screen <button>, which put a
              giant "Close cart" control in the tab order ahead of the panel;
              Escape and the close button already cover keyboard dismissal. */}
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-navy-950/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={cart.close}
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            tabIndex={-1}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-white shadow-2xl outline-none"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-navy-950/10 px-6 py-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-navy-950">
                Your Enrollment ({cart.count})
              </h2>
              <button
                type="button"
                onClick={cart.close}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center border border-navy-950/15 text-navy-950"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.items.length === 0 ? (
                <p className="py-12 text-center text-sm text-navy-600">
                  Nothing here yet. Choose a program to get started.
                </p>
              ) : (
                <ul className="space-y-5">
                  {cart.items.map((item) => (
                    <li key={item.priceId} className="border-b border-navy-950/8 pb-5">
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-bold leading-tight text-navy-950">
                            {item.productName}
                          </p>
                          <p className="mt-1 text-xs text-navy-600">{item.variantLabel}</p>
                          {item.notes
                            ? Object.entries(item.notes).map(([name, value]) => (
                                <p key={name} className="mt-1 text-xs text-navy-600">
                                  {name}: {value}
                                </p>
                              ))
                            : null}
                        </div>
                        <p className="shrink-0 text-sm font-bold text-navy-950">
                          {money(item.amount * item.quantity, item.currency)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center border border-navy-950/15">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.productName}`}
                            onClick={() => cart.setQuantity(item.priceId, item.quantity - 1)}
                            className="h-8 w-8 text-navy-950"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.productName}`}
                            onClick={() => cart.setQuantity(item.priceId, item.quantity + 1)}
                            className="h-8 w-8 text-navy-950"
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
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.items.length > 0 ? (
              <footer className="border-t border-navy-950/10 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.08em] text-navy-600">
                    Subtotal
                  </span>
                  <span className="text-xl font-extrabold text-navy-950">
                    {money(cart.subtotal, cart.items[0]?.currency)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-navy-600">
                  Taxes and any discounts are applied at checkout.
                </p>

                {error ? (
                  <p role="alert" className="mt-3 text-xs font-semibold text-red-700">
                    {error}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={checkout}
                  disabled={busy}
                  className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-sm bg-sun-500 text-sm font-bold uppercase tracking-[0.08em] text-navy-950 transition-colors hover:bg-sun-500 disabled:opacity-60"
                >
                  {busy ? "Redirecting…" : "Checkout"}
                </button>
                <Link
                  href="/cart"
                  onClick={cart.close}
                  className="mt-3 block text-center text-xs font-bold uppercase tracking-[0.06em] text-navy-600 underline underline-offset-4 hover:text-navy-950"
                >
                  View full cart
                </Link>
              </footer>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

/** Header entry point. Renders nothing until the cart has loaded. */
export function CartButton() {
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={cart.open}
      aria-label={`Open cart, ${cart.count} item${cart.count === 1 ? "" : "s"}`}
      className="relative grid h-11 w-11 place-items-center text-navy-950 transition-colors hover:text-brand-500"
    >
      <Icon name="cart" className="h-5 w-5" />
      {cart.ready && cart.count > 0 ? (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sun-500 px-1 text-[0.6rem] font-bold tabular-nums text-navy-950">
          {cart.count}
        </span>
      ) : null}
    </button>
  );
}
