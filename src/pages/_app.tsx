import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { MainLayout } from "@/layouts/main";
import { useRouter } from "next/router";
import { Fragment } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  const isChallengePage = router.pathname === "/challenges/[slug]";

  const Layout = isChallengePage ? Fragment : MainLayout;

  return (
    <ClerkProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
