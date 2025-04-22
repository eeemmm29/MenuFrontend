import { MenuItem } from "./menuItems";

export interface Favorite {
  id: number;
  user: number; // Assuming user ID is returned
  menuItem: MenuItem; // Nested MenuItem object
  createdAt: string; // ISO date string
}
