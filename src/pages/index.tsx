import { type NextPage } from "next";
import Head from "next/head";
import BaseLayout from "@/layouts/base";
import { Paper } from "@mantine/core";
import { APP_EXPECTED_RELEASE_DATE, APP_NAME, APP_TAGLINE } from "@/const";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          {APP_NAME} - {APP_TAGLINE}
        </title>
        <meta name="description" content={`${APP_NAME} - ${APP_TAGLINE}`} />
      </Head>
      <BaseLayout>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4DABF7] to-[#1864AB]">
          <Paper shadow="xl" p="md">
            Coming Soon
          </Paper>
          <div className="container flex flex-col items-center justify-center gap-2 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              {APP_NAME}
            </h1>
            <p className="italic text-white">{APP_TAGLINE}</p>
          </div>
          <Paper shadow="xl" my="sm" p="xs">
            Expected Date of Release:{" "}
            <span className="text-red-700">{APP_EXPECTED_RELEASE_DATE}</span>
          </Paper>
        </main>
      </BaseLayout>
    </>
  );
};

export default Home;
