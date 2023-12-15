import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import Link from "next/link";
import { type Session } from "next-auth";
import Avvvatars from "avvvatars-react";

const userNavigation = [
  { name: "Account settings", href: "/account/settings" },
  { name: "Sign out", href: "" },
];

interface UserProfileDropdownProps {
  session?: Session | null;
}

export function UserProfileDropdown({ session }: UserProfileDropdownProps) {
  if (!session) {
    return null;
  }

  return (
    <>
      <div className="hidden sm:flex sm:items-center">
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              <Avvvatars
                style="shape"
                value={session.user?.email ?? "john@doe.com"}
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md border border-slate-50/[0.06] bg-slate-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <p
                className="truncate border-b border-slate-50/[0.06] px-3.5 py-3"
                role="none"
              >
                <span className="block text-xs text-slate-400" role="none">
                  Signed in as
                </span>
                <span
                  className="mt-0.5 text-sm font-semibold text-white"
                  role="none"
                >
                  bahdcoder@gmail.com
                </span>
              </p>
              <p className="truncate border-slate-50/[0.06]">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        href={item.href}
                        className={classNames(
                          active ? "bg-slate-800 text-white" : "",
                          "block px-4 py-2 text-sm text-slate-400",
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </p>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
}
