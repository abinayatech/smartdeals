import {
  products,
  stores,
  categories,
  deals,
  getProductById,
  getReviewsForProduct,
  getAlternatePrices,
} from "@/lib/mock-data";

export const catalogRepository = {
  getProducts: () => products,
  getStores: () => stores,
  getCategories: () => categories,
  getDeals: () => deals,
  getProduct: (id: string) => getProductById(id),
  getReviews: (productId: string) => getReviewsForProduct(productId),
  getAlternatePrices: (productId: string) => getAlternatePrices(productId),
};
