import { type NextPage } from "next";
import Head from "next/head";
import BaseLayout from "@/layouts/base";
import { Paper } from "@mantine/core";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ChatPat - Your Private Place to talk</title>
        <meta
          name="description"
          content="ChatPat - Your Private Place to talk"
        />
      </Head>
      <BaseLayout>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4DABF7] to-[#1864AB]">
          <Paper shadow="xl" color="red" p="md">
            Coming Soon
          </Paper>
          <div className="container flex flex-col items-center justify-center gap-2 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Chat<span className="">Pat</span>
            </h1>
            <p className="italic text-white">Your Private Place to talk</p>
          </div>
        </main>
      </BaseLayout>
    </>
  );
};

export default Home;
