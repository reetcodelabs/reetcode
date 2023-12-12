import Link from "next/link";
import classnames from "classnames";
import { PropsWithChildren } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Explore", href: "#" },
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
const callsToAction: any[] = [
  // { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  // { name: "Contact sales", href: "#", icon: PhoneIcon },
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
            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
              {callsToAction.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                >
                  <item.icon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export function UserLinks() {
  const { setTheme, theme } = useTheme();
  const { userId } = useAuth();

  return (
    <div className="ml-auto flex items-center space-x-4">
      {userId ? null : (
        <>
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Register
            </button>
          </SignUpButton>
        </>
      )}

      <div className="h-8 w-8">
        <UserButton />
      </div>

      <Button variant="default" size="sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          className="mr-2 h-4 w-4 -rotate-[10deg] transform fill-current text-[#FFFF00]"
          viewBox="0 0 256 256"
          xmlSpace="preserve"
        >
          <defs></defs>
          <g
            style={{
              stroke: "none",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 10,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
          >
            <path
              d="M 78.517 77.617 H 11.483 c -0.951 0 -1.77 -0.669 -1.959 -1.601 L 0.041 29.542 c -0.159 -0.778 0.157 -1.576 0.806 -2.034 c 0.648 -0.459 1.506 -0.489 2.186 -0.079 l 25.585 15.421 l 14.591 -29.358 c 0.335 -0.674 1.021 -1.104 1.774 -1.11 c 0.709 -0.003 1.445 0.411 1.792 1.08 l 15.075 29.1 L 86.968 27.43 c 0.681 -0.41 1.537 -0.379 2.186 0.079 s 0.965 1.256 0.807 2.034 l -9.483 46.474 C 80.286 76.948 79.467 77.617 78.517 77.617 z"
              style={{
                stroke: "none",
                strokeWidth: 1,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeMiterlimit: 10,
                fill: "currentColor",
                fillRule: "nonzero",
                opacity: 1,
              }}
              transform=" matrix(1 0 0 1 0 0) "
              strokeLinecap="round"
            />
          </g>
        </svg>
        Premium
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={function () {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}

export function NavLinks() {
  return (
    <nav className={"flex items-center space-x-4 lg:space-x-6"}>
      <Link
        href="/challenges"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Challenges
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Discussions
      </Link>
    </nav>
  );
}

export function MainOldLayout({ children }: PropsWithChildren) {
  const { setTheme, theme } = useTheme();
  return null;
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-50 flex h-12 items-center border-b bg-background px-4">
          <div className="mx-auto flex w-full max-w-6xl items-center">
            <NavLinks />
            <UserLinks />
          </div>
        </div>

        <main className="mx-auto max-w-6xl">{children}</main>
      </div>
      <footer className="mt-32 flex w-full items-center border-t border-input py-8 text-center">
        <div className="mx-auto flex w-full max-w-6xl text-sm text-muted-foreground">
          <p>Copyright © 2023 ReetCode</p>
        </div>
      </footer>
    </div>
  );
}

export function MainLayout({ children }: PropsWithChildren) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  const isHome = router.pathname === "/";
  const isProblemPage = router.pathname === "/problems/[slug]";

  return (
    <>
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
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
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
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-white focus-within:outline-none focus-within:outline-offset-8 focus-within:outline-indigo-500"
              >
                Log in or sign up<span aria-hidden="true">&rarr;</span>
              </a>
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
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt=""
                  />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-white"
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
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
                      Log in
                    </a>
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
