import Link from "next/link";
import classnames from "classnames";
import { PropsWithChildren } from "react";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Explore", href: "/" },
  { name: "Dashboard", href: "/problems" },
];

import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import classNames from "classnames";
import { Modal } from "@/components/modal";
import { SignInOrSignUp } from "@/components/signin";
import { Toaster } from "react-hot-toast";

const solutions = [
  {
    name: "Authentication",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Security",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Forms",
    description: "Your customers' data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Performance",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Analytics",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];

export function Navigation() {
  return (
    <Popover className="relative">
      <Popover.Button className="focused-link inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
        {({ open }) => (
          <>
            <span>Problem sets</span>
            <ChevronDownIcon
              className={classnames("h-5 w-5 transition ease-linear", {
                "rotate-180 transform": open,
              })}
              aria-hidden="true"
            />
          </>
        )}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-sm bg-slate-900 text-sm leading-6  ring-1 ">
            <div className="p-4">
              {solutions.map((item) => (
                <Link
                  href={"/"}
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-sm p-4 focus-within:outline-none focus-within:outline-indigo-500 hover:bg-slate-800"
                >
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-slate-800 group-hover:bg-slate-900">
                    <item.icon
                      className="h-6 w-6 text-slate-400 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">
                      {item.name}
                      <span className="absolute inset-0" />
                    </p>
                    <p className="mt-1 text-slate-400">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export function MainLayout({ children }: PropsWithChildren) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  const isHome = router.pathname === "/";
  const isProblemPage = router.pathname === "/problems/[slug]";

  const openAuthenticationDialog = () => {
    const { pathname, query } = router;
    const params = new URLSearchParams(query as Record<string, string>);

    params.append("signin", "true");

    router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <SignInOrSignUp />
      {isProblemPage ? null : (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center overflow-hidden">
          <div className="flex w-[108rem] flex-none justify-end">
            <picture>
              <source
                srcSet="https://tailwindcss.com/_next/static/media/docs@30.8b9a76a2.avif"
                type="image/avif"
              />
            </picture>
            <picture>
              <source
                srcSet="https://tailwindcss.com/_next/static/media/docs-dark@30.1a9f8cbf.avif"
                type="image/avif"
              />
              <img
                src="https://tailwindcss.com/_next/static/media/docs-dark@tinypng.1bbe175e.png"
                alt=""
                className="w-[90rem] max-w-none flex-none"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      )}
      <div
        className={classNames(" inset-x-0 top-0 z-40 w-full ", {
          "supports-backdrop-blur:bg-transparent sticky border-b border-slate-50/[0.06] backdrop-blur":
            !isHome,
          "absolute ": isHome,
        })}
      >
        <header
          className={classNames("", {
            "mx-auto max-w-7xl bg-transparent": !isHome && !isProblemPage,
            "px-3": isProblemPage,
          })}
        >
          <nav
            className={classNames("flex items-center justify-between", {
              "p-6 md:px-8": isHome,
              "px-6 py-4 md:px-0": !isHome && !isProblemPage,
              "px-6 py-2 md:px-0": isProblemPage,
            })}
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <Link
                href="/"
                className="-m-1.5 p-1.5 focus-within:outline-none focus-within:outline-offset-2 focus-within:outline-indigo-500"
              >
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt=""
                />
              </Link>
            </div>
            <div className="flex lg:hidden">
              <button
                onClick={() => openAuthenticationDialog()}
                className="focused-link mr-6 text-sm font-semibold leading-6 text-white"
              >
                Log in or sign up
                <span className="ml-1" aria-hidden="true">
                  &rarr;
                </span>
              </button>
              <button
                type="button"
                className="focused-link -m-2.5 inline-flex items-center justify-center p-1.5 text-white"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-white focus-within:outline-none focus-within:outline-offset-8 focus-within:outline-indigo-500"
                >
                  {item.name}
                </Link>
              ))}
              <Navigation />
            </div>
            <div className="hidden items-center gap-x-6 lg:flex lg:flex-1 lg:justify-end">
              <button
                type="button"
                className="rounded-sm bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-indigo-500"
              >
                Join Premium
              </button>
              <button
                onClick={() => openAuthenticationDialog()}
                className="text-sm font-semibold leading-6 text-white focus-within:outline-none focus-within:outline-offset-8 focus-within:outline-indigo-500"
              >
                Log in or sign up<span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </nav>
          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <a href="#" className="focused-link -m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt=""
                  />
                </a>
                <button
                  type="button"
                  className="focused-link -m-2.5 p-1.5 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/25">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="focused-link -mx-3 block px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <button className="focused-link -mx-3 block px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800">
                      Log in
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>
      </div>

      <main>{children}</main>
    </>
  );
}
