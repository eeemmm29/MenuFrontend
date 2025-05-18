import { routes } from "./routes";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Restaurant Menu Management",
  description: "Manage your restaurant's menu items efficiently.",
  navItems: [
    {
      label: "Home",
      href: routes.home,
    },
    // {
    //   label: "Docs",
    //   href: "/docs",
    // },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
    // {
    //   label: "Blog",
    //   href: "/blog",
    // },
    {
      label: "About",
      href: routes.about,
    },
    {
      label: "Categories",
      href: routes.categories,
    },
    {
      label: "Menu Items",
      href: routes.menuItems,
    },
    {
      label: "Favorites",
      href: routes.favorites,
      shouldShowToAuth: true,
    },
  ],
  navMenuItems: [
    {
      label: "About",
      href: routes.about,
    },
    {
      label: "Profile",
      href: routes.profile,
      shouldShowToAuth: true,
    },
    // {
    //   label: "Dashboard",
    //   href: routes.dashboard,
    // },
    // {
    //   label: "Projects",
    //   href: routes.projects,
    // },
    // {
    //   label: "Team",
    //   href: routes.team,
    // },
    // {
    //   label: "Calendar",
    //   href: routes.calendar,
    // },
    // {
    //   label: "Settings",
    //   href: routes.settings,
    // },
    // {
    //   label: "Help & Feedback",
    //   href: routes.helpFeedback,
    // },
    {
      label: "Categories",
      href: routes.categories,
    },
    {
      label: "Menu Items",
      href: routes.menuItems,
    },
    {
      label: "Favorites",
      href: routes.favorites,
      shouldShowToAuth: true,
    },
    {
      label: "Login",
      href: routes.auth.login,
      shouldShowToAuth: false,
    },
    {
      label: "Sign Up",
      href: routes.auth.signup,
      shouldShowToAuth: false,
    },
    {
      label: "Logout",
      href: "#",
      shouldShowToAuth: true,
    },
  ],
  links: {
    github: "https://github.com/eeemmm29/MenuFrontend",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
