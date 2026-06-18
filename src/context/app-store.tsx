import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/mock-data";
import { getCart, addToCart, removeFromCart, updateCartQty, clearCart, type CartItem } from "@/lib/cart-service";
import { getFavorites, toggleFavorite as toggleFav } from "@/lib/favorites-service";
import { unreadCount } from "@/lib/notifications-service";
import { useAuth } from "@/lib/auth-context";

type AppStore = {
  cart: CartItem[];
  cartCount: number;
  favorites: string[];
  unreadNotifications: number;
  refreshCart: () => void;
  refreshFavorites: () => void;
  refreshNotifications: () => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => boolean;
};

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [unread, setUnread] = useState(0);

  const refreshCart = useCallback(() => setCart(getCart()), []);
  const refreshFavorites = useCallback(() => setFavorites(getFavorites()), []);
  const refreshNotifications = useCallback(() => {
    if (user) setUnread(unreadCount(user.id));
  }, [user]);

  useEffect(() => {
    refreshCart();
    refreshFavorites();
    refreshNotifications();
  }, [refreshCart, refreshFavorites, refreshNotifications]);

  const value = useMemo<AppStore>(
    () => ({
      cart,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      favorites,
      unreadNotifications: unread,
      refreshCart,
      refreshFavorites,
      refreshNotifications,
      addToCart: (product, qty = 1) => {
        addToCart(product, qty);
        refreshCart();
      },
      removeFromCart: (id) => {
        removeFromCart(id);
        refreshCart();
      },
      updateQty: (id, qty) => {
        updateCartQty(id, qty);
        refreshCart();
      },
      clearCart: () => {
        clearCart();
        refreshCart();
      },
      toggleFavorite: (id) => {
        const added = toggleFav(id);
        refreshFavorites();
        return added;
      },
    }),
    [cart, favorites, unread, refreshCart, refreshFavorites, refreshNotifications],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
