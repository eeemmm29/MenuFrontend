"use client";

import { GithubIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import NextLink from "next/link";

export const Navbar = () => {
  const { data: session, status } = useSession();

  // const searchInput = (
  //   <Input
  //     aria-label="Search"
  //     classNames={{
  //       inputWrapper: "bg-default-100",
  //       input: "text-sm",
  //     }}
  //     endContent={
  //       <Kbd className="hidden lg:inline-block" keys={["command"]}>
  //         K
  //       </Kbd>
  //     }
  //     labelPlacement="outside"
  //     placeholder="Search..."
  //     startContent={
  //       <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
  //     }
  //     type="search"
  //   />
  // );

  // Extracted user actions (avatar dropdown or login/signup buttons)
  const renderUserActions = () => {
    if (status === "loading") return null;
    if (status === "authenticated") {
      return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={session.user?.username || session.user?.email || "User"}
              size="sm"
              src={session.user?.image || undefined}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              className="h-14"
              description={
                session.user?.isAdmin && (
                  <Chip size="sm" color="success" className="mt-1">
                    Admin
                  </Chip>
                )
              }
            >
              {`Signed in as ${session.user?.username || session.user?.email}`}
            </DropdownItem>
            <DropdownItem key="settings" as={NextLink} href={routes.profile}>
              My Profile
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    }
    return (
      <>
        <Button as={NextLink} href={routes.auth.login} variant="flat">
          Login
        </Button>
        <Button
          as={NextLink}
          color="primary"
          href={routes.auth.signup}
          variant="flat"
        >
          Sign Up
        </Button>
      </>
    );
  };

  return (
    <HeroUINavbar maxWidth="xl">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink
            className="flex justify-start items-center gap-1"
            href={routes.home}
          >
            {/* <Logo /> */}
            <p className="font-bold text-inherit">RMMS</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => {
            if (item.shouldShowToAuth && status !== "authenticated") {
              return null;
            }

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-4">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          {renderUserActions()}
        </NavbarItem>
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        {/* <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem> */}
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        {renderUserActions()}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/* {searchInput} */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => {
            if (
              (item.shouldShowToAuth && status !== "authenticated") ||
              (item.shouldShowToAuth === false && status === "authenticated")
            ) {
              return null;
            }
            return (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color={
                    index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  onPress={
                    index === siteConfig.navMenuItems.length - 1
                      ? () => signOut()
                      : undefined
                  }
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
