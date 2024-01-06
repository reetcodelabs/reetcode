import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { type FormEventHandler } from "react";
import { toast } from "react-hot-toast";

import { axiosClient } from "@/utils/axios";

import { Button } from "./button";
import { Modal } from "./modal";
import { Alert } from "./Notification";
import { RenderIf } from "./RenderIf";

const providers = [
  {
    name: "Github",
    icon: "https://dashboard.hookdeck.com/images/github-icon.svg",
    // style: filter: invert(1);
    style: { filter: "invert(1)" },
  },
  {
    name: "Google",
    icon: "https://img.clerk.com/static/google.svg?width=160",
  },
];

export function SignInOrSignUp() {
  const router = useRouter();

  const open = router.query?.signin == "true";

  const signinViaEmailMutation = useMutation<
    { message: string },
    Error,
    { email: string }
  >({
    async mutationFn({ email }) {
      const callbackURL = window.location.pathname.replace("signin=true", "");

      const response = await axiosClient.post<{ message: string }>(
        "accounts/send-magic-link",
        {
          email,
          callbackURL,
        },
      );

      return response.data;
    },
    onError() {
      toast.custom(
        ({ visible }) => (
          <Alert
            variant="error"
            title="Failed to log in via email."
            description={
              "We couldn't send you a magic link. Please try again or try another login method if this keeps happening."
            }
            className={visible ? "animate-enter" : "animate-leave"}
          />
        ),
        { position: "top-center" },
      );
    },
  });

  const setOpen = () => {
    const { pathname, query } = router;

    const params = new URLSearchParams(query as Record<string, string>);

    params.delete("signin");

    void router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: true,
    });
  };

  const onEmailSubmit: FormEventHandler = (submitEvent) => {
    submitEvent.preventDefault();

    const email = (
      (submitEvent.target as HTMLFormElement).elements.item(
        0,
      ) as HTMLInputElement
    )?.value;

    signinViaEmailMutation.mutate({ email });
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      className="w-full sm:max-w-[22rem]"
      hideCloseIcon={signinViaEmailMutation.isSuccess}
    >
      <RenderIf if={signinViaEmailMutation.isSuccess}>
        <div className="my-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600">
            <CheckIcon className="h-6 w-6 text-green-100" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-base font-semibold leading-6 text-white">
              Check your email !
            </h3>
            <div className="mt-2">
              <p className="text-sm text-slate-400">
                We sent a sign in link to your email. Please click on the link
                to login.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center text-xs text-slate-400">
              Still can't login?
              <button
                onClick={() => signinViaEmailMutation.reset()}
                className="focused-link ml-2 flex items-center text-indigo-500"
              >
                <ArrowLeftIcon className="mr-0.5 h-3 w-3" /> Try another way
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12"></div>
      </RenderIf>

      <RenderIf if={!signinViaEmailMutation.isSuccess}>
        <div className="-m-1.5 p-1.5 focus-within:outline-none focus-within:outline-offset-2 focus-within:outline-indigo-500">
          <span className="sr-only">Reetcode</span>
          <img
            className="h-8 w-auto"
            src="/images/logo-mobile.png"
            alt="reetcode"
          />
        </div>

        <div className="mb-6 mt-4">
          <h2 className="text-lg font-semibold text-white">Sign in</h2>
          <p className="text-slate-400">to your reetcode.com account</p>
        </div>
        <div className="mb-6 grid w-full grid-cols-1 gap-y-4">
          {providers.map((provider) => (
            <button
              key={provider.name}
              className="focused-link group flex h-10 w-full items-center justify-between rounded-md border border-slate-50/[0.15] bg-slate-900 px-2 text-sm text-white transition ease-linear hover:bg-slate-800 focus-visible:outline-offset-1"
            >
              <span className="flex items-center">
                <img
                  src={provider.icon}
                  alt="Google icon"
                  style={provider.style}
                  className="mr-3 h-5 w-5"
                />
                Continue with {provider.name}
              </span>
              <ArrowRightIcon className="mr-4 h-4 w-4 opacity-0 transition ease-linear group-hover:translate-x-1 group-hover:opacity-100" />
            </button>
          ))}
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-slate-50/[0.06]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-900 px-4 text-sm text-slate-400">or</span>
          </div>
        </div>

        <form onSubmit={onEmailSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                autoFocus
                required
                className="block w-full rounded-md border-0 bg-slate-900 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-50/[0.15] placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={signinViaEmailMutation.isLoading}
            className="mt-4 w-full py-2 font-normal focus-visible:outline-offset-2"
          >
            Continue
          </Button>
        </form>

        <div className="mt-4 text-xs text-slate-400">
          <p className="">No account? No worries.</p>
          <p className="mt-1">Sign in and we'll create an account for you.</p>
        </div>
      </RenderIf>
    </Modal>
  );
}
