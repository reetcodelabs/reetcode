import { Button } from "@/components/button";
import { getServerSidePropsWithAuth } from "@/server/auth";
import { type GetServerSideProps } from "next";
import { type Session } from "next-auth";

export default function AccountSettings() {
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

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-white">
              Premium discord
            </h3>
            <div className="mt-2 max-w-xl text-sm text-slate-400">
              <p>
                Join our vibrant community of other software engineers
                supporting each other solve real world engineering problems,
                plus other secret perks we have for you.
              </p>
            </div>
            <div className="mt-5">
              <Button>Join the premium discord</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = (ctx) =>
  getServerSidePropsWithAuth(ctx, (ctx, session) => {
    return {
      props: {
        session,
      },
    };
  });
