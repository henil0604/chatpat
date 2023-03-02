import { type NextPage } from "next";
import Head from "next/head";
import { APP_NAME } from "@/const";
import AuthLayout from "@/layouts/auth";
import CreateRoomCard from "@/components/CreateRoomCard";
import JoinRoomCard from "@/components/JoinRoomCard";
import ProfileCard from "@/components/ProfileCard";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>{APP_NAME} - Dashboard</title>
        <meta name="description" content={`${APP_NAME} - Dashboard`} />
      </Head>
      <AuthLayout>
        <main className="h-dscreen flex flex-col items-center justify-center bg-gradient-to-b from-[#4DABF7] to-[#1864AB] pt-5">
          <ProfileCard />
          <div className="flex flex-col items-center justify-center gap-10 py-10 sm:flex-row sm:gap-5">
            <CreateRoomCard />
            <JoinRoomCard />
          </div>
        </main>
      </AuthLayout>
    </>
  );
};

export default Dashboard;
