import { type NextPage } from "next";
import Head from "next/head";
import BaseLayout from "@/layouts/base";
import { Button } from "@mantine/core";
import { APP_NAME, APP_TAGLINE } from "@/const";
import Link from "next/link";

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
        <main className="h-dscreen flex flex-col items-center justify-center bg-gradient-to-b from-[#4DABF7] to-[#1864AB]">
          <div className="container flex flex-col items-center justify-center gap-2 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              {APP_NAME}
            </h1>
            <p className="italic text-white">{APP_TAGLINE}</p>
          </div>
          <Link href="/dashboard">
            <Button color="dark" size="lg" radius="lg">
              Open App
            </Button>
          </Link>
        </main>
      </BaseLayout>
    </>
  );
};

export default Home;
