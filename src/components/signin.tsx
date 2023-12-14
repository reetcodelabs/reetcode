import Link from "next/link";
import { Modal } from "./modal";
import { Button } from "./button";
import { ArrowRightIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { signIn, getProviders } from "next-auth/react";
import classNames from "classnames";

const providers = [
  { name: "Github", icon: "https://img.clerk.com/static/github.svg?width=160" },
  {
    name: "Google",
    icon: "https://img.clerk.com/static/google.svg?width=160",
  },
];

export function SignInOrSignUp() {
  const router = useRouter();

  const open = router.query?.signin == "true";

  const setOpen = (closed: boolean) => {
    const { pathname, query } = router;

    const params = new URLSearchParams(query as Record<string, string>);

    params.delete("signin");

    router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: true,
    });
  };

  const onEmailSubmit: FormEventHandler = async (submitEvent) => {
    submitEvent.preventDefault();

    const email = (
      (submitEvent.target as HTMLFormElement).elements.item(
        0,
      ) as HTMLInputElement
    )?.value;

    const id = toast.custom(
      ({ visible }) => (
        <div
          className={classNames(
            "rounded-md bg-red-600 p-4 transition ease-linear",
            {
              "animate-enter": visible,
              "animate-leave": !visible,
            },
          )}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-white">
                Failed to log in via email
              </h3>
              <div className="mt-2 text-xs text-white">
                <p>
                  We couldn't send you a verification code. Please try again or
                  try another login method if this keeps happening.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      { position: "top-center" },
    );

    return;

    const response = await signIn("mailcoach", { email, redirect: false });

    console.log(response);
  };

  return (
    <Modal open={open} setOpen={setOpen} className="w-full sm:max-w-[22rem]">
      <div className="-m-1.5 p-1.5 focus-within:outline-none focus-within:outline-offset-2 focus-within:outline-indigo-500">
        <span className="sr-only">Your Company</span>
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt=""
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
              <img src={provider.icon} alt="Google icon" className="mr-3" />
              Continue with {provider.name}
            </span>
            <ArrowRightIcon className="mr-4 h-4 w-4 opacity-0 transition ease-linear group-hover:translate-x-1 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
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
              defaultValue="bahdcoder@gmail.com"
              className="block w-full rounded-md border-0 bg-slate-900 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-50/[0.15] placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="mt-4 w-full font-normal focus-visible:outline-offset-2"
        >
          Continue
        </Button>
      </form>

      <div className="mt-4 text-xs text-slate-400">
        <p className="">No account? No worries.</p>
        <p className="mt-1">Sign in and we'll create an account for you.</p>
      </div>
    </Modal>
  );
}
