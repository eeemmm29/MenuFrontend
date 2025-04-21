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
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: routes.profile,
    },
    {
      label: "Dashboard",
      href: routes.dashboard,
    },
    {
      label: "Projects",
      href: routes.projects,
    },
    {
      label: "Team",
      href: routes.team,
    },
    {
      label: "Calendar",
      href: routes.calendar,
    },
    {
      label: "Settings",
      href: routes.settings,
    },
    {
      label: "Help & Feedback",
      href: routes.helpFeedback,
    },
    {
      label: "Logout",
      href: routes.logout,
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
