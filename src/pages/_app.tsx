import { Fragment } from "react";
import { type AppProps } from "next/app";
import { useRouter } from "next/router";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import { MainLayout } from "@/layouts/main";
import { Flash } from "@/components/flash";
import { type IronSessionData } from "iron-session";

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
