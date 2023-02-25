import { NextPage } from "next";
import Head from "next/head";
import AuthLayout from "@/layouts/auth";
import useUser from "@/hooks/useUser";
import { APP_NAME, APP_TAGLINE } from "@/const";

const PreAuth = () => {
  return (
    <div className="mb-10">
      <div className="container flex flex-col items-center justify-center px-4 sm:gap-2">
        <h1 className="py-2 text-2xl font-extrabold tracking-tight text-white sm:text-[3rem]">
          Pre-Register for {APP_NAME}
        </h1>
        <p className="text-sm italic text-white sm:text-base">
          Get a chance to join Early Access Team
        </p>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Pre-registration of {APP_NAME}</title>
        <meta name="description" content={`${APP_NAME} - ${APP_TAGLINE}`} />
      </Head>
      <AuthLayout
        PreAuth={<PreAuth />}
        className="bg-gradient-to-b from-[#4DABF7] to-[#1864AB]"
      >
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 px-5">
          <p>
            Hey{" "}
            <span className="font-bold text-blue-600">{user && user.name}</span>
            , You have pre-registered successfully.
          </p>
          <p>You will be notified ASAP we choose you for early access.</p>
        </div>
      </AuthLayout>
    </>
  );
};

export default Home;
