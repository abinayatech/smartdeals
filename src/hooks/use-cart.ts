import { useAppStore } from "@/context/app-store";

export function useCart() {
  const store = useAppStore();
  return {
    items: store.cart,
    count: store.cartCount,
    add: store.addToCart,
    remove: store.removeFromCart,
    updateQty: store.updateQty,
    clear: store.clearCart,
    refresh: store.refreshCart,
  };
}

export function useFavorites() {
  const store = useAppStore();
  return {
    ids: store.favorites,
    isFavorite: (id: string) => store.favorites.includes(id),
    toggle: store.toggleFavorite,
    refresh: store.refreshFavorites,
  };
}
