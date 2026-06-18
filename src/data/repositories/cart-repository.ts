import * as cartService from "@/lib/cart-service";
import type { Product } from "@/lib/mock-data";

export const cartRepository = {
  getAll: () => cartService.getCart(),
  add: (product: Product, qty = 1) => cartService.addToCart(product, qty),
  remove: (id: string) => cartService.removeFromCart(id),
  updateQty: (id: string, qty: number) => cartService.updateCartQty(id, qty),
  clear: () => cartService.clearCart(),
  count: () => cartService.cartCount(),
};
