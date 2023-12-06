import Link from "next/link";

import { PropsWithChildren } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

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

export function MainLayout({ children }: PropsWithChildren) {
  const { setTheme, theme } = useTheme();
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
