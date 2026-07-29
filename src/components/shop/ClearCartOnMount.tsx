"use client";

import { useEffect } from "react";
import { useCart } from "@/components/shop/CartProvider";

/**
 * Empties the cart once payment is confirmed.
 *
 * Rendered only after the server has verified the session was actually paid, so
 * an abandoned or failed checkout leaves the cart intact for another attempt.
 */
export function ClearCartOnMount() {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);

  return null;
}
