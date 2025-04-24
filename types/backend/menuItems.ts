export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  categoryName?: string;
  image?: string;
  isAvailable: boolean;
  isFavorite: boolean;
}
