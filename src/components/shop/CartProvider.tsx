"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "rr_cart_v1";

export type CartItem = {
  /** Stripe Price ID — the only field checkout actually trusts. */
  priceId: string;
  quantity: number;
  /** Display copy, cached so the cart renders without a round trip. */
  productName: string;
  variantLabel: string;
  amount: number;
  currency: string;
  /**
   * Answers to attributes that carry no price (Semester, and anything else
   * migrated the same way). Passed to Stripe as order metadata so the office
   * still learns the answer.
   */
  notes?: Record<string, string>;
};

/**
 * localStorage is an external store, so the cart is read through
 * `useSyncExternalStore` rather than an effect that calls setState. That gives
 * a server snapshot React can hydrate against, keeps multiple tabs consistent,
 * and avoids the cascading render an effect-and-setState version causes.
 *
 * `getSnapshot` must return a stable reference or React re-renders forever,
 * which is why the snapshot object is rebuilt only when the cart actually
 * changes rather than on every read.
 */
type Snapshot = { items: CartItem[]; ready: boolean };

const SERVER_SNAPSHOT: Snapshot = { items: [], ready: false };

let snapshot: Snapshot = SERVER_SNAPSHOT;
let hydrated = false;
const listeners = new Set<() => void>();

function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        typeof item?.priceId === "string" && Number.isFinite(item?.quantity),
    );
  } catch {
    return [];
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(items: CartItem[], persist: boolean) {
  snapshot = { items, ready: true };
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private browsing or a full quota — the cart still works for this
      // session, it just will not survive a reload.
    }
  }
  emit();
}

function onStorage(event: StorageEvent) {
  // Another tab changed the cart. Adopt its version without writing back.
  if (event.key === STORAGE_KEY) commit(parse(event.newValue), false);
}

function subscribe(listener: () => void) {
  // First subscriber pulls the real cart in. This runs after the hydrating
  // render, so the server and client agree on that first pass and React
  // re-renders once the snapshot changes underneath it.
  if (!hydrated) {
    hydrated = true;
    commit(parse(window.localStorage.getItem(STORAGE_KEY)), false);
  }

  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => SERVER_SNAPSHOT;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: CartItem) => void;
  setQuantity: (priceId: string, quantity: number) => void;
  remove: (priceId: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** False until localStorage has been read, so nothing flashes a stale empty state. */
  ready: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, ready } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Drawer visibility is ordinary UI state, not part of the stored cart.
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback((item: CartItem) => {
    const current = snapshot.items;
    const index = current.findIndex((existing) => existing.priceId === item.priceId);

    if (index === -1) {
      commit([...current, item], true);
    } else {
      const next = [...current];
      next[index] = { ...next[index], quantity: next[index].quantity + item.quantity };
      commit(next, true);
    }
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((priceId: string, quantity: number) => {
    commit(
      quantity <= 0
        ? snapshot.items.filter((item) => item.priceId !== priceId)
        : snapshot.items.map((item) =>
            item.priceId === priceId ? { ...item, quantity } : item,
          ),
      true,
    );
  }, []);

  const remove = useCallback((priceId: string) => {
    commit(
      snapshot.items.filter((item) => item.priceId !== priceId),
      true,
    );
  }, []);

  const clear = useCallback(() => commit([], true), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.amount * item.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      ready,
    }),
    [items, ready, add, setQuantity, remove, clear, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
