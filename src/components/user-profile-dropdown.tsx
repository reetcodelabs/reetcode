import Link from "next/link";
import { Fragment } from "react";
import classNames from "classnames";
import Avvvatars from "avvvatars-react";
import { Menu, Transition } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { IronSessionData } from "iron-session";

import { Alert } from "./Notification";
import { axiosClient } from "@/utils/axios";

const userNavigation = [
  { name: "Account settings", href: "/account/settings" },
  { name: "Sign out" },
];

interface UserProfileDropdownProps {
  session?: IronSessionData | null;
}

export function UserProfileDropdown({ session }: UserProfileDropdownProps) {
  const router = useRouter();

  const signOutMutation = useMutation({
    async mutationFn() {
      await axiosClient.post("/accounts/signout");
    },
    onSuccess() {
      window.location.href = `/?successMessage=You have been signed out successfully.`;
    },
    onError() {
      toast.custom(
        ({ visible }) => (
          <Alert
            variant="error"
            title="Failed to sign you out."
            description={
              "We couldn't sign you out at this moment. Please refresh the page and try again."
            }
            className={visible ? "animate-enter" : "animate-leave"}
          />
        ),
        { position: "top-center" },
      );
    },
  });

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="hidden sm:flex sm:items-center">
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="focused-link relative flex h-10 max-w-xs items-center rounded-full border border-slate-50/[0.06] bg-slate-900 px-3 text-sm focus:outline-offset-1 focus-visible:outline-offset-1">
              <span className=" pr-3 text-xs text-white">
                {session?.user?.email}
              </span>
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              <Avvvatars
                style="shape"
                size={24}
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
                  {session?.user?.email}
                </span>
              </p>
              <p className="truncate border-slate-50/[0.06]">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => {
                      const className = classNames(
                        active ? "bg-slate-800 text-white" : "",
                        "block px-4 py-2 text-sm text-slate-400",
                      );

                      if (item.href) {
                        return (
                          <Link href={item.href} className={className}>
                            {item.name}
                          </Link>
                        );
                      }

                      return (
                        <button
                          onClick={() => signOutMutation.mutate()}
                          className={classNames(className, "w-full text-left")}
                        >
                          {item.name}
                        </button>
                      );
                    }}
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
