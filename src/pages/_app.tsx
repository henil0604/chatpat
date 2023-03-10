import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";
import { createEmotionCache, MantineProvider } from "@mantine/core";

import "@/styles/globals.css";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";

const appendCache = createEmotionCache({ key: "mantine-ui", prepend: false });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <SessionProvider session={session}>
        <MantineProvider
          emotionCache={appendCache}
          // withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "light",
            loader: "dots",
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </RecoilRoot>
  );
};

export default api.withTRPC(MyApp);
