import { type NextPage } from "next";
import Head from "next/head";
import BaseLayout from "@/layouts/base";
import { Button, Paper } from "@mantine/core";
import { APP_EXPECTED_RELEASE_DATE, APP_NAME, APP_TAGLINE } from "@/const";
import { IconBrandTwitter, IconMail } from "@tabler/icons";
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
        <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#4DABF7] to-[#1864AB]">
          <div className="container flex flex-col items-center justify-center gap-1 px-4 py-10 ">
            <h1 className="text-6xl font-bold tracking-tight text-white sm:text-[5rem] sm:font-extrabold">
              {APP_NAME}
            </h1>
            <p className="text-sm italic text-white sm:text-lg">
              {APP_TAGLINE}
            </p>
          </div>
          <Link href="/dashboard">
            <Button color="dark" size="lg" radius="lg">
              Open App
            </Button>
          </Link>
          <Paper shadow="xl" mt="sm" p="xs" className="flex flex-col">
            <div className="mb-2 text-center text-sm font-medium sm:text-base">
              Find us at...
            </div>
            <div className="flex gap-1">
              <a href="mailto:chatpat@henil.xyz">
                <Button color="red">
                  <IconMail />
                </Button>
              </a>
              <a href="https://twitter.com/realchatpat">
                <Button>
                  <IconBrandTwitter />
                </Button>
              </a>
            </div>
          </Paper>
        </main>
      </BaseLayout>
    </>
  );
};

export default Home;
