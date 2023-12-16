import { useRouter } from "next/router";

export function useSignInPopup() {
  const router = useRouter();

  return {
    openSignInPopup() {
      const { pathname, query } = router;
      const params = new URLSearchParams(query as Record<string, string>);

      params.append("signin", "true");

      void router.replace({ pathname, query: params.toString() }, undefined, {
        shallow: true,
      });
    },
  };
}
