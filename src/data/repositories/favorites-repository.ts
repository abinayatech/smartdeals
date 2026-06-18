import * as favoritesService from "@/lib/favorites-service";

export const favoritesRepository = {
  getAll: () => favoritesService.getFavorites(),
  toggle: (id: string) => favoritesService.toggleFavorite(id),
  isFavorite: (id: string) => favoritesService.isFavorite(id),
  remove: (id: string) => favoritesService.removeFavorite(id),
};
