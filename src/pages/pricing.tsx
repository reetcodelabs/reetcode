import { useState } from "react";
import classNames from "classnames";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

import { Button } from "@/components/button";

import { env } from "@/env";

import { usePaystackPayment } from "react-paystack";
import { useSignInPopup } from "@/hooks/useSignInPopup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Alert } from "@/components/Notification";
import { withIronSessionSsr } from "@/utils/session";
import { axiosClient } from "@/utils/axios";
import { type IronSessionData } from "iron-session";
import { useSession } from "@/hooks/useSession";
import { RenderIf } from "@/components/RenderIf";
import dayjs from "dayjs";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];

const freePlanFeatures = [
  "2 problems / challenges per month",
  "1 video solution per month",
  "3 Quizzes per month",
  "Solve problems locally",
  "New content every week",
  "New problems / challenges every week",
];

export const premiumPlanFeatures = [
  "Unlimited problems / challenges",
  "Unlimited video solutions",
  "View community submissions",
  "Solve problems locally",
  "Private community discord access",
  "Access to premium content",
  "New content every week",
  "New problems / challenges every week",
];

type SubscriptionPlan = "monthly" | "annually" | "lifetime";

const pricing: Record<SubscriptionPlan, string> = {
  monthly: "₦ 4,990",
  annually: "₦ 29,990",
  lifetime: "",
};

const pricingAmounts = {
  monthly: 499000,
  annually: 2999000,
  lifetime: 3999000,
};

export interface PricingPageProps {
  session: IronSessionData | null;
}

type PaystackCallbackPayload = {
  reference: string;
  status: string;
};

export default function PricingPage({ session }: PricingPageProps) {
  const [frequency, setFrequency] = useState<SubscriptionPlan>("annually");

  const { openSignInPopup } = useSignInPopup();

  const { subscription } = useSession({ session });
  const renewalExtendsUntil = dayjs(session?.user?.subscription?.expiresAt)
    .add(1, frequency === "monthly" ? "month" : "year")
    .format("ddd D MMM, YYYY");

  const subscribeCustomer = useMutation<
    unknown,
    unknown,
    { reference: string; plan: SubscriptionPlan }
  >({
    async mutationFn({ reference, plan }) {
      const response = await axiosClient.post<{ message: string }>(
        "/subscriptions/create/",
        {
          reference,
          plan,
        },
      );

      return response.data;
    },
    onSuccess() {
      window.location.href = `/?successMessage=Thank you for subscribing. Welcome to Premium. You now have access to everything we have to offer.`;
    },
    onError() {
      toast.custom(
        ({ visible }) => (
          <Alert
            variant="error"
            title="Failed to create your subscription."
            description={
              "If you have been debited, please reach out to our team and we'll figure it out immediately."
            }
            className={visible ? "animate-enter" : "animate-leave"}
          />
        ),
        { position: "top-center", duration: 25000 },
      );
    },
  });

  const initializeMonthlyPayment = usePaystackPayment({
    publicKey: env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: session?.user?.email ?? "",
    amount: pricingAmounts.monthly,
  });

  const initializeAnnuallyPayment = usePaystackPayment({
    publicKey: env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: session?.user?.email ?? "",
    amount: pricingAmounts.annually,
  });

  const initializeLifetimePayment = usePaystackPayment({
    publicKey: env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: session?.user?.email ?? "",
    amount: pricingAmounts.lifetime,
  });

  function onSubscribe(plan: SubscriptionPlan) {
    if (!session?.user?.email) {
      return openSignInPopup();
    }

    function onSuccess({
      reference,
      status,
      plan,
    }: {
      reference: string;
      status: string;
      plan: SubscriptionPlan;
    }) {
      if (status !== "success") {
        toast.custom(
          ({ visible }) => (
            <Alert
              variant="error"
              title="Failed to subscribe."
              description={
                "It seems like you did not complete your payment. Please retry your payment or contact us for support."
              }
              className={visible ? "animate-enter" : "animate-leave"}
            />
          ),
          { position: "top-center" },
        );

        return;
      }

      subscribeCustomer.mutate({ reference, plan });
    }

    switch (plan) {
      case "monthly":
        initializeMonthlyPayment(((payload: PaystackCallbackPayload) =>
          onSuccess({ ...payload, plan })) as unknown as () => void);
        break;
      case "annually":
        initializeAnnuallyPayment(((payload: PaystackCallbackPayload) =>
          onSuccess({ ...payload, plan })) as unknown as () => void);
        break;
      case "lifetime":
        initializeLifetimePayment(((payload: PaystackCallbackPayload) =>
          onSuccess({ ...payload, plan })) as unknown as () => void);
        break;
    }
  }

  return (
    <div className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 md:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">
            Simple, straight forward pricing.
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-4xl font-bold leading-10 text-white sm:text-5xl">
            Invest in yourself. Gain real world problem solving skills.
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-slate-400">
          Choose an affordable plan that works for you. Invest in your career,
          and learn from world class software engineers with decades of
          experience.
        </p>

        <div className="mx-auto mt-16 flex w-full max-w-3xl flex-col gap-y-6 md:mt-32 md:flex-row">
          <div className="h-auto w-full self-start rounded-xl border-b border-l border-r border-t border-slate-50/[0.06] bg-slate-800 p-5 md:w-auto md:rounded-l-xl md:rounded-r-none md:border-r-transparent xl:p-6">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-lg font-semibold leading-8 text-white">
                Free plan
              </h3>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-300">
              No need to subscribe right away. Take advantage of our free plan.
            </p>

            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-white">
                ₦ 0
              </span>
              <span className="text-sm font-semibold leading-6 text-gray-300">
                / month
              </span>
            </p>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-slate-400 xl:mt-10"
            >
              {freePlanFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-white"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mb-12"></div>
          </div>
          <div className="w-full flex-shrink-0 rounded-xl rounded-r-xl border-2 border-indigo-600 bg-slate-900 p-5 md:-mt-20 md:w-[55%] md:rounded-l-none xl:p-6">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-lg font-semibold leading-8 text-white">
                Premium plan
              </h3>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
              accusantium reprehenderit harum commod
            </p>

            <div className="mt-4 flex justify-start">
              <RadioGroup
                value={frequency}
                onChange={setFrequency}
                className="grid grid-cols-2 gap-x-1 rounded-full bg-slate-800 p-1 text-center text-xs font-semibold leading-5 text-white"
              >
                <RadioGroup.Label className="sr-only">
                  Payment frequency
                </RadioGroup.Label>
                {frequencies.map((option) => (
                  <RadioGroup.Option
                    key={option.value}
                    value={option.value}
                    className={({ checked }) =>
                      classNames(
                        checked ? "bg-indigo-600" : "",
                        "cursor-pointer rounded-full px-2.5 py-1",
                      )
                    }
                  >
                    <span>{option.label}</span>
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>

            <div className="mt-6 flex items-center gap-x-1">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {pricing[frequency]}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-300">
                  / {frequency === "monthly" ? "month" : "year"}
                </span>
              </div>

              {frequency === "annually" ? (
                <p className="ml-6 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                  Save over 60%
                </p>
              ) : null}
            </div>

            <RenderIf if={subscription?.isActive}>
              <div className="mt-10 w-full rounded-sm bg-slate-800 p-4 text-sm text-white">
                You are currently on the premium plan ✨
                <p className="mt-0.5 text-xs text-slate-400">
                  Expires on: {subscription?.expiresAt}
                </p>
              </div>
            </RenderIf>

            <RenderIf if={!subscription?.isLifetimeSubscription}>
              <Button
                className="mt-4 w-full py-4"
                isLoading={subscribeCustomer.isLoading}
                onClick={() => onSubscribe(frequency)}
              >
                {subscription?.isActive || subscription?.isExpired
                  ? "Renew your subscription"
                  : "Get instant access"}
              </Button>
              {subscription?.isActive || subscription?.isExpired ? (
                <p className="mt-2 text-xs text-slate-400">
                  Your subscription will extend until {renewalExtendsUntil}
                </p>
              ) : null}
            </RenderIf>

            <ul
              role="list"
              className="mt-4 space-y-3 text-sm leading-6 text-slate-400 xl:mt-6"
            >
              {premiumPlanFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-white"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get full access forever
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Make a lifetime commitment to your career growth, get full
              unlimited access forever by making one single purchase.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl rounded-3xl ring-1 ring-slate-50/[0.06] sm:mt-20 md:mt-16 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Lifetime membership
              </h3>
              <p className="mt-6 text-base leading-7 text-slate-400">
                Pay once, saving 60% on the monthly price, and get full access
                to the platform forever, including all future updates.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                  What’s included
                </h4>
                <div className="h-px flex-auto bg-slate-400" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-400 sm:grid-cols-2 sm:gap-6"
              >
                {premiumPlanFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3 text-slate-400">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-slate-800 py-10 text-center ring-1 ring-inset ring-slate-50/[0.06] lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div
                  className={classNames("mx-auto  px-8", {
                    "max-w-xs":
                      session?.user?.subscription?.plan !== "LIFETIME",
                    "max-w-full":
                      session?.user?.subscription?.plan === "LIFETIME",
                  })}
                >
                  <p className="text-base font-semibold text-white">
                    Pay once, get access forever
                  </p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      ₦ 39, 990
                    </span>
                  </p>
                  {session?.user?.subscription?.plan === "LIFETIME" ? (
                    <div className="mt-10 w-full rounded-sm bg-slate-900 p-4 text-sm text-white">
                      You are already on the lifetime plan ✨
                    </div>
                  ) : (
                    <Button
                      className="mt-10 w-full py-4"
                      onClick={() => onSubscribe("lifetime")}
                      isLoading={subscribeCustomer.isLoading}
                    >
                      Get full access forever
                    </Button>
                  )}

                  <p className="mt-6 text-xs leading-5 text-slate-400">
                    Invoices and receipts available for easy company
                    reimbursement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
