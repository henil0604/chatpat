import { LoadingOverlay } from "@mantine/core";
import { useRecoilState } from "recoil";
import $loading from "@/store/loading";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface BaseLayoutProps {
  children: any;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const [isLoading, setLoading] = useRecoilState($loading);

  useEffect(() => {
    const updateVh = () => {
      document.body
        ?.style.setProperty("min-height", `${window.innerHeight}px`);
      document
        .getElementById("__next")
        ?.style.setProperty("min-height", `${window.innerHeight}px`);
    };

    window.addEventListener("resize", updateVh);

    return () => window.removeEventListener("resize", updateVh);
  }, []);

  const { data: _, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" || status == "authenticated") {
      setLoading(false);
    }

    if (status === "loading") {
      setLoading(true);
    }
  }, [status]);

  return (
    <div>
      {!isLoading && children}

      <LoadingOverlay
        transitionDuration={0}
        overlayOpacity={1}
        overlayColor="#ffffff"
        style={{
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
        visible={isLoading}
      />
    </div>
  );
}
