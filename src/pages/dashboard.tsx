import { type NextPage } from "next";
import Head from "next/head";
import { APP_NAME } from "@/const";
import AuthLayout from "@/layouts/auth";
import useUser from "@/hooks/useUser";
import CreateRoomCard from "@/components/CreateRoomCard";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME} - Dashboard</title>
        <meta name="description" content={`${APP_NAME} - Dashboard`} />
      </Head>
      <AuthLayout>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4DABF7] to-[#1864AB]">
          <div className="container flex flex-col items-center justify-center gap-10 px-4 py-16 sm:flex-row sm:gap-5">
            <CreateRoomCard />
          </div>
        </main>
      </AuthLayout>
    </>
  );
};

export default Dashboard;
