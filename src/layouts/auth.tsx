import { signIn, useSession } from "next-auth/react";
import { Button } from "@mantine/core";
import BaseLayout from "@/layouts/base";
import { useEffect } from "react";
import { setLoading } from "@/store/loading";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons";

interface AuthLayoutProps {
  children: any;
  PreAuth?: any;
  PostAuth?: any;
  styles?: object;
  className?: string;
}

const ContinueWithGithub = () => {
  const handleClick = () => {
    void signIn("github", {
      callbackUrl: location.href,
    });
  };

  return (
    <>
      <Button color="dark" leftIcon={<IconBrandGithub />} onClick={handleClick}>
        Continue With Github
      </Button>
    </>
  );
};

const ContinueWithGoogle = () => {
  const handleClick = () => {
    void signIn("google", {
      callbackUrl: location.href,
    });
  };

  return (
    <>
      <Button
        variant="white"
        styles={(theme: any) => ({
          root: {
            backgroundColor: "#fff",
            color: "black",

            "&:hover": {
              backgroundColor: theme.fn.darken("#fff", 0.05),
            },
          },
        })}
        leftIcon={<IconBrandGoogle />}
        onClick={handleClick}
      >
        Continue With Google
      </Button>
    </>
  );
};

export default function AuthLayout({
  children,
  PreAuth,
  PostAuth,
  styles,
  className,
}: AuthLayoutProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" || status === "authenticated") {
      setLoading(false);
    }

    if (status === "loading") {
      setLoading(true);
    }
  }, [session, status]);

  return (
    <>
      <BaseLayout>
        {!session && (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "0 20px",
              ...styles,
            }}
            className={"gap-4 " + (className ? className : "")}
          >
            {PreAuth && PreAuth}
            <ContinueWithGoogle />
            <ContinueWithGithub />
            {PostAuth && PostAuth}
          </div>
        )}
        {session && children}
      </BaseLayout>
    </>
  );
}
