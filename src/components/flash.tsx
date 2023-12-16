import { useEffect } from "react";
import toast from "react-hot-toast";

import { Alert } from "./Notification";
import { useRouter } from "next/router";

export function Flash() {
  const { pathname, query, replace } = useRouter();

  const routeParams = new URLSearchParams(query as Record<string, string>);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const errorMessage = params.get("errorMessage");
    const successMessage = params.get("successMessage");

    if (successMessage ?? errorMessage) {
      toast.custom(
        ({ visible }) => (
          <Alert
            variant={successMessage ? "success" : "error"}
            title={errorMessage ? "An error occurred." : "Success."}
            description={successMessage ?? errorMessage ?? ""}
            className={visible ? "animate-enter" : "animate-leave"}
          />
        ),
        { position: "top-center", duration: 5000 },
      );

      routeParams.delete("errorMessage");
      routeParams.delete("successMessage");

      void replace({ pathname, query: routeParams.toString() }, undefined, {
        shallow: true,
      });
    }
  }, []);

  return null;
}
