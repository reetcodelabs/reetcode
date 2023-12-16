import { Fragment } from "react";
import { type AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { MainLayout } from "@/layouts/main";
import { Flash } from "@/components/flash";
import { IronSessionData } from "iron-session";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session?: IronSessionData | null }>) => {
  const router = useRouter();

  const isChallengePage = router.pathname === "/challenges/[slug]";

  const Layout = isChallengePage ? Fragment : MainLayout;

  return (
    <Layout session={session}>
      <Flash />
      <Component {...{ session, ...pageProps }} />
    </Layout>
  );
};

export default api.withTRPC(MyApp);
