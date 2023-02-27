import { type NextPage } from "next";
import Head from "next/head";
import { APP_NAME } from "@/const";
import AuthLayout from "@/layouts/auth";
import useUser from "@/hooks/useUser";

const Dashboard: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>{APP_NAME} - Dashboard</title>
        <meta name="description" content={`${APP_NAME} - Dashboard`} />
      </Head>
      <AuthLayout>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4DABF7] to-[#1864AB]">
          <div className="container flex flex-col items-center justify-center gap-2 px-4 py-16 ">
            <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-[2rem]">
              Hey, {user?.name}!
            </h1>
          </div>
        </main>
      </AuthLayout>
    </>
  );
};

export default Dashboard;
