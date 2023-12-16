import dayjs from "dayjs";

import { Button } from "@/components/button";
import { withIronSessionSsr } from "@/utils/session";
import { premiumPlanFeatures } from "@/pages/pricing";

import { CheckIcon, LockClosedIcon } from "@heroicons/react/24/outline";

import { type PropsWithChildren, useState } from "react";
import { RadioGroup } from "@headlessui/react";

import { IronSessionData } from "iron-session";
import classNames from "classnames";
import { useSession } from "@/hooks/useSession";
import { RenderIf } from "@/components/RenderIf";

interface AccountSettingsProps {
  session: IronSessionData | null;
}

interface CardProps {
  title?: string;
  description?: string;
}

function Card({ children, title, description }: PropsWithChildren<CardProps>) {
  return (
    <div className="bg-slate-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-white">
          {title}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-slate-400">
          <p>{description}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default function AccountSettings({ session }: AccountSettingsProps) {
  const { subscription } = useSession({ session });

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-xl pb-24 pt-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Account settings
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Manage your subscription plan and other settings on your account.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-12 px-4 pb-32 sm:px-6 md:pb-56 lg:px-8">
        {subscription?.isActive ? (
          <Card
            title={`You are currently on a
          ${session?.user?.subscription?.plan?.toLowerCase()} premium plan
          ✨`}
            description="Thank you for investing in yourself and becoming part of our
          community."
          >
            <div className="mt-6 w-full rounded bg-slate-900 px-4 py-3 text-sm text-white ">
              Your subscription expires on {subscription?.expiresAt}.
            </div>

            {subscription?.isLifetimeSubscription ? null : (
              <Button className="mt-4 inline-block" href="/pricing" as="link">
                Renew your subscription
              </Button>
            )}
          </Card>
        ) : (
          <Card
            title="Join premium"
            description="Invest in your problem solving skills. Get full access to
          every resource you need to become a software engineer that
          solves industry problems for businesses."
          >
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-2 text-sm leading-6 text-slate-400"
            >
              {premiumPlanFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3 text-white">
                  <CheckIcon
                    className="h-5 w-4 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-5 w-full">
              <Button
                as="link"
                href="/pricing"
                className="block w-full max-w-[14rem] py-3 text-center"
              >
                View our plans
              </Button>
            </div>
          </Card>
        )}
        <Card
          title="Premium discord"
          description="Join our vibrant community of other software engineers
                supporting each other solve real world engineering problems,
                plus other secret perks we have for you."
        >
          <RenderIf if={!subscription.isActive}>
            <div className="mt-5 w-full rounded bg-slate-900 p-4 text-sm text-white">
              This feature is only available on the premium plan.
            </div>
          </RenderIf>
          <div className="mt-5">
            <Button
              target="_blank"
              href="https://discord.com"
              disabled={!subscription.isActive}
              as={subscription.isActive ? "link" : "button"}
              className="flex max-w-[16rem] items-center px-6 py-2 text-center"
            >
              <LockClosedIcon className="mr-2 h-4 w-4" />
              Join the premium discord
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    return {
      props: {
        session: ctx.req.session,
      },
    };
  },
);
