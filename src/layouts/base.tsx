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

  const { data, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" || status == "authenticated") {
      setLoading(true);
    }
  }, [status]);

  return (
    <div>
      {isLoading && <LoadingOverlay visible={true} overlayBlur={2} />}

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 6,
            left: 0,
            width: "100vw",
            height: "100vw",
            backgroundColor: "rgba(255, 255, 255, 0.99)",
            zIndex: 100,
            cursor: "wait",
          }}
        ></div>
      )}

      {children}
    </div>
  );
}
