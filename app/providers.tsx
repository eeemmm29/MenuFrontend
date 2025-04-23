"use client";

import SessionErrorHandler from "@/utils/backend/session-error-handler";
import { HeroUIProvider } from "@heroui/system";
import { SessionProvider } from "next-auth/react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <SessionProvider>
      <HeroUIProvider navigate={router.push}>
        <SessionErrorHandler>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </SessionErrorHandler>
      </HeroUIProvider>
    </SessionProvider>
  );
}
