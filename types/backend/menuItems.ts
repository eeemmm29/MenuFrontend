export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  categoryName?: string; // Add optional category name
  image?: string;
}
