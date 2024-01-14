import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import classnames from "classnames";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { useState } from "react";

const navigation = [
  { name: "Explore", href: "/" },
  { name: "Dashboard", href: "/problems" },
];

import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { type IronSessionData } from "iron-session";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Toaster } from "react-hot-toast";

import { Banner } from "@/components/banner";
import { RenderIf } from "@/components/RenderIf";
import { SignInOrSignUp } from "@/components/signin";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { useSession } from "@/hooks/useSession";
import { useSignInPopup } from "@/hooks/useSignInPopup";
import ProblemSets from "@/seed/problem-sets.json";

const solutions = ProblemSets.slice(0, 5);

export function Navigation() {
  return (
    <Popover className="relative">
      <Popover.Button className="focused-link inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-white">
        {({ open }) => (
          <Fragment>
            <span>Problem sets</span>
            <ChevronDownIcon
              className={classnames("h-5 w-5 transition ease-linear", {
                "rotate-180 transform": open,
              })}
              aria-hidden="true"
            />
          </Fragment>
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
                  href={{
                    pathname: "/problem-sets/[slug]/",
                    query: { slug: item.slug },
                  }}
                  key={item.slug}
                  className="group relative flex gap-x-6 rounded-sm p-4 focus-within:outline-none focus-within:outline-indigo-500 hover:bg-slate-800"
                >
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-slate-800 group-hover:bg-slate-900">
                    <img
                      className="h-6 w-6 text-slate-400 group-hover:text-indigo-600"
                      aria-hidden="true"
                      src={item?.icon}
                      alt={`Icon for problem set: ${item?.name}`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">
                      {item.name}
                      <span className="absolute inset-0" />
                    </p>
                    <p className="mt-1 text-slate-400">
                      {item?.shortDescription}
                    </p>
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

export function MainLayout({
  children,
  session,
}: PropsWithChildren<{ session?: IronSessionData | null }>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { openSignInPopup } = useSignInPopup();
  const { subscription } = useSession({ session });

  const router = useRouter();

  const isHome = router.pathname === "/";
  // const isProblemPage = router.pathname === "/problems/[slug]";
  const isProblemPage = false;

  const openAuthenticationDialog = () => {
    openSignInPopup();
  };

  const LoginOrSignUpLink = session?.user ? (
    <>
      <UserProfileDropdown session={session} />
    </>
  ) : (
    <button
      onClick={() => openAuthenticationDialog()}
      className="text-sm font-semibold leading-6 text-white focus-within:outline-none focus-within:outline-offset-8 focus-within:outline-indigo-500"
    >
      Log in or sign up
      <span aria-hidden="true" className="ml-1">
        &rarr;
      </span>
    </button>
  );

  const hasBanner = subscription?.isExpiringSoon || subscription?.isExpired;

  return (
    <>
      <RenderIf if={!isProblemPage}>
        {subscription?.isExpiringSoon || subscription?.isExpired ? (
          <Banner
            title={
              subscription?.isExpired
                ? `Your subscription expired ${Math.abs(
                    subscription?.daysUntilExpiry,
                  )} days ago.`
                : `Your subscription expires in ${subscription?.daysUntilExpiry} days.`
            }
            content="Renew your subscription now"
            href="/pricing"
            variant={subscription?.isExpired ? "danger" : "info"}
          />
        ) : null}
      </RenderIf>
      <Toaster position="bottom-center" toastOptions={{ duration: 6000 }} />
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
          "pt-8": hasBanner && isHome,
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
              "px-6 py-4 xl:px-0": !isHome && !isProblemPage,
              "px-6 py-2 xl:px-0": isProblemPage,
            })}
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <Link
                href="/"
                className="-m-1.5 p-1.5 focus-within:outline-none focus-within:outline-offset-2 focus-within:outline-indigo-500"
              >
                <span className="sr-only">Reetcode</span>
                <img
                  className="h-8 w-auto"
                  src="/images/logo-desktop.png"
                  alt="reetcode logo desktop"
                />
              </Link>
            </div>
            <div className="flex lg:hidden">
              <div className="mr-3">{LoginOrSignUpLink}</div>
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
              {session?.user?.subscription ? null : (
                <Link
                  href="/pricing"
                  className="rounded-sm bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-indigo-500"
                >
                  Join Premium
                </Link>
              )}
              {LoginOrSignUpLink}
            </div>
          </nav>
          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <a href="#" className="focused-link -m-1.5 p-1.5">
                  <span className="sr-only"></span>
                  <img
                    className="h-8 w-auto"
                    src="/images/logo-desktop.png"
                    alt="reetcode"
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
