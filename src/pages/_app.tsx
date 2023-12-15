import { type AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
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

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const router = useRouter();

  const isChallengePage = router.pathname === "/challenges/[slug]";

  const Layout = isChallengePage ? Fragment : MainLayout;

  return (
    <SessionProvider session={session}>
      <Layout session={session}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
