import "@/styles/globals.css";
import "@/styles/nprogress.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { type IronSessionData } from "iron-session";
import { type AppProps } from "next/app";
import Router from "next/router";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import { Fragment } from "react";

import { Flash } from "@/components/flash";
import { MainLayout } from "@/layouts/main";
import { SessionProvider } from "@/providers/SessionProvider";
import { queryClient } from "@/utils/query";

nProgress.configure({ trickle: true });

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session?: IronSessionData | null }>) {
  const router = useRouter();

  const isChallengePage = router.pathname === "/challenges/[slug]";

  const Layout = isChallengePage ? Fragment : MainLayout;

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Layout session={session}>
          <Flash />
          <Component {...{ session, ...pageProps }} />
        </Layout>
      </SessionProvider>
    </QueryClientProvider>
  );
}
