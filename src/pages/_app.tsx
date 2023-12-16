import "@/styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { type IronSessionData } from "iron-session";
import { type AppProps } from "next/app";
import { useRouter } from "next/router";
import { Fragment } from "react";

import { Flash } from "@/components/flash";
import { MainLayout } from "@/layouts/main";
import { queryClient } from "@/utils/query";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session?: IronSessionData | null }>) {
  const router = useRouter();

  const isChallengePage = router.pathname === "/challenges/[slug]";

  const Layout = isChallengePage ? Fragment : MainLayout;

  return (
    <QueryClientProvider client={queryClient}>
      <Layout session={session}>
        <Flash />
        <Component {...{ session, ...pageProps }} />
      </Layout>
    </QueryClientProvider>
  );
}
