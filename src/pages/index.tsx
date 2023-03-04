import { type NextPage } from "next";
import Head from "next/head";
import BaseLayout from "@/layouts/base";
import { Button, Paper } from "@mantine/core";
import { APP_EXPECTED_RELEASE_DATE, APP_NAME, APP_TAGLINE } from "@/const";
import { IconBrandTwitter, IconMail } from "@tabler/icons";
import Link from "next/link";

const Home: NextPage = () => {
  const title = `${APP_NAME} - ${APP_TAGLINE}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${title}`} />
      </Head>
      <BaseLayout>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4DABF7] to-[#1864AB]">
          <Paper shadow="xl" p="sm" className="font-bold">
            Coming Soon
          </Paper>
          <div className="container flex flex-col items-center justify-center gap-1 px-4 py-10 ">
            <h1 className="text-6xl font-bold tracking-tight text-white sm:text-[5rem] sm:font-extrabold">
              {APP_NAME}
            </h1>
            <p className="text-sm italic text-white sm:text-lg">
              {APP_TAGLINE}
            </p>
          </div>
          <Paper shadow="xl" p="xs">
            Expected Date of Release:{" "}
            <span className="text-red-700">{APP_EXPECTED_RELEASE_DATE}</span>
          </Paper>
          <Link href="/preregister" className="mt-4">
            <Button color="dark" my="md" size="lg" radius="lg">
              Preregister Now!
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
