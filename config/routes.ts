export const routes = {
  home: "/",
  about: "/about",
  profile: "/profile",
  dashboard: "/dashboard",
  projects: "/projects",
  team: "/team",
  calendar: "/calendar",
  settings: "/settings",
  helpFeedback: "/help-feedback",
  logout: "/logout",
  categories: "/categories",
  menuItems: "/menu-items",
  favorites: "/favorites", // Add favorites route
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
  },
  newCategory: "/categories/new",
  categoryDetail: (id: number | string) => `/categories/${id}`, // Add category detail route
  editCategory: (id: number | string) => `/categories/${id}/edit`, // Add category edit route
  // Menu Items
  newMenuItem: "/menu-items/new",
  menuItemDetail: (id: number | string) => `/menu-items/${id}`,
  editMenuItem: (id: number | string) => `/menu-items/${id}/edit`,
};
